-- =========================================================
-- SHOUFHON SUBSCRIPTION PLAN PRESETS
-- Basic / Premium / VIP / Custom -> existing entitlement system
-- 2026-09-26
-- =========================================================

create table if not exists public.subscription_plan_presets (
  plan_key text primary key,
  display_name text not null,
  owner_profile_edit_enabled boolean not null default true,
  owner_media_edit_enabled boolean not null default true,
  owner_about_edit_enabled boolean not null default true,
  photo_limit integer not null default 0 check (photo_limit between 0 and 100),
  video_limit integer not null default 0 check (video_limit between 0 and 100),
  album_item_limit integer not null default 0 check (album_item_limit between 0 and 100),
  story_limit integer not null default 0 check (story_limit between 0 and 100),
  reel_limit integer not null default 0 check (reel_limit between 0 and 100),
  offers_enabled boolean not null default false,
  offer_active_limit integer not null default 0 check (offer_active_limit between 0 and 100),
  media_per_offer_limit integer not null default 0 check (media_per_offer_limit between 0 and 20),
  offer_allow_image boolean not null default true,
  offer_allow_video boolean not null default true,
  video_live_enabled boolean not null default false,
  video_live_monthly_minutes integer not null default 0 check (video_live_monthly_minutes between 0 and 1000000),
  updated_at timestamptz not null default now(),
  updated_by uuid null,
  constraint subscription_plan_presets_key_check
    check (plan_key in ('basic','premium','vip','custom'))
);

create table if not exists public.shop_plan_assignments (
  shop_slug text primary key
    references public.shop_profiles(shop_slug)
    on delete cascade,
  plan_key text not null
    references public.subscription_plan_presets(plan_key)
    on update cascade,
  assigned_at timestamptz not null default now(),
  assigned_by uuid null,
  last_applied_at timestamptz not null default now()
);

create index if not exists shop_plan_assignments_plan_key_idx
  on public.shop_plan_assignments(plan_key);

alter table public.subscription_plan_presets enable row level security;
alter table public.shop_plan_assignments enable row level security;

drop policy if exists "Admins manage subscription plan presets"
  on public.subscription_plan_presets;
create policy "Admins manage subscription plan presets"
  on public.subscription_plan_presets
  for all
  to authenticated
  using ((select public.is_site_admin()))
  with check ((select public.is_site_admin()));

drop policy if exists "Admins manage shop plan assignments"
  on public.shop_plan_assignments;
create policy "Admins manage shop plan assignments"
  on public.shop_plan_assignments
  for all
  to authenticated
  using ((select public.is_site_admin()))
  with check ((select public.is_site_admin()));

revoke all on public.subscription_plan_presets from anon;
revoke all on public.shop_plan_assignments from anon;
grant select,insert,update,delete on public.subscription_plan_presets to authenticated;
grant select,insert,update,delete on public.shop_plan_assignments to authenticated;

-- Editable starting values only. Existing shops are NOT assigned by this migration.
insert into public.subscription_plan_presets (
  plan_key,
  display_name,
  owner_profile_edit_enabled,
  owner_media_edit_enabled,
  owner_about_edit_enabled,
  photo_limit,
  video_limit,
  album_item_limit,
  story_limit,
  reel_limit,
  offers_enabled,
  offer_active_limit,
  media_per_offer_limit,
  offer_allow_image,
  offer_allow_video,
  video_live_enabled,
  video_live_monthly_minutes
)
values
  ('basic','Basic',true,true,true,10,2,5,5,2,true,1,2,true,false,false,0),
  ('premium','Premium',true,true,true,20,5,10,12,6,true,2,5,true,true,true,120),
  ('vip','VIP',true,true,true,40,10,15,30,15,true,4,10,true,true,true,360),
  ('custom','Custom',true,true,true,15,5,10,10,5,true,2,8,true,true,true,120)
on conflict (plan_key) do nothing;

