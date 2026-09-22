-- Stage 1 anonymous Follow abuse protection.
-- Keeps the existing visitor-id/user-id limiter and adds a second
-- per-IP/per-shop limiter for logged-out users. Raw IP addresses are
-- never stored: they are hashed with a random salt held in Supabase Vault.

do $$
begin
  if not exists (
    select 1 from vault.secrets where name='shoufhon_follow_ip_salt'
  ) then
    perform vault.create_secret(
      encode(extensions.gen_random_bytes(32),'hex'),
      'shoufhon_follow_ip_salt',
      'Salt used to hash anonymous client IPs for follow abuse protection'
    );
  end if;
end
$$;

create table if not exists private.shoufhon_follow_ip_rate_limits (
  ip_hash text not null,
  shop_slug text not null,
  window_started_at timestamptz not null default clock_timestamp(),
  change_count integer not null default 0 check (change_count >= 0),
  blocked_until timestamptz null,
  updated_at timestamptz not null default clock_timestamp(),
  primary key (ip_hash, shop_slug)
);

revoke all on table private.shoufhon_follow_ip_rate_limits
from public, anon, authenticated;

create or replace function private.shoufhon_check_follow_ip_limit(p_shop_slug text)
returns table(allowed boolean, retry_after_seconds integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_headers jsonb;
  v_ip text;
  v_salt text;
  v_ip_hash text;
  v_now timestamptz := clock_timestamp();
  v_window_started_at timestamptz;
  v_change_count integer;
  v_blocked_until timestamptz;
  v_retry integer;
begin
  if v_user_id is not null then
    return query select true, 0;
    return;
  end if;

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

  select s.decrypted_secret
  into v_salt
  from vault.decrypted_secrets s
  where s.name='shoufhon_follow_ip_salt'
  limit 1;

  if coalesce(v_salt,'') = '' then
    return query select true, 0;
    return;
  end if;

  v_ip_hash := encode(
    extensions.digest(v_ip || ':' || v_salt, 'sha256'),
    'hex'
  );

  insert into private.shoufhon_follow_ip_rate_limits(
    ip_hash, shop_slug, window_started_at, change_count, blocked_until, updated_at
  )
  values(
    v_ip_hash, btrim(p_shop_slug), v_now, 0, null, v_now
  )
  on conflict(ip_hash, shop_slug) do nothing;

  select r.window_started_at, r.change_count, r.blocked_until
  into v_window_started_at, v_change_count, v_blocked_until
  from private.shoufhon_follow_ip_rate_limits r
  where r.ip_hash=v_ip_hash
    and r.shop_slug=btrim(p_shop_slug)
  for update;

  if v_blocked_until is not null and v_blocked_until > v_now then
    v_retry := greatest(
      1,
      ceil(extract(epoch from (v_blocked_until-v_now)))::integer
    );

    update private.shoufhon_follow_ip_rate_limits
    set updated_at=v_now
    where ip_hash=v_ip_hash and shop_slug=btrim(p_shop_slug);

    return query select false, v_retry;
    return;
  end if;

  if v_window_started_at is null
     or v_window_started_at <= v_now - interval '10 minutes' then
    update private.shoufhon_follow_ip_rate_limits
    set window_started_at=v_now,
        change_count=1,
        blocked_until=null,
        updated_at=v_now
    where ip_hash=v_ip_hash and shop_slug=btrim(p_shop_slug);

    return query select true, 0;
    return;
  end if;

  if coalesce(v_change_count,0) >= 20 then
    update private.shoufhon_follow_ip_rate_limits
    set change_count=coalesce(v_change_count,0)+1,
        blocked_until=v_now+interval '15 minutes',
        updated_at=v_now
    where ip_hash=v_ip_hash and shop_slug=btrim(p_shop_slug);

    return query select false, 900;
    return;
  end if;

  update private.shoufhon_follow_ip_rate_limits
  set change_count=coalesce(v_change_count,0)+1,
      blocked_until=null,
      updated_at=v_now
  where ip_hash=v_ip_hash and shop_slug=btrim(p_shop_slug);

  return query select true, 0;
end;
$$;

revoke all on function private.shoufhon_check_follow_ip_limit(text)
from public, anon, authenticated;

create or replace function public.follow_shop(p_shop_slug text, p_visitor_id text)
returns table(following boolean, follower_count bigint)
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_shop_slug text := btrim(p_shop_slug);
  v_visitor_id text := btrim(p_visitor_id);
  v_user_id uuid := auth.uid();
  v_already_following boolean := false;
  v_allowed boolean := true;
  v_retry integer := 0;
begin
  if not public.ma7alak_valid_follow_shop_slug(v_shop_slug) then
    raise exception 'Invalid shop slug';
  end if;

  if not public.ma7alak_valid_follow_visitor_id(v_visitor_id) then
    raise exception 'Invalid visitor id';
  end if;

  if v_user_id is not null and exists (
    select 1
    from public.shop_owners o
    where o.user_id = v_user_id
      and o.shop_slug = v_shop_slug
  ) then
    raise exception 'Shop owners cannot follow their own shop';
  end if;

  select exists(
    select 1
    from public.shop_follows sf
    where sf.shop_slug = v_shop_slug
      and (
        sf.visitor_id = v_visitor_id
        or (
          v_user_id is not null
          and sf.user_id = v_user_id
        )
      )
  )
  into v_already_following;

  if not v_already_following then
    select r.allowed, r.retry_after_seconds
    into v_allowed, v_retry
    from public.ma7alak_check_follow_rate_limit(
      v_shop_slug,
      v_visitor_id
    ) r;

    if not coalesce(v_allowed,false) then
      raise exception
        'Follow changes paused. Try again in % seconds.',
        greatest(1,coalesce(v_retry,60));
    end if;

    select r.allowed, r.retry_after_seconds
    into v_allowed, v_retry
    from private.shoufhon_check_follow_ip_limit(v_shop_slug) r;

    if not coalesce(v_allowed,false) then
      raise exception
        'Follow changes paused. Try again in % seconds.',
        greatest(1,coalesce(v_retry,900));
    end if;
  end if;

  if v_user_id is not null then
    delete from public.shop_follows sf
    where sf.shop_slug = v_shop_slug
      and sf.user_id = v_user_id
      and sf.visitor_id <> v_visitor_id;
  end if;

  insert into public.shop_follows(
    shop_slug,
    visitor_id,
    user_id
  )
  values(
    v_shop_slug,
    v_visitor_id,
    v_user_id
  )
  on conflict(shop_slug,visitor_id)
  do update
    set user_id = coalesce(
      excluded.user_id,
      public.shop_follows.user_id
    );

  return query
  select
    true,
    (
      select count(*)::bigint
      from public.shop_follows f
      where f.shop_slug = v_shop_slug
    );
end;
$function$;

create or replace function public.unfollow_shop(p_shop_slug text, p_visitor_id text)
returns table(following boolean, follower_count bigint)
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_shop_slug text := btrim(p_shop_slug);
  v_visitor_id text := btrim(p_visitor_id);
  v_user_id uuid := auth.uid();
  v_is_following boolean := false;
  v_allowed boolean := true;
  v_retry integer := 0;
begin
  if not public.ma7alak_valid_follow_shop_slug(v_shop_slug) then
    raise exception 'Invalid shop slug';
  end if;

  if not public.ma7alak_valid_follow_visitor_id(v_visitor_id) then
    raise exception 'Invalid visitor id';
  end if;

  select exists(
    select 1
    from public.shop_follows sf
    where sf.shop_slug = v_shop_slug
      and (
        sf.visitor_id = v_visitor_id
        or (
          v_user_id is not null
          and sf.user_id = v_user_id
        )
      )
  )
  into v_is_following;

  if not v_is_following then
    return query
    select
      false,
      count(*)::bigint
    from public.shop_follows sf
    where sf.shop_slug = v_shop_slug;
    return;
  end if;

  select r.allowed, r.retry_after_seconds
  into v_allowed, v_retry
  from public.ma7alak_check_follow_rate_limit(
    v_shop_slug,
    v_visitor_id
  ) r;

  if not coalesce(v_allowed,false) then
    raise exception
      'Follow changes paused. Try again in % seconds.',
      greatest(1,coalesce(v_retry,60));
  end if;

  select r.allowed, r.retry_after_seconds
  into v_allowed, v_retry
  from private.shoufhon_check_follow_ip_limit(v_shop_slug) r;

  if not coalesce(v_allowed,false) then
    raise exception
      'Follow changes paused. Try again in % seconds.',
      greatest(1,coalesce(v_retry,900));
  end if;

  if v_user_id is not null then
    delete from public.shop_follows sf
    where sf.shop_slug = v_shop_slug
      and (
        sf.user_id = v_user_id
        or sf.visitor_id = v_visitor_id
      );
  else
    delete from public.shop_follows sf
    where sf.shop_slug = v_shop_slug
      and sf.visitor_id = v_visitor_id;
  end if;

  return query
  select
    false,
    count(*)::bigint
  from public.shop_follows sf
  where sf.shop_slug = v_shop_slug;
end;
$function$;
