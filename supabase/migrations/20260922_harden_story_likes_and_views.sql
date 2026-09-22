-- Harden Story likes, Story views, and shop views against visitor-ID rotation.
-- Raw IP addresses are never stored. Anonymous request IPs and signed-in
-- account IDs are hashed with a Vault-held salt before rate-limit tracking.

do $$
begin
  if not exists (
    select 1 from vault.secrets where name='shoufhon_interaction_ip_salt'
  ) then
    perform vault.create_secret(
      encode(extensions.gen_random_bytes(32),'hex'),
      'shoufhon_interaction_ip_salt',
      'Salt used to hash actors for ShoufHon like/view abuse protection'
    );
  end if;
end
$$;

create table if not exists private.shoufhon_interaction_rate_limits (
  actor_hash text not null,
  action_key text not null,
  target_key text not null,
  window_started_at timestamptz not null default clock_timestamp(),
  event_count integer not null default 0 check (event_count >= 0),
  blocked_until timestamptz null,
  updated_at timestamptz not null default clock_timestamp(),
  primary key (actor_hash, action_key, target_key)
);

create index if not exists shoufhon_interaction_rate_limits_updated_at_idx
on private.shoufhon_interaction_rate_limits(updated_at);

revoke all on table private.shoufhon_interaction_rate_limits
from public, anon, authenticated;