create or replace function public.ma7alak_admin_apply_plan_to_shop(
  p_shop_slug text,
  p_plan_key text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_slug text := lower(trim(both '/' from trim(coalesce(p_shop_slug,''))));
  v_key text := lower(trim(coalesce(p_plan_key,'')));
  v_plan public.subscription_plan_presets%rowtype;
begin
  if public.is_site_admin() is distinct from true then
    raise exception 'Admin only';
  end if;

  if v_slug = '' then
    raise exception 'Shop slug is required';
  end if;

  if not exists(
    select 1
    from public.shop_profiles sp
    where lower(sp.shop_slug)=v_slug
  ) then
    raise exception 'Shop not found: %',v_slug;
  end if;

  select *
  into v_plan
  from public.subscription_plan_presets pp
  where pp.plan_key=v_key;

  if not found then
    raise exception 'Plan not found: %',v_key;
  end if;

  update public.shop_profiles sp
  set directory_options =
    coalesce(sp.directory_options,'{}'::jsonb) ||
    jsonb_build_object(
      'owner_profile_edit_enabled',v_plan.owner_profile_edit_enabled,
      'owner_media_edit_enabled',v_plan.owner_media_edit_enabled,
      'owner_about_edit_enabled',v_plan.owner_about_edit_enabled,
      'owner_media_photo_limit',v_plan.photo_limit,
      'owner_media_video_limit',v_plan.video_limit,
      'owner_media_album_item_limit',v_plan.album_item_limit,
      'owner_story_limit',v_plan.story_limit
    )
  where lower(sp.shop_slug)=v_slug;

  insert into public.shop_story_limits(shop_slug,story_limit,updated_at)
  values(v_slug,v_plan.story_limit,now())
  on conflict (shop_slug) do update
  set story_limit=excluded.story_limit,
      updated_at=now();

  insert into public.shop_reel_limits(shop_slug,reel_limit,updated_at)
  values(v_slug,v_plan.reel_limit,now())
  on conflict (shop_slug) do update
  set reel_limit=excluded.reel_limit,
      updated_at=now();

  insert into public.shop_live_entitlements(
    shop_slug,
    enabled,
    active_limit,
    max_duration_hours,
    allow_image,
    allow_video,
    video_live_enabled,
    video_live_monthly_minutes,
    media_per_offer_limit,
    updated_at
  )
  values(
    v_slug,
    v_plan.offers_enabled,
    v_plan.offer_active_limit,
    48,
    v_plan.offer_allow_image,
    v_plan.offer_allow_video,
    v_plan.video_live_enabled,
    v_plan.video_live_monthly_minutes,
    v_plan.media_per_offer_limit,
    now()
  )
  on conflict (shop_slug) do update
  set enabled=excluded.enabled,
      active_limit=excluded.active_limit,
      allow_image=excluded.allow_image,
      allow_video=excluded.allow_video,
      video_live_enabled=excluded.video_live_enabled,
      video_live_monthly_minutes=excluded.video_live_monthly_minutes,
      media_per_offer_limit=excluded.media_per_offer_limit,
      updated_at=now();

  insert into public.shop_plan_assignments(
    shop_slug,
    plan_key,
    assigned_at,
    assigned_by,
    last_applied_at
  )
  values(
    v_slug,
    v_key,
    now(),
    auth.uid(),
    now()
  )
  on conflict (shop_slug) do update
  set plan_key=excluded.plan_key,
      assigned_at=now(),
      assigned_by=auth.uid(),
      last_applied_at=now();

  return jsonb_build_object(
    'shop_slug',v_slug,
    'plan_key',v_key,
    'applied',true
  );
end;
$$;

create or replace function public.ma7alak_admin_apply_plan_to_assigned(
  p_plan_key text
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_key text := lower(trim(coalesce(p_plan_key,'')));
  v_slug text;
  v_count integer := 0;
begin
  if public.is_site_admin() is distinct from true then
    raise exception 'Admin only';
  end if;

  if not exists(
    select 1
    from public.subscription_plan_presets pp
    where pp.plan_key=v_key
  ) then
    raise exception 'Plan not found: %',v_key;
  end if;

  for v_slug in
    select spa.shop_slug
    from public.shop_plan_assignments spa
    where spa.plan_key=v_key
  loop
    perform public.ma7alak_admin_apply_plan_to_shop(v_slug,v_key);
    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

create or replace function public.ma7alak_admin_clear_shop_plan(
  p_shop_slug text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_slug text := lower(trim(both '/' from trim(coalesce(p_shop_slug,''))));
begin
  if public.is_site_admin() is distinct from true then
    raise exception 'Admin only';
  end if;

  delete from public.shop_plan_assignments
  where lower(shop_slug)=v_slug;

  -- Intentionally keep the shop's current entitlements as-is.
  -- Clearing the label must not unexpectedly disable a live shop.
  return true;
end;
$$;

revoke all on function public.ma7alak_admin_apply_plan_to_shop(text,text) from public;
revoke all on function public.ma7alak_admin_apply_plan_to_assigned(text) from public;
revoke all on function public.ma7alak_admin_clear_shop_plan(text) from public;

grant execute on function public.ma7alak_admin_apply_plan_to_shop(text,text) to authenticated;
grant execute on function public.ma7alak_admin_apply_plan_to_assigned(text) to authenticated;
grant execute on function public.ma7alak_admin_clear_shop_plan(text) to authenticated;
