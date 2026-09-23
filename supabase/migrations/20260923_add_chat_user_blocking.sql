create table if not exists public.ma7alak_chat_blocks (
  shop_slug text not null,
  blocked_user_id uuid not null,
  blocked_by_user_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (shop_slug, blocked_user_id)
);

create index if not exists ma7alak_chat_blocks_blocked_user_idx
  on public.ma7alak_chat_blocks (blocked_user_id);

alter table public.ma7alak_chat_blocks enable row level security;

revoke all on table public.ma7alak_chat_blocks from anon, authenticated;

create or replace function public.ma7alak_chat_is_blocked(
  p_shop_slug text,
  p_user_id uuid
)
returns boolean
language plpgsql
stable
security definer
set search_path to 'public'
as $function$
begin
  if auth.uid() is null then
    return false;
  end if;

  if p_user_id is distinct from auth.uid()
     and not public.ma7alak_is_shop_owner(p_shop_slug) then
    raise exception 'NOT_ALLOWED';
  end if;

  return exists(
    select 1
    from public.ma7alak_chat_blocks b
    where b.shop_slug = p_shop_slug
      and b.blocked_user_id = p_user_id
  );
end;
$function$;

revoke all on function public.ma7alak_chat_is_blocked(text,uuid) from public, anon;
grant execute on function public.ma7alak_chat_is_blocked(text,uuid) to authenticated;

create or replace function public.ma7alak_chat_block_state(
  p_conversation_id uuid
)
returns boolean
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  c public.ma7alak_conversations;
begin
  if auth.uid() is null then
    raise exception 'LOGIN_REQUIRED';
  end if;

  select *
  into c
  from public.ma7alak_conversations
  where id = p_conversation_id;

  if c.id is null then
    raise exception 'Conversation not found';
  end if;

  if not public.ma7alak_is_shop_owner(c.shop_slug) then
    raise exception 'OWNER_ONLY';
  end if;

  return exists(
    select 1
    from public.ma7alak_chat_blocks b
    where b.shop_slug = c.shop_slug
      and b.blocked_user_id = c.viewer_id
  );
end;
$function$;

revoke all on function public.ma7alak_chat_block_state(uuid) from public, anon;
grant execute on function public.ma7alak_chat_block_state(uuid) to authenticated;

create or replace function public.ma7alak_set_chat_block(
  p_conversation_id uuid,
  p_blocked boolean
)
returns boolean
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  c public.ma7alak_conversations;
begin
  if auth.uid() is null then
    raise exception 'LOGIN_REQUIRED';
  end if;

  select *
  into c
  from public.ma7alak_conversations
  where id = p_conversation_id;

  if c.id is null then
    raise exception 'Conversation not found';
  end if;

  if not public.ma7alak_is_shop_owner(c.shop_slug) then
    raise exception 'OWNER_ONLY';
  end if;

  if c.viewer_id = auth.uid() then
    raise exception 'CANNOT_BLOCK_SELF';
  end if;

  if coalesce(p_blocked,false) then
    insert into public.ma7alak_chat_blocks(
      shop_slug,
      blocked_user_id,
      blocked_by_user_id,
      created_at
    )
    values(
      c.shop_slug,
      c.viewer_id,
      auth.uid(),
      now()
    )
    on conflict (shop_slug, blocked_user_id)
    do update set
      blocked_by_user_id = excluded.blocked_by_user_id,
      created_at = now();
  else
    delete from public.ma7alak_chat_blocks
    where shop_slug = c.shop_slug
      and blocked_user_id = c.viewer_id;
  end if;

  return coalesce(p_blocked,false);
end;
$function$;

revoke all on function public.ma7alak_set_chat_block(uuid,boolean) from public, anon;
grant execute on function public.ma7alak_set_chat_block(uuid,boolean) to authenticated;

create or replace function public.ma7alak_start_conversation(p_shop_slug text)
returns public.ma7alak_conversations
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_row public.ma7alak_conversations;
  v_slug text := lower(btrim(p_shop_slug));
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if not exists(
    select 1
    from public.shop_profiles
    where lower(btrim(shop_slug)) = v_slug
  ) then
    raise exception 'Shop not found: %', v_slug;
  end if;

  select shop_slug
  into v_slug
  from public.shop_profiles
  where lower(btrim(shop_slug)) = v_slug
  limit 1;

  if exists(
    select 1
    from public.shop_owners
    where user_id = auth.uid()
      and shop_slug = v_slug
  ) then
    raise exception 'You cannot message your own shop';
  end if;

  if public.ma7alak_chat_is_blocked(v_slug, auth.uid()) then
    raise exception 'CHAT_BLOCKED_BY_SHOP';
  end if;

  insert into public.ma7alak_conversations(shop_slug,viewer_id)
  values(v_slug,auth.uid())
  on conflict(viewer_id,shop_slug)
  do update set updated_at = public.ma7alak_conversations.updated_at
  returning * into v_row;

  return v_row;
