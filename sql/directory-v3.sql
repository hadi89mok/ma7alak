-- Show Shops v3: additive controls, protected by the existing site-admin check.
alter table public.shop_profiles add column if not exists directory_options jsonb not null default '{}'::jsonb;
create table if not exists public.directory_settings (
 id text primary key check(id='main'),
 settings jsonb not null default '{}'::jsonb
);
alter table public.directory_settings enable row level security;
create policy directory_settings_read on public.directory_settings for select to anon,authenticated using(true);
create policy directory_settings_admin on public.directory_settings for all to authenticated using((select public.is_site_admin())) with check((select public.is_site_admin()));
grant select on public.directory_settings to anon;
grant select,insert,update,delete on public.directory_settings to authenticated;
insert into public.directory_settings(id) values('main') on conflict do nothing;
create table if not exists public.directory_requests (
 id uuid primary key default gen_random_uuid(),
 shop_name text not null check(length(shop_name) between 2 and 120),
 contact text not null check(length(contact) between 5 and 160),
 area text not null check(length(area) between 1 and 120),
 details text not null default '' check(length(details)<=2000),
 status text not null default 'new' check(status in ('new','reviewed')),
 created_at timestamptz not null default now()
);
alter table public.directory_requests enable row level security;
create policy directory_requests_submit on public.directory_requests for insert to anon,authenticated with check(status='new');
create policy directory_requests_admin on public.directory_requests for all to authenticated using((select public.is_site_admin())) with check((select public.is_site_admin()));
grant insert(shop_name,contact,area,details) on public.directory_requests to anon;
grant select,insert,update,delete on public.directory_requests to authenticated;
do $$ declare t text; begin
 foreach t in array array['directory_settings','shop_profiles','shop_categories','shop_cities','shop_areas','shop_media','shop_stories','shop_live_posts','shop_reels'] loop
 if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename=t) then
 execute format('alter publication supabase_realtime add table public.%I',t);
 end if; end loop;
end $$;
