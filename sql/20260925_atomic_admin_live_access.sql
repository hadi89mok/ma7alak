-- =========================================================
-- SHOUFHON ATOMIC ADMIN LIVE ACCESS
-- Updates Live Offers + Video LIVE access in one row change.
-- Prevents intermediate realtime states from flashing in shop panels.
-- =========================================================

create or replace function public.ma7alak_admin_set_live_access(
  p_shop_slug text,
  p_enabled boolean,
  p_active_limit integer,
  p_video_live_enabled boolean,
  p_monthly_minutes integer
)
returns public.shop_live_entitlements
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_slug text;
  v_row public.shop_live_entitlements;
begin
  if public.is_site_admin() is distinct from true then
    raise exception 'Admin only';
  end if;

  v_slug:=lower(trim(both '/' from trim(coalesce(p_shop_slug,''))));
  if v_slug='' or not exists(
    select 1 from public.shop_profiles where lower(shop_slug)=v_slug
  ) then
    raise exception 'Shop not found';
  end if;

  if p_active_limit is null or p_active_limit<0 or p_active_limit>100 then
    raise exception 'Live/Offer limit must be between 0 and 100';
  end if;

  if p_monthly_minutes is null or p_monthly_minutes<0 or p_monthly_minutes>1000000 then
    raise exception 'Monthly live minutes must be between 0 and 1000000';
  end if;

  insert into public.shop_live_entitlements(
    shop_slug,
    enabled,
    active_limit,
    max_duration_hours,
    allow_image,
    allow_video,
    video_live_enabled,
    video_live_monthly_minutes
  )
  values(
    v_slug,
    coalesce(p_enabled,false),
    p_active_limit,
    48,
    true,
    true,
    coalesce(p_video_live_enabled,false),
    p_monthly_minutes
  )
  on conflict(shop_slug) do update
    set enabled=excluded.enabled,
        active_limit=excluded.active_limit,
        video_live_enabled=excluded.video_live_enabled,
        video_live_monthly_minutes=excluded.video_live_monthly_minutes,
        updated_at=now()
  returning * into v_row;

  return v_row;
end;
$function$;

revoke execute on function public.ma7alak_admin_set_live_access(text,boolean,integer,boolean,integer) from public;
revoke execute on function public.ma7alak_admin_set_live_access(text,boolean,integer,boolean,integer) from anon;
grant execute on function public.ma7alak_admin_set_live_access(text,boolean,integer,boolean,integer) to authenticated;
