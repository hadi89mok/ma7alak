-- Stage 1 hidden-shop hardening.
-- Public/anonymous users can read only active shop profile rows.
-- Signed-in site admins and the assigned owner can still read hidden profiles.
-- The directory remains public because it already filters to is_active=true.

drop policy if exists "Anyone can view shop profiles" on public.shop_profiles;
drop policy if exists "Public can view active shop profiles" on public.shop_profiles;
drop policy if exists "Authenticated can view permitted shop profiles" on public.shop_profiles;

create policy "Public can view active shop profiles"
on public.shop_profiles
for select
to anon
using (is_active = true);

create policy "Authenticated can view permitted shop profiles"
on public.shop_profiles
for select
to authenticated
using (
  is_active = true
  or (select public.is_site_admin())
  or exists (
    select 1
    from public.shop_owners so
    where so.user_id = (select auth.uid())
      and so.shop_slug = shop_profiles.shop_slug
  )
);
