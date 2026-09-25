-- =========================================================
-- SHOUFHON OWNER VIDEO LIVE ACCESS STATUS
-- Lets an authenticated shop owner read their own remaining
-- monthly Video LIVE time before opening the camera.
-- =========================================================

create or replace function public.shoufhon_owner_get_video_live_access(p_shop_slug text)
returns table(
  video_live_enabled boolean,
  monthly_minutes integer,
  used_seconds bigint,
  used_minutes integer,
  remaining_seconds bigint,
  remaining_minutes integer,
  exhausted boolean
)
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_slug text;
  v_enabled boolean;
  v_limit integer;
  v_used bigint;
  v_remaining bigint;
begin
  v_slug:=lower(trim(both '/' from trim(coalesce(p_shop_slug,''))));
  if v_slug='' then raise exception 'SHOP_REQUIRED'; end if;

  if auth.uid() is null or not exists(
    select 1
    from public.shop_owners o
    where o.user_id=auth.uid()
      and lower(o.shop_slug)=v_slug
  ) then
    raise exception 'NOT_OWNER';
  end if;

  select coalesce(e.video_live_enabled,false),
         coalesce(e.video_live_monthly_minutes,0)
    into v_enabled,v_limit
  from public.shop_live_entitlements e
  where lower(e.shop_slug)=v_slug;

  v_enabled:=coalesce(v_enabled,false);
  v_limit:=coalesce(v_limit,0);
  v_used:=public.shoufhon_video_live_used_seconds(v_slug);
  v_remaining:=case
    when v_limit=0 then -1
    else greatest(0,(v_limit::bigint*60)-v_used)
  end;

  return query
  select
    v_enabled,
    v_limit,
    v_used,
    ceil(v_used/60.0)::integer,
    v_remaining,
    case when v_limit=0 then -1 else ceil(v_remaining/60.0)::integer end,
    (v_enabled and v_limit>0 and v_remaining<=0);
end;
$function$;

revoke all on function public.shoufhon_owner_get_video_live_access(text) from public;
grant execute on function public.shoufhon_owner_get_video_live_access(text) to authenticated;
