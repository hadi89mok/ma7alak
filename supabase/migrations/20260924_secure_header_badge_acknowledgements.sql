create table if not exists public.ma7alak_inbox_badge_ack (
  user_id uuid not null references auth.users(id) on delete cascade,
  scope text not null check (scope in ('viewer','owner')),
  acknowledged_at timestamptz not null default clock_timestamp(),
  primary key (user_id, scope)
);

alter table public.ma7alak_inbox_badge_ack enable row level security;
revoke all on table public.ma7alak_inbox_badge_ack from public, anon, authenticated;

create or replace function public.ma7alak_ack_inbox_badge(p_scope text)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_scope text := lower(btrim(coalesce(p_scope,'')));
  v_at timestamptz := clock_timestamp();
begin
  if v_uid is null then raise exception 'Not authenticated'; end if;
  if v_scope not in ('viewer','owner') then raise exception 'Invalid inbox scope'; end if;
  if v_scope='owner' and not exists(select 1 from public.shop_owners o where o.user_id=v_uid) then
    raise exception 'Owner inbox unavailable';
  end if;
  insert into public.ma7alak_inbox_badge_ack(user_id,scope,acknowledged_at)
  values(v_uid,v_scope,v_at)
  on conflict(user_id,scope) do update set acknowledged_at=excluded.acknowledged_at;
  return v_at;
end;
$function$;

create or replace function public.ma7alak_get_inbox_badge_count(p_scope text)
returns bigint
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_scope text := lower(btrim(coalesce(p_scope,'')));
  v_ack timestamptz := 'epoch'::timestamptz;
  v_count bigint := 0;
begin
  if v_uid is null then return 0; end if;
  if v_scope not in ('viewer','owner') then raise exception 'Invalid inbox scope'; end if;
  if v_scope='owner' and not exists(select 1 from public.shop_owners o where o.user_id=v_uid) then return 0; end if;

  select a.acknowledged_at into v_ack
  from public.ma7alak_inbox_badge_ack a
  where a.user_id=v_uid and a.scope=v_scope;

  v_ack:=coalesce(v_ack,'epoch'::timestamptz);

  select count(distinct c.id)
  into v_count
  from public.ma7alak_conversations c
  where (
    (v_scope='viewer' and c.viewer_id=v_uid)
    or
    (v_scope='owner' and (
      c.viewer_id=v_uid
      or exists(select 1 from public.shop_owners o where o.user_id=v_uid and o.shop_slug=c.shop_slug)
    ))
  )
  and exists(
    select 1
    from public.ma7alak_messages m
    where m.conversation_id=c.id
      and m.sender_id<>v_uid
      and m.created_at>greatest(
        v_ack,
        coalesce(
          case when c.viewer_id=v_uid then c.viewer_last_read_at else c.owner_last_read_at end,
          'epoch'::timestamptz
        )
      )
  );

  return coalesce(v_count,0);
end;
$function$;

revoke all on function public.ma7alak_ack_inbox_badge(text) from public, anon;
revoke all on function public.ma7alak_get_inbox_badge_count(text) from public, anon;
grant execute on function public.ma7alak_ack_inbox_badge(text) to authenticated;
grant execute on function public.ma7alak_get_inbox_badge_count(text) to authenticated;

create table if not exists public.ma7alak_notification_badge_ack (
  owner_token_hash text primary key,
  acknowledged_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp()
);

alter table public.ma7alak_notification_badge_ack enable row level security;
revoke all on table public.ma7alak_notification_badge_ack from public, anon, authenticated;

create or replace function public.ma7alak_get_notification_badge_ack(p_visitor_id text,p_interaction_token text)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_visitor text := btrim(coalesce(p_visitor_id,''));
  v_token text := btrim(coalesce(p_interaction_token,''));
  v_hash text;
  v_at timestamptz;
begin
  if not public.ma7alak_valid_follow_visitor_id(v_visitor) then raise exception 'Invalid visitor id'; end if;
  if not public.ma7alak_valid_interaction_token(v_token) then raise exception 'Invalid interaction token'; end if;
  v_hash:=private.ma7alak_interaction_owner_hash(v_visitor,v_token);
  select a.acknowledged_at into v_at
  from public.ma7alak_notification_badge_ack a
  where a.owner_token_hash=v_hash;
  return v_at;
end;
$function$;

create or replace function public.ma7alak_ack_notification_badge(p_visitor_id text,p_interaction_token text)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_visitor text := btrim(coalesce(p_visitor_id,''));
  v_token text := btrim(coalesce(p_interaction_token,''));
  v_hash text;
  v_at timestamptz := clock_timestamp();
begin
  if not public.ma7alak_valid_follow_visitor_id(v_visitor) then raise exception 'Invalid visitor id'; end if;
  if not public.ma7alak_valid_interaction_token(v_token) then raise exception 'Invalid interaction token'; end if;
  v_hash:=private.ma7alak_interaction_owner_hash(v_visitor,v_token);
  insert into public.ma7alak_notification_badge_ack(owner_token_hash,acknowledged_at,updated_at)
  values(v_hash,v_at,v_at)
  on conflict(owner_token_hash) do update set acknowledged_at=excluded.acknowledged_at,updated_at=excluded.updated_at;
  return v_at;
end;
$function$;

revoke all on function public.ma7alak_get_notification_badge_ack(text,text) from public;
revoke all on function public.ma7alak_ack_notification_badge(text,text) from public;
grant execute on function public.ma7alak_get_notification_badge_ack(text,text) to anon, authenticated;
grant execute on function public.ma7alak_ack_notification_badge(text,text) to anon, authenticated;