end;
$function$;

create or replace function public.ma7alak_send_message(
  p_conversation_id uuid,
  p_body text
)
returns public.ma7alak_messages
language plpgsql
set search_path to 'public'
as $function$
declare
  v_message public.ma7alak_messages;
  v_conversation public.ma7alak_conversations;
  v_body text := btrim(p_body);
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if char_length(v_body) < 1 or char_length(v_body) > 2000 then
    raise exception 'Message must be between 1 and 2000 characters';
  end if;

  if not public.ma7alak_can_access_conversation(p_conversation_id) then
    raise exception 'Conversation access denied';
  end if;

  select *
  into v_conversation
  from public.ma7alak_conversations
  where id = p_conversation_id;

  if v_conversation.id is null then
    raise exception 'Conversation not found';
  end if;

  if public.ma7alak_chat_is_blocked(
    v_conversation.shop_slug,
    v_conversation.viewer_id
  ) then
    raise exception 'CHAT_BLOCKED';
  end if;

  insert into public.ma7alak_messages(conversation_id, sender_id, body)
  values(p_conversation_id, auth.uid(), v_body)
  returning * into v_message;

  update public.ma7alak_conversations
  set updated_at = now()
  where id = p_conversation_id;

  return v_message;
end;
$function$;

create or replace function public.ma7alak_send_story_reply(
  p_story_id bigint,
  p_body text
)
returns public.ma7alak_messages
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_body text := btrim(coalesce(p_body,''));
  v_story record;
  v_conversation public.ma7alak_conversations%rowtype;
  v_message public.ma7alak_messages%rowtype;
  v_accepting boolean := true;
begin
  if v_uid is null then
    raise exception 'LOGIN_REQUIRED';
  end if;

  if not public.ma7alak_assert_active_viewer() then
    raise exception 'ACCOUNT_NOT_ACTIVE';
  end if;

  if p_story_id is null then
    raise exception 'STORY_REQUIRED';
  end if;

  if char_length(v_body) < 1 or char_length(v_body) > 2000 then
    raise exception 'Message must be between 1 and 2000 characters';
  end if;

  select
    s.id,
    s.shop_slug,
    s.media_type,
    s.storage_path,
    s.status_text,
    s.created_at,
    s.expires_at,
    sp.shop_name,
    sp.shop_url
  into v_story
  from public.shop_stories s
  join public.shop_profiles sp
    on sp.shop_slug=s.shop_slug
  where s.id=p_story_id
    and s.expires_at>now()
    and coalesce(sp.is_active,true)=true
  limit 1;

  if not found then
    raise exception 'STORY_UNAVAILABLE';
  end if;

  if exists(
    select 1
    from public.shop_owners o
    where o.user_id=v_uid
      and o.shop_slug=v_story.shop_slug
  ) then
    raise exception 'OWN_STORY_REPLY_NOT_ALLOWED';
  end if;

  if public.ma7alak_chat_is_blocked(v_story.shop_slug, v_uid) then
    raise exception 'CHAT_BLOCKED_BY_SHOP';
  end if;

  select coalesce(ms.accepting_messages,true)
  into v_accepting
  from public.ma7alak_shop_message_settings ms
  where ms.shop_slug=v_story.shop_slug;

  if not found then
    v_accepting:=true;
  end if;

  if not v_accepting then
    raise exception 'SHOP_NOT_ACCEPTING_MESSAGES';
  end if;

  insert into public.ma7alak_conversations(
    shop_slug,
    viewer_id,
    updated_at
  )
  values(
    v_story.shop_slug,
    v_uid,
    now()
  )
  on conflict(viewer_id,shop_slug)
  do update
  set updated_at=now()
  returning * into v_conversation;

  insert into public.ma7alak_messages(
    conversation_id,
    sender_id,
    body,
    message_type,
    reply_story_id,
    context
  )
  values(
    v_conversation.id,
    v_uid,
    v_body,
    'story_reply',
    v_story.id,
    jsonb_strip_nulls(
      jsonb_build_object(
        'version',1,
        'story_id',v_story.id,
        'shop_slug',v_story.shop_slug,
        'shop_name',v_story.shop_name,
        'shop_url',v_story.shop_url,
        'media_type',v_story.media_type,
        'storage_path',v_story.storage_path,
        'status_text',v_story.status_text,
        'story_created_at',v_story.created_at,
        'story_expires_at',v_story.expires_at,
        'snapshot_created_at',now()
      )
    )
  )
  returning * into v_message;

  update public.ma7alak_conversations
  set updated_at=v_message.created_at
  where id=v_conversation.id;

  return v_message;
end;
$function$;
