-- =========================================================
-- SHOUFHON OWNER HUB DETAILS
-- Owner-safe About/Location editor uses the existing
-- owner_about_edit_enabled entitlement.
-- =========================================================

create or replace function public.owner_update_hub_details(
  p_shop_slug text,
  p_address_text text,
  p_availability_days text,
  p_availability_time text
)
returns jsonb
language plpgsql
security definer
set search_path = 'public','auth','pg_temp'
as $$
declare
  v_slug text := lower(trim(both '/' from trim(coalesce(p_shop_slug,''))));
  v_options jsonb;
  v_address text := trim(coalesce(p_address_text,''));
  v_days text := trim(coalesce(p_availability_days,''));
  v_time text := trim(coalesce(p_availability_time,''));
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if v_slug = '' then
    raise exception 'Shop is required';
  end if;

  if length(v_address) > 500 then
    raise exception 'Location is too long';
  end if;

  if length(v_days) > 120 then
    raise exception 'Availability days text is too long';
  end if;

  if length(v_time) > 120 then
    raise exception 'Availability time text is too long';
  end if;

  select coalesce(p.directory_options,'{}'::jsonb)
    into v_options
  from public.shop_profiles p
  where lower(p.shop_slug)=v_slug
    and exists(
      select 1
      from public.shop_owners o
      where o.user_id=auth.uid()
        and lower(o.shop_slug)=v_slug
    )
  for update;

  if not found then
    raise exception 'You are not the owner of this shop';
  end if;

  if not coalesce(
    lower(v_options->>'owner_about_edit_enabled') in ('true','1','yes','on'),
    false
  ) then
    raise exception 'About / Location editing is disabled for this shop';
  end if;

  -- One canonical source for public manual availability.
  -- Remove the old extra-row key so legacy hidden data cannot reappear.
  v_options :=
    v_options
    - 'availability_days'
    - 'availability_time'
    - 'availability_extra_rows';

  if v_days <> '' then
    v_options := v_options || jsonb_build_object('availability_days',v_days);
  end if;

  if v_time <> '' then
    v_options := v_options || jsonb_build_object('availability_time',v_time);
  end if;

  update public.shop_profiles
  set
    address_text = nullif(v_address,''),
    directory_options = v_options
  where lower(shop_slug)=v_slug;

  return jsonb_build_object(
    'shop_slug',v_slug,
    'address_text',v_address,
    'availability_days',v_days,
    'availability_time',v_time
  );
end;
$$;

revoke execute on function public.owner_update_hub_details(text,text,text,text) from public;
revoke execute on function public.owner_update_hub_details(text,text,text,text) from anon;
grant execute on function public.owner_update_hub_details(text,text,text,text) to authenticated;
