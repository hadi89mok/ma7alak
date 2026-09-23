-- =========================================================
-- SHOUFHON SECURITY HARDENING
-- Closes confirmed direct-table/browser abuse paths while
-- preserving the existing RPC-driven website and PWA flows.
-- =========================================================

create or replace function public.ma7alak_update_my_profile(
  p_display_name text default null,
  p_username text default null,
  p_avatar_url text default null,
  p_bio text default null
)
returns public.viewer_profiles
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_status text;
  v_profile public.viewer_profiles;
begin
  if v_uid is null then raise exception 'Not authenticated'; end if;

  select vp.account_status into v_status
  from public.viewer_profiles vp
  where vp.user_id=v_uid;

  if found and coalesce(v_status,'active')<>'active' then
    raise exception 'Account is not active';
  end if;

  update public.viewer_profiles
  set
    display_name=case when p_display_name is null then display_name else nullif(trim(p_display_name),'') end,
    username=case when p_username is null then username else nullif(lower(trim(p_username)),'') end,
    avatar_url=case when p_avatar_url is null then avatar_url else nullif(trim(p_avatar_url),'') end,
    bio=case when p_bio is null then bio else nullif(trim(p_bio),'') end
  where user_id=v_uid
  returning * into v_profile;

  if not found then
    insert into public.viewer_profiles(user_id,display_name,username,avatar_url,bio)
    values(
      v_uid,
      nullif(trim(p_display_name),''),
      nullif(lower(trim(p_username)),''),
      nullif(trim(p_avatar_url),''),
      nullif(trim(p_bio),'')
    )
    returning * into v_profile;
  end if;

  return v_profile;
end;
$function$;

revoke insert,update,delete,truncate,references,trigger
on table public.viewer_profiles from anon,authenticated;
grant select on table public.viewer_profiles to authenticated;
revoke all on function public.ma7alak_update_my_profile(text,text,text,text) from public,anon;
grant execute on function public.ma7alak_update_my_profile(text,text,text,text) to authenticated;


create or replace function public.ma7alak_start_conversation(p_shop_slug text)
returns public.ma7alak_conversations
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_row public.ma7alak_conversations;
  v_slug text := lower(btrim(coalesce(p_shop_slug,'')));
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if public.ma7alak_assert_active_viewer() is distinct from true then
    raise exception 'Account is not active';
  end if;

  select sp.shop_slug into v_slug
  from public.shop_profiles sp
  where lower(btrim(sp.shop_slug))=v_slug
    and coalesce(sp.is_active,true)=true
  limit 1;

  if v_slug is null then raise exception 'Shop not found'; end if;

  if exists(
    select 1 from public.shop_owners so
    where so.user_id=auth.uid() and so.shop_slug=v_slug
  ) then
    raise exception 'You cannot message your own shop';
  end if;

  if public.ma7alak_shop_accepts_messages(v_slug) is distinct from true then
    raise exception 'SHOP_NOT_ACCEPTING_MESSAGES';
  end if;

  if public.ma7alak_chat_is_blocked(v_slug,auth.uid()) then
    raise exception 'CHAT_BLOCKED_BY_SHOP';
  end if;

  insert into public.ma7alak_conversations(shop_slug,viewer_id)
  values(v_slug,auth.uid())
  on conflict(viewer_id,shop_slug)
  do update set updated_at=public.ma7alak_conversations.updated_at
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
security definer
set search_path = ''
as $function$
declare
  v_message public.ma7alak_messages;
  v_conversation public.ma7alak_conversations;
  v_body text := btrim(coalesce(p_body,''));
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if public.ma7alak_assert_active_viewer() is distinct from true then
    raise exception 'Account is not active';
  end if;

  if char_length(v_body)<1 or char_length(v_body)>2000 then
    raise exception 'Message must be between 1 and 2000 characters';
  end if;

  if not public.ma7alak_can_access_conversation(p_conversation_id) then
    raise exception 'Conversation access denied';
  end if;

  select c.* into v_conversation
  from public.ma7alak_conversations c
  where c.id=p_conversation_id;

  if v_conversation.id is null then raise exception 'Conversation not found'; end if;

  if public.ma7alak_chat_is_blocked(
    v_conversation.shop_slug,
    v_conversation.viewer_id
  ) then
    raise exception 'CHAT_BLOCKED';
  end if;

  if v_conversation.viewer_id=auth.uid()
     and public.ma7alak_shop_accepts_messages(v_conversation.shop_slug)
         is distinct from true then
    raise exception 'SHOP_NOT_ACCEPTING_MESSAGES';
  end if;

  insert into public.ma7alak_messages(
    conversation_id,sender_id,body,message_type,context,reply_story_id
  )
  values(p_conversation_id,auth.uid(),v_body,'text','{}'::jsonb,null)
  returning * into v_message;

  update public.ma7alak_conversations
  set updated_at=now()
  where id=p_conversation_id;

  return v_message;
