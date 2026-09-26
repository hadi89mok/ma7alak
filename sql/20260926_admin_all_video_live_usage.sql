-- =========================================================
-- SHOUFHON ADMIN — BATCH VIDEO LIVE USAGE
-- One admin-safe request returns each shop's current monthly usage.
-- Month boundaries are inherited from shoufhon_video_live_used_seconds()
-- which uses Asia/Beirut.
-- =========================================================

create or replace function public.ma7alak_admin_get_all_video_live_usage()
returns table(
  shop_slug text,
  video_live_enabled boolean,
  used_seconds bigint,
  used_minutes integer,
  monthly_minutes integer,
  remaining_minutes integer,
  exhausted boolean
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.is_site_admin() is distinct from true then
    raise exception 'Admin only';
  end if;

  return query
  select
    sp.shop_slug,
    coalesce(e.video_live_enabled,false) as video_live_enabled,
    u.used_seconds,
    ceil(u.used_seconds / 60.0)::integer as used_minutes,
    coalesce(e.video_live_monthly_minutes,0)::integer as monthly_minutes,
    case
      when coalesce(e.video_live_monthly_minutes,0)=0 then -1
      else greatest(
        0,
        coalesce(e.video_live_monthly_minutes,0)::integer
        - ceil(u.used_seconds / 60.0)::integer
      )
    end as remaining_minutes,
    (
      coalesce(e.video_live_enabled,false)
      and coalesce(e.video_live_monthly_minutes,0)>0
      and u.used_seconds >= coalesce(e.video_live_monthly_minutes,0)::bigint * 60
    ) as exhausted
  from public.shop_profiles sp
  left join public.shop_live_entitlements e
    on lower(e.shop_slug)=lower(sp.shop_slug)
  cross join lateral (
    select public.shoufhon_video_live_used_seconds(sp.shop_slug) as used_seconds
  ) u
  order by lower(coalesce(sp.shop_name,sp.shop_slug)), lower(sp.shop_slug);
end;
$$;

revoke execute on function public.ma7alak_admin_get_all_video_live_usage() from public;
revoke execute on function public.ma7alak_admin_get_all_video_live_usage() from anon;
grant execute on function public.ma7alak_admin_get_all_video_live_usage() to authenticated;
