-- ShoufHon shop likes.
-- One permanent like per browser visitor and shop. The RPC is the only write path.

create table if not exists public.shop_likes (
  id bigint generated always as identity primary key,
  shop_slug text not null references public.shop_profiles(shop_slug) on update cascade on delete cascade,
  visitor_id text not null check (char_length(visitor_id) between 8 and 160),
  actor_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint shop_likes_shop_visitor_key unique (shop_slug, visitor_id)
);

alter table public.shop_likes enable row level security;
revoke all on table public.shop_likes from public, anon, authenticated;
revoke all on sequence public.shop_likes_id_seq from public, anon, authenticated;

create index if not exists shop_likes_actor_user_id_idx
  on public.shop_likes(actor_user_id)
  where actor_user_id is not null;

alter table public.ma7alak_owner_notifications
  drop constraint if exists ma7alak_owner_notifications_type_check;

alter table public.ma7alak_owner_notifications
  add constraint ma7alak_owner_notifications_type_check
  check (type = any(array['follow'::text,'story_like'::text,'shop_like'::text]));

create or replace function public.get_shop_like_state(
  p_shop_slug text,
  p_visitor_id text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_slug text := lower(btrim(coalesce(p_shop_slug,'')));
  v_canonical_slug text;
  v_visitor text := btrim(coalesce(p_visitor_id,''));
  v_liked boolean := false;
  v_count bigint := 0;
begin
  if char_length(v_slug) not between 1 and 160
     or v_slug !~ '^[a-z0-9][a-z0-9._&-]*$' then
    raise exception 'Invalid shop slug';
  end if;
  if char_length(v_visitor) not between 8 and 160 then
    raise exception 'Invalid visitor id';
  end if;

  select p.shop_slug
  into v_canonical_slug
  from public.shop_profiles p
  where lower(p.shop_slug)=v_slug
    and coalesce(p.is_active,true)=true
  limit 1;

  if v_canonical_slug is null then
    raise exception 'Shop not found';
  end if;

  select exists(
    select 1
    from public.shop_likes l
    where l.shop_slug=v_canonical_slug
      and l.visitor_id=v_visitor
  ) into v_liked;

  select count(*)::bigint
  into v_count
  from public.shop_likes l
  where l.shop_slug=v_canonical_slug;

  return jsonb_build_object(
    'liked',v_liked,
    'like_count',v_count,
    'cooldown_seconds',0
  );
end;
$$;

create or replace function public.like_shop(
  p_shop_slug text,
  p_visitor_id text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_slug text := lower(btrim(coalesce(p_shop_slug,'')));
  v_canonical_slug text;
  v_visitor text := btrim(coalesce(p_visitor_id,''));
  v_actor uuid := auth.uid();
  v_like_id bigint;
  v_count bigint := 0;
  v_created_at timestamptz;
begin
  if char_length(v_slug) not between 1 and 160
     or v_slug !~ '^[a-z0-9][a-z0-9._&-]*$' then
    raise exception 'Invalid shop slug';
  end if;
  if char_length(v_visitor) not between 8 and 160 then
    raise exception 'Invalid visitor id';
  end if;

  select p.shop_slug
  into v_canonical_slug
  from public.shop_profiles p
  where lower(p.shop_slug)=v_slug
    and coalesce(p.is_active,true)=true
  limit 1;

  if v_canonical_slug is null then
    raise exception 'Shop not found';
  end if;

  if v_actor is not null and exists(
    select 1
    from public.shop_owners o
    where o.user_id=v_actor
      and o.shop_slug=v_canonical_slug
  ) then
    return jsonb_build_object(
      'liked',false,
      'blocked',true,
      'message','You cannot like your own shop',
      'like_count',(
        select count(*)::bigint
        from public.shop_likes l
        where l.shop_slug=v_canonical_slug
      ),
      'cooldown_seconds',300
    );
  end if;

  insert into public.shop_likes(shop_slug,visitor_id,actor_user_id)
  values(v_canonical_slug,v_visitor,v_actor)
  on conflict(shop_slug,visitor_id) do nothing
  returning id,created_at into v_like_id,v_created_at;

  select count(*)::bigint
  into v_count
  from public.shop_likes l
  where l.shop_slug=v_canonical_slug;

  if v_like_id is null then
    return jsonb_build_object(
      'liked',true,
      'already_liked',true,
      'message','You already liked this shop',
      'like_count',v_count,
      'cooldown_seconds',300
    );
  end if;

  insert into public.ma7alak_owner_notifications(
    shop_slug,
    type,
    actor_user_id,
    actor_visitor_id,
    source_id
  )
  values(
    v_canonical_slug,
    'shop_like',
    v_actor,
    v_visitor,
    v_like_id::text
  );

  return jsonb_build_object(
    'liked',true,
    'already_liked',false,
    'message','Shop liked',
    'like_count',v_count,
    'cooldown_seconds',300,
    'created_at',v_created_at
  );
end;
$$;

revoke all on function public.get_shop_like_state(text,text) from public;
revoke all on function public.like_shop(text,text) from public;
grant execute on function public.get_shop_like_state(text,text) to anon,authenticated;
grant execute on function public.like_shop(text,text) to anon,authenticated;

comment on table public.shop_likes is
  'One permanent shop like per browser visitor; writes are only allowed through like_shop().';