end;
$function$;


create or replace function public.ma7alak_mark_conversation_read(
  p_conversation_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_conversation public.ma7alak_conversations;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;

  select c.* into v_conversation
  from public.ma7alak_conversations c
  where c.id=p_conversation_id;

  if not found
     or not public.ma7alak_can_access_conversation(p_conversation_id) then
    raise exception 'Conversation access denied';
  end if;

  if v_conversation.viewer_id=auth.uid() then
    update public.ma7alak_conversations
    set viewer_last_read_at=now()
    where id=p_conversation_id;
  elsif public.ma7alak_is_shop_owner(v_conversation.shop_slug) then
    update public.ma7alak_conversations
    set owner_last_read_at=now()
    where id=p_conversation_id;
  else
    raise exception 'Conversation access denied';
  end if;

  return true;
end;
$function$;

revoke insert,update,delete,truncate,references,trigger
on table public.ma7alak_conversations from anon,authenticated;
revoke insert,update,delete,truncate,references,trigger
on table public.ma7alak_messages from anon,authenticated;
revoke all on table public.ma7alak_chat_reports from anon,authenticated;

grant select on table public.ma7alak_conversations to authenticated;
grant select on table public.ma7alak_messages to authenticated;

revoke all on function public.ma7alak_start_conversation(text) from public,anon;
revoke all on function public.ma7alak_send_message(uuid,text) from public,anon;
revoke all on function public.ma7alak_mark_conversation_read(uuid) from public,anon;
grant execute on function public.ma7alak_start_conversation(text) to authenticated;
grant execute on function public.ma7alak_send_message(uuid,text) to authenticated;
grant execute on function public.ma7alak_mark_conversation_read(uuid) to authenticated;


create or replace function public.ma7alak_guard_owner_story_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_limit integer := 10;
  v_count integer := 0;
  v_now timestamptz := clock_timestamp();
begin
  if auth.role()='service_role' or public.is_site_admin() then return new; end if;
  if v_uid is null then raise exception 'You must be signed in to publish a Story.'; end if;

  if not exists(
    select 1 from public.shop_owners so
    where so.user_id=v_uid and so.shop_slug=new.shop_slug
  ) then
    raise exception 'You do not own this shop.';
  end if;

  perform pg_advisory_xact_lock(hashtext('story-limit:' || new.shop_slug));

  select coalesce(ssl.story_limit,10)
  into v_limit
  from public.shop_story_limits ssl
  where ssl.shop_slug=new.shop_slug;

  if not found then v_limit:=10; end if;
  if v_limit<=0 then raise exception 'Story publishing is not enabled for this shop.'; end if;

  select count(*)::integer into v_count
  from public.shop_stories ss
  where ss.shop_slug=new.shop_slug and ss.expires_at>now();

  if v_count>=v_limit then
    raise exception
      'Story limit reached (%/%). Delete a Story or ask ShoufHon Admin to increase your limit.',
      v_count,v_limit;
  end if;

  new.user_id:=v_uid;
  new.created_at:=v_now;
  new.expires_at:=v_now+interval '24 hours';
  return new;
end;
$function$;


create or replace function public.ma7alak_guard_directory_request_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_allowed boolean := true;
  v_retry integer := 0;
begin
  if auth.role()='service_role' or public.is_site_admin() then return new; end if;

  select r.allowed,r.retry_after_seconds
  into v_allowed,v_retry
  from private.shoufhon_check_interaction_limit(
    'directory_request','site',5,900,3600
  ) r;

  if not coalesce(v_allowed,false) then
    raise exception
      'Too many requests. Try again in % seconds.',
      greatest(1,coalesce(v_retry,3600));
  end if;

  new.status:='new';
  new.created_at:=clock_timestamp();
  return new;
end;
$function$;

drop trigger if exists ma7alak_directory_request_rate_guard on public.directory_requests;
create trigger ma7alak_directory_request_rate_guard
before insert on public.directory_requests
for each row execute function public.ma7alak_guard_directory_request_insert();


create or replace function public.ma7alak_ack_notification_badge(
  p_visitor_id text,
  p_interaction_token text
)
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
  v_allowed boolean := true;
  v_retry integer := 0;
begin
  if not public.ma7alak_valid_follow_visitor_id(v_visitor) then
    raise exception 'Invalid visitor id';
  end if;
  if not public.ma7alak_valid_interaction_token(v_token) then
    raise exception 'Invalid interaction token';
  end if;

  v_hash:=private.ma7alak_interaction_owner_hash(v_visitor,v_token);

  if not exists(
    select 1 from public.ma7alak_notification_badge_ack a
    where a.owner_token_hash=v_hash
  ) then
    select r.allowed,r.retry_after_seconds
    into v_allowed,v_retry
    from private.shoufhon_check_interaction_limit(
      'notification_badge_identity','site',40,3600,3600
    ) r;

    if not coalesce(v_allowed,false) then
      raise exception 'Too many notification identities. Try again later.';
    end if;
  end if;

  insert into public.ma7alak_notification_badge_ack(
    owner_token_hash,acknowledged_at,updated_at
  )
  values(v_hash,v_at,v_at)
  on conflict(owner_token_hash)
  do update set
    acknowledged_at=excluded.acknowledged_at,
    updated_at=excluded.updated_at;

  return v_at;
end;
$function$;


create or replace function public.add_my_favorite(
  p_visitor_id text,
  p_favorite_token text,
  p_reel_id text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_visitor_id text := btrim(coalesce(p_visitor_id,''));
  v_token text := btrim(coalesce(p_favorite_token,''));
  v_reel_id text := btrim(coalesce(p_reel_id,''));
  v_owner_hash text;
  v_shop_name text;
  v_allowed boolean := true;
  v_retry integer := 0;
begin
  if not public.ma7alak_valid_follow_visitor_id(v_visitor_id) then
    raise exception 'Invalid visitor id';
  end if;
  if length(v_token)<32 or length(v_token)>200 or v_token !~ '^[A-Za-z0-9._:-]+$' then
    raise exception 'Invalid favorites token';
  end if;
  if v_reel_id='' or length(v_reel_id)>200 then raise exception 'Invalid reel id'; end if;

  select r.shop_name into v_shop_name
  from public.shop_reels r
  where r.reel_id=v_reel_id and coalesce(r.active,true)=true
  limit 1;

  if not found then return false; end if;

  v_owner_hash:=encode(
    extensions.digest(v_visitor_id || ':' || v_token,'sha256'),
    'hex'
  );

  if exists(
    select 1 from public.ma7alak_favorites f
    where f.owner_token_hash=v_owner_hash and f.reel_id=v_reel_id
  ) then
    return true;
  end if;

  select r.allowed,r.retry_after_seconds
  into v_allowed,v_retry
  from private.shoufhon_check_interaction_limit(
    'favorite_add',v_reel_id,30,600,1800
  ) r;

  if not coalesce(v_allowed,false) then
    raise exception 'Too many favorite changes. Try again later.';
  end if;

  insert into public.ma7alak_favorites(visitor_id,reel_id,shop_name,owner_token_hash)
  values(v_visitor_id,v_reel_id,v_shop_name,v_owner_hash)
  on conflict(owner_token_hash,reel_id) do nothing;

  return true;
end;
$function$;


create or replace function public.ma7alak_owner_storage_quota_allows(
  p_bucket text,
  p_name text
)
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_bucket text := btrim(coalesce(p_bucket,''));
  v_name text := btrim(coalesce(p_name,''));
  v_parts text[];
  v_slug text;
  v_limit integer := 0;
  v_count integer := 0;
  v_enabled boolean := false;
begin
  if v_uid is null or v_name='' then return false; end if;
  v_parts:=storage.foldername(v_name);

  if v_bucket='shop-stories' then
    v_slug:=split_part(v_name,'/',1);
    if not exists(select 1 from public.shop_owners o where o.user_id=v_uid and o.shop_slug=v_slug) then return false; end if;
    select coalesce(s.story_limit,10) into v_limit
    from public.shop_story_limits s where s.shop_slug=v_slug;
    if not found then v_limit:=10; end if;
    if v_limit<=0 then return false; end if;
    select count(*)::integer into v_count
    from storage.objects o
    where o.bucket_id='shop-stories' and o.name like v_slug || '/%';
    return v_count < v_limit + 2;
  end if;

  if v_bucket='shop-videos' and coalesce(v_parts[1],'')='reels' then
    v_slug:=coalesce(v_parts[2],'');
    if not exists(select 1 from public.shop_owners o where o.user_id=v_uid and o.shop_slug=v_slug) then return false; end if;
    select coalesce(r.reel_limit,0) into v_limit
    from public.shop_reel_limits r where r.shop_slug=v_slug;
    if not found or v_limit<=0 then return false; end if;
    select count(*)::integer into v_count
    from storage.objects o
    where o.bucket_id='shop-videos' and o.name like 'reels/' || v_slug || '/%';
    return v_count < v_limit + 2;
  end if;

  if v_bucket='shop-videos' and coalesce(v_parts[1],'')='owner-media' then
    v_slug:=coalesce(v_parts[2],'');
    if not public.owner_has_shop_option(v_slug,'owner_media_edit_enabled') then return false; end if;
    select greatest(0,least(100,coalesce(nullif(p.directory_options->>'owner_media_video_limit','')::integer,0)))
    into v_limit from public.shop_profiles p where p.shop_slug=v_slug;
    if coalesce(v_limit,0)<=0 then return false; end if;
    select count(*)::integer into v_count
    from storage.objects o
    where o.bucket_id='shop-videos' and o.name like 'owner-media/' || v_slug || '/%';
    return v_count < v_limit + 2;
  end if;

  if v_bucket='shop-gallery' and coalesce(v_parts[1],'')='owner-gallery' then
    v_slug:=coalesce(v_parts[2],'');
    if not public.owner_has_shop_option(v_slug,'owner_media_edit_enabled') then return false; end if;
    select greatest(0,least(100,coalesce(nullif(p.directory_options->>'owner_media_photo_limit','')::integer,0)))
    into v_limit from public.shop_profiles p where p.shop_slug=v_slug;
    if coalesce(v_limit,0)<=0 then return false; end if;
    select count(*)::integer into v_count
    from storage.objects o
    where o.bucket_id='shop-gallery' and o.name like 'owner-gallery/' || v_slug || '/%';
    return v_count < v_limit + 2;
  end if;

  if v_bucket='live-offers' then
    v_slug:=coalesce(v_parts[1],'');
    if not exists(select 1 from public.shop_owners o where o.user_id=v_uid and o.shop_slug=v_slug) then return false; end if;
    select coalesce(e.enabled,false),coalesce(e.active_limit,0)
    into v_enabled,v_limit
    from public.shop_live_entitlements e
    where e.shop_slug=v_slug;
    if not found or not v_enabled or v_limit<=0 then return false; end if;
    select count(*)::integer into v_count
    from storage.objects o
    where o.bucket_id='live-offers' and o.name like v_slug || '/%';
    return v_count < least(408,greatest(12,v_limit*4+8));
  end if;

  return true;
end;
$function$;

revoke all on function public.ma7alak_owner_storage_quota_allows(text,text) from public,anon;
grant execute on function public.ma7alak_owner_storage_quota_allows(text,text) to authenticated;

drop policy if exists "Owners can upload their own shop stories" on storage.objects;
create policy "Owners can upload their own shop stories"
on storage.objects for insert to authenticated
with check (
  bucket_id='shop-stories'
  and exists(
    select 1 from public.shop_owners
    where shop_owners.user_id=auth.uid()
      and shop_owners.shop_slug=split_part(objects.name,'/',1)
  )
  and public.ma7alak_owner_storage_quota_allows(bucket_id,name)
);

drop policy if exists "owners upload own reel files" on storage.objects;
create policy "owners upload own reel files"
on storage.objects for insert to authenticated
with check (
  bucket_id='shop-videos'
  and (storage.foldername(name))[1]='reels'
  and exists(
    select 1 from public.shop_owners so
    where so.user_id=auth.uid()
      and so.shop_slug=(storage.foldername(objects.name))[2]
  )
  and public.ma7alak_owner_storage_quota_allows(bucket_id,name)
);

drop policy if exists "Owners can upload permitted gallery files" on storage.objects;
create policy "Owners can upload permitted gallery files"
on storage.objects for insert to authenticated
with check (
  bucket_id='shop-gallery'
  and (storage.foldername(name))[1]='owner-gallery'
  and public.owner_has_shop_option((storage.foldername(name))[2],'owner_media_edit_enabled')
  and public.ma7alak_owner_storage_quota_allows(bucket_id,name)
);

drop policy if exists "Owners can upload permitted media videos" on storage.objects;
create policy "Owners can upload permitted media videos"
on storage.objects for insert to authenticated
with check (
  bucket_id='shop-videos'
  and (storage.foldername(name))[1]='owner-media'
  and public.owner_has_shop_option((storage.foldername(name))[2],'owner_media_edit_enabled')
  and public.ma7alak_owner_storage_quota_allows(bucket_id,name)
);

drop policy if exists "live offers owner upload" on storage.objects;
create policy "live offers owner upload"
on storage.objects for insert to authenticated
with check (
  bucket_id='live-offers'
  and exists(
    select 1 from public.shop_owners o
    where o.user_id=auth.uid()
      and o.shop_slug=(storage.foldername(objects.name))[1]
  )
  and public.ma7alak_owner_storage_quota_allows(bucket_id,name)
);


create or replace function public.ma7alak_find_orphan_media(
  p_limit integer default 200
)
returns table(bucket_id text,path text)
language sql
security definer
set search_path = ''
as $function$
  with candidates as (
    select o.bucket_id::text as bucket_id,o.name::text as path,o.created_at
    from storage.objects o
    where o.bucket_id='live-offers'
      and o.created_at<now()-interval '2 hours'
      and not exists(
        select 1 from public.shop_live_post_media m
        where m.storage_path=o.name
           or position('/storage/v1/object/public/live-offers/' || o.name in coalesce(m.media_url,''))>0
      )
      and not exists(
        select 1 from public.shop_live_posts p
        where position('/storage/v1/object/public/live-offers/' || o.name in coalesce(p.media_url,''))>0
      )

    union all

    select o.bucket_id::text as bucket_id,o.name::text as path,o.created_at
    from storage.objects o
    where o.bucket_id='shop-videos'
      and o.name like 'reels/%'
      and o.created_at<now()-interval '2 hours'
      and not exists(select 1 from public.shop_videos v where v.storage_path=o.name)
      and not exists(
        select 1 from public.shop_reels r
        where position('/storage/v1/object/public/shop-videos/' || o.name in coalesce(r.video_url,''))>0
      )

    union all

    select o.bucket_id::text as bucket_id,o.name::text as path,o.created_at
    from storage.objects o
    where o.bucket_id='shop-stories'
      and o.created_at<now()-interval '2 hours'
      and not exists(select 1 from public.shop_stories s where s.storage_path=o.name)
  )
  select c.bucket_id,c.path
  from candidates c
  order by c.created_at asc
  limit greatest(1,least(coalesce(p_limit,200),500));
$function$;


do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as fn
    from pg_proc p
    join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public'
      and pg_get_function_result(p.oid)='trigger'
  loop
    execute format(
      'revoke all on function %s from public, anon, authenticated',
      r.fn
    );
  end loop;
end
$$;
