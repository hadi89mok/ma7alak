-- Ma7alak /add-shop- subscription page settings.
-- Public visitors may read the published page; only site admins may edit it.

create table if not exists public.subscription_page_settings (
  id text primary key default 'main',
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.subscription_page_settings enable row level security;

drop policy if exists subscription_page_settings_public_read on public.subscription_page_settings;
create policy subscription_page_settings_public_read
on public.subscription_page_settings
for select
to anon, authenticated
using (id = 'main');

drop policy if exists subscription_page_settings_admin_insert on public.subscription_page_settings;
create policy subscription_page_settings_admin_insert
on public.subscription_page_settings
for insert
to authenticated
with check ((select public.is_site_admin()));

drop policy if exists subscription_page_settings_admin_update on public.subscription_page_settings;
create policy subscription_page_settings_admin_update
on public.subscription_page_settings
for update
to authenticated
using ((select public.is_site_admin()))
with check ((select public.is_site_admin()));

drop policy if exists subscription_page_settings_admin_delete on public.subscription_page_settings;
create policy subscription_page_settings_admin_delete
on public.subscription_page_settings
for delete
to authenticated
using ((select public.is_site_admin()));

grant select on public.subscription_page_settings to anon;
grant select, insert, update, delete on public.subscription_page_settings to authenticated;

insert into public.subscription_page_settings (id, settings)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'subscription_page_settings'
  ) then
    alter publication supabase_realtime add table public.subscription_page_settings;
  end if;
end $$;
