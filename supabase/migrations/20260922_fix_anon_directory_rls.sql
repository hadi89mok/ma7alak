-- Fix logged-out directory loading.
-- The previous shared SELECT policies called is_site_admin() for the anon role,
-- which caused "permission denied for function is_site_admin" and aborted the
-- entire Show Shops refresh. Split anon and authenticated reads explicitly.

drop policy if exists "Public can read active shop categories" on public.shop_categories;
drop policy if exists "Anon can read active shop categories" on public.shop_categories;
drop policy if exists "Authenticated can read shop categories" on public.shop_categories;

create policy "Anon can read active shop categories"
on public.shop_categories
for select
to anon
using (is_active = true);

create policy "Authenticated can read shop categories"
on public.shop_categories
for select
to authenticated
using (
  is_active = true
  or (select public.is_site_admin())
);

drop policy if exists "Public can read active shop cities" on public.shop_cities;
drop policy if exists "Anon can read active shop cities" on public.shop_cities;
drop policy if exists "Authenticated can read shop cities" on public.shop_cities;

create policy "Anon can read active shop cities"
on public.shop_cities
for select
to anon
using (is_active = true);

create policy "Authenticated can read shop cities"
on public.shop_cities
for select
to authenticated
using (
  is_active = true
  or (select public.is_site_admin())
);

drop policy if exists "Public can read active shop areas" on public.shop_areas;
drop policy if exists "Anon can read active shop areas" on public.shop_areas;
drop policy if exists "Authenticated can read shop areas" on public.shop_areas;

create policy "Anon can read active shop areas"
on public.shop_areas
for select
to anon
using (is_active = true);

create policy "Authenticated can read shop areas"
on public.shop_areas
for select
to authenticated
using (
  is_active = true
  or (select public.is_site_admin())
);