create or replace function private.shoufhon_check_interaction_limit(
  p_action text,
  p_target_key text,
  p_limit integer,
  p_window_seconds integer,
  p_block_seconds integer
)
returns table(allowed boolean, retry_after_seconds integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_headers jsonb;
  v_ip text;
  v_actor_source text;
  v_salt text;
  v_actor_hash text;
  v_now timestamptz := clock_timestamp();
  v_window_started_at timestamptz;
  v_event_count integer;
  v_blocked_until timestamptz;
  v_retry integer;
  v_limit integer := greatest(1, least(coalesce(p_limit,1), 10000));
  v_window integer := greatest(1, least(coalesce(p_window_seconds,60), 86400));
  v_block integer := greatest(1, least(coalesce(p_block_seconds,60), 86400));
begin
  if nullif(btrim(p_action),'') is null
     or nullif(btrim(p_target_key),'') is null then
    return query select true, 0;
    return;
  end if;

  if v_user_id is not null then
    v_actor_source := 'u:' || v_user_id::text;
  else
    begin
      v_headers := nullif(current_setting('request.headers', true),'')::jsonb;
    exception when others then
      v_headers := null;
    end;

    v_ip := btrim(split_part(coalesce(v_headers->>'x-forwarded-for',''), ',', 1));

    if v_ip = '' then
      return query select true, 0;
      return;
    end if;

    v_actor_source := 'ip:' || v_ip;
  end if;

  select s.decrypted_secret
  into v_salt
  from vault.decrypted_secrets s
  where s.name='shoufhon_interaction_ip_salt'
  limit 1;

  if coalesce(v_salt,'') = '' then
    return query select true, 0;
    return;
  end if;

  v_actor_hash := encode(
    extensions.digest(v_actor_source || ':' || v_salt, 'sha256'),
    'hex'
  );

  insert into private.shoufhon_interaction_rate_limits(
    actor_hash,
    action_key,
    target_key,
    window_started_at,
    event_count,
    blocked_until,
    updated_at
  )
  values(
    v_actor_hash,
    btrim(p_action),
    btrim(p_target_key),
    v_now,
    0,
    null,
    v_now
  )
  on conflict(actor_hash,action_key,target_key) do nothing;

  select r.window_started_at,r.event_count,r.blocked_until
  into v_window_started_at,v_event_count,v_blocked_until
  from private.shoufhon_interaction_rate_limits r
  where r.actor_hash=v_actor_hash
    and r.action_key=btrim(p_action)
    and r.target_key=btrim(p_target_key)
  for update;

  if v_blocked_until is not null and v_blocked_until > v_now then
    v_retry := greatest(
      1,
      ceil(extract(epoch from (v_blocked_until-v_now)))::integer
    );

    update private.shoufhon_interaction_rate_limits
    set updated_at=v_now
    where actor_hash=v_actor_hash
      and action_key=btrim(p_action)
      and target_key=btrim(p_target_key);

    return query select false,v_retry;
    return;
  end if;

  if v_window_started_at is null
     or v_window_started_at <= v_now - make_interval(secs => v_window) then
    update private.shoufhon_interaction_rate_limits
    set window_started_at=v_now,
        event_count=1,
        blocked_until=null,
        updated_at=v_now
    where actor_hash=v_actor_hash
      and action_key=btrim(p_action)
      and target_key=btrim(p_target_key);

    return query select true,0;
    return;
  end if;

  if coalesce(v_event_count,0) >= v_limit then
    update private.shoufhon_interaction_rate_limits
    set event_count=coalesce(v_event_count,0)+1,
        blocked_until=v_now+make_interval(secs => v_block),
        updated_at=v_now
    where actor_hash=v_actor_hash
      and action_key=btrim(p_action)
      and target_key=btrim(p_target_key);

    return query select false,v_block;
    return;
  end if;

  update private.shoufhon_interaction_rate_limits
  set event_count=coalesce(v_event_count,0)+1,
      blocked_until=null,
      updated_at=v_now
  where actor_hash=v_actor_hash
    and action_key=btrim(p_action)
    and target_key=btrim(p_target_key);

  return query select true,0;
end;
$$;

revoke all on function private.shoufhon_check_interaction_limit(text,text,integer,integer,integer)
from public,anon,authenticated;

create unique index if not exists story_likes_unique_story_actor_user
on public.story_likes(story_id,actor_user_id)
where actor_user_id is not null;

create or replace function public.like_story(p_story_id integer, p_visitor_id text)
returns json
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_shop_slug text;
  v_like_id uuid;
  v_like_count integer;
  v_already_liked boolean := false;
  v_actor uuid := auth.uid();
  v_allowed boolean := true;
  v_retry integer := 0;
begin
  if p_story_id is null or p_visitor_id is null or trim(p_visitor_id)='' then
    return json_build_object('success',false,'message','Missing story ID or visitor ID');
  end if;

  select s.shop_slug into v_shop_slug
  from public.shop_stories s
  where s.id=p_story_id and s.expires_at>now()
  limit 1;

  if v_shop_slug is null then
    return json_build_object('success',false,'message','Story not found or expired');
  end if;

  if v_actor is not null and exists (
    select 1 from public.shop_owners o
    where o.user_id=v_actor and o.shop_slug=v_shop_slug
  ) then
    return json_build_object(
      'success',false,
      'blocked',true,
      'message','Shop owners cannot like their own story',
      'story_id',p_story_id,
      'shop_slug',v_shop_slug
    );
  end if;

  if v_actor is not null and exists (
    select 1
    from public.story_likes l
    where l.story_id=p_story_id
      and l.actor_user_id=v_actor
  ) then
    select count(*) into v_like_count
    from public.story_likes
    where story_id=p_story_id;

    return json_build_object(
      'success',true,
      'liked',false,
      'already_liked',true,
      'like_count',v_like_count,
      'story_id',p_story_id,
      'shop_slug',v_shop_slug
    );
  end if;

  if exists (
    select 1
    from public.story_likes l
    where l.story_id=p_story_id
      and l.visitor_id=p_visitor_id
  ) then
    select count(*) into v_like_count
    from public.story_likes
    where story_id=p_story_id;

    return json_build_object(
      'success',true,
      'liked',false,
      'already_liked',true,
      'like_count',v_like_count,
      'story_id',p_story_id,
      'shop_slug',v_shop_slug
    );
  end if;

  select r.allowed,r.retry_after_seconds
  into v_allowed,v_retry
  from private.shoufhon_check_interaction_limit(
    'story_like',
    p_story_id::text,
    8,
    900,
    1800
  ) r;

  if not coalesce(v_allowed,false) then
    select count(*) into v_like_count
    from public.story_likes
    where story_id=p_story_id;

    return json_build_object(
      'success',false,
      'blocked',true,
      'message','Too many Story like attempts. Try again later.',
      'retry_after_seconds',greatest(1,coalesce(v_retry,1800)),
      'like_count',v_like_count,
      'story_id',p_story_id,
      'shop_slug',v_shop_slug
    );
  end if;

  insert into public.story_likes(
    story_id,
    shop_slug,
    visitor_id,
    actor_user_id
  )
  values(
    p_story_id,
    v_shop_slug,
    p_visitor_id,
    v_actor
  )
  on conflict do nothing
  returning id into v_like_id;

  if v_like_id is null then
    v_already_liked:=true;
  else
    insert into public.story_like_notifications(
      shop_slug,story_id,like_id,visitor_id,actor_user_id
    )
    values(
      v_shop_slug,p_story_id,v_like_id,p_visitor_id,v_actor
    );

    insert into public.ma7alak_owner_notifications(
      shop_slug,type,actor_user_id,actor_visitor_id,story_id,source_id
    )
    values(
      v_shop_slug,'story_like',v_actor,p_visitor_id,p_story_id,v_like_id::text
    );
  end if;

  select count(*) into v_like_count
  from public.story_likes
  where story_id=p_story_id;

  return json_build_object(
    'success',true,
    'liked',not v_already_liked,
    'already_liked',v_already_liked,
    'like_count',v_like_count,
    'story_id',p_story_id,
    'shop_slug',v_shop_slug
  );
end;
$function$;

create or replace function public.record_story_view(
  p_story_id integer,
  p_shop_slug text,
  p_visitor_id text
)
returns boolean
language plpgsql
security definer
set search_path = 'public'
as $function$
declare
  v_story_exists boolean;
  v_is_owner boolean := false;
  v_allowed boolean := true;
  v_retry integer := 0;
begin
  if p_story_id is null
     or nullif(trim(p_shop_slug), '') is null
     or nullif(trim(p_visitor_id), '') is null then
    return false;
  end if;

  select exists (
    select 1
    from public.shop_stories s
    where s.id = p_story_id
      and s.shop_slug = p_shop_slug
      and s.expires_at > now()
  )
  into v_story_exists;

  if not v_story_exists then
    return false;
  end if;

  if auth.uid() is not null then
    select exists (
      select 1
      from public.shop_owners o
      where o.user_id = auth.uid()
        and o.shop_slug = p_shop_slug
    )
    into v_is_owner;
  end if;

  if v_is_owner then
    return true;
  end if;

  if exists (
    select 1
    from public.story_views v
    where v.story_id=p_story_id
      and v.visitor_id=p_visitor_id
  ) then
    return true;
  end if;

  select r.allowed,r.retry_after_seconds
  into v_allowed,v_retry
  from private.shoufhon_check_interaction_limit(
    'story_view',
    p_story_id::text,
    60,
    600,
    1800
  ) r;

  if not coalesce(v_allowed,false) then
    return true;
  end if;

  insert into public.story_views(
    story_id,
    shop_slug,
    visitor_id
  )
  values(
    p_story_id,
    p_shop_slug,
    p_visitor_id
  )
  on conflict(story_id,visitor_id)
  do nothing;

  return true;
end;
$function$;

create or replace function public.record_story_view(
  p_story_id integer,
  p_visitor_id text
)
returns json
language plpgsql
security definer
set search_path = 'public'
as $function$
declare
  v_inserted boolean := false;
  v_view_count integer := 0;
  v_shop_slug text;
  v_is_owner boolean := false;
  v_allowed boolean := true;
  v_retry integer := 0;
begin
  if p_story_id is null
     or p_visitor_id is null
     or p_visitor_id = '' then
    return json_build_object(
      'success',false,
      'view_count',null
    );
  end if;

  select shop_slug
  into v_shop_slug
  from public.shop_stories
  where id=p_story_id
    and expires_at>now()
  limit 1;

  if v_shop_slug is null then
    return json_build_object(
      'success',false,
      'view_count',null
    );
  end if;

  if auth.uid() is not null
     and exists (
       select 1
       from public.shop_owners so
       where so.user_id=auth.uid()
         and so.shop_slug=v_shop_slug
     ) then
    v_is_owner:=true;
  end if;

  if not exists (
    select 1
    from public.story_views v
    where v.story_id=p_story_id
      and v.visitor_id=p_visitor_id
  ) then
    if not v_is_owner then
      select r.allowed,r.retry_after_seconds
      into v_allowed,v_retry
      from private.shoufhon_check_interaction_limit(
        'story_view',
        p_story_id::text,
        60,
        600,
        1800
      ) r;
    end if;

    if v_is_owner or coalesce(v_allowed,false) then
      insert into public.story_views(
        story_id,
        visitor_id
      )
      values(
        p_story_id,
        p_visitor_id
      )
      on conflict(story_id,visitor_id)
      do nothing;

      if found then
        v_inserted:=true;
      end if;
    end if;
  end if;

  if v_is_owner then
    select count(*)
    into v_view_count
    from public.story_views
    where story_id=p_story_id;
  end if;

  return json_build_object(
    'success',true,
    'new_view',v_inserted,
    'view_count',
      case
        when v_is_owner then v_view_count
        else null
      end,
    'story_id',p_story_id
  );
end;
$function$;

create or replace function public.record_shop_view(
  p_shop_id text,
  p_visitor_id text
)
returns void
language plpgsql
security definer
set search_path = 'public'
as $function$
declare
  v_allowed boolean := true;
  v_retry integer := 0;
begin
  if exists (
    select 1
    from public.shop_views v
    where v.shop_id=p_shop_id
      and v.visitor_id=p_visitor_id
      and ((v.viewed_at at time zone 'UTC')::date)
          = ((now() at time zone 'UTC')::date)
  ) then
    update public.shop_views
    set last_seen_at=now()
    where shop_id=p_shop_id
      and visitor_id=p_visitor_id
      and ((viewed_at at time zone 'UTC')::date)
          = ((now() at time zone 'UTC')::date);
    return;
  end if;

  select r.allowed,r.retry_after_seconds
  into v_allowed,v_retry
  from private.shoufhon_check_interaction_limit(
    'shop_view',
    coalesce(p_shop_id,''),
    120,
    600,
    1800
  ) r;

  if not coalesce(v_allowed,false) then
    return;
  end if;

  insert into public.shop_views(
    shop_id,
    visitor_id,
    viewed_at,
    last_seen_at
  )
  values(
    p_shop_id,
    p_visitor_id,
    now(),
    now()
  )
  on conflict(
    shop_id,
    visitor_id,
    ((viewed_at at time zone 'UTC')::date)
  )
  do update
    set last_seen_at=excluded.last_seen_at;
end;
$function$;

select cron.schedule(
  'shoufhon-interaction-rate-limit-cleanup',
  '17 4 * * *',
  $cron$
    delete from private.shoufhon_interaction_rate_limits
    where updated_at < now() - interval '2 days';
  $cron$
)
where not exists (
  select 1
  from cron.job
  where jobname='shoufhon-interaction-rate-limit-cleanup'
);
