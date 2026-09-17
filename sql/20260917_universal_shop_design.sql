-- MA7ALAK UNIVERSAL SHOP DESIGN CONFIGURATION
-- Additive only. Run after the existing Ma7alak directory/auth SQL.

create table if not exists public.shop_page_design (
  shop_slug text primary key references public.shop_profiles(shop_slug) on update cascade on delete cascade,
  plan text not null default 'basic' check (plan in ('basic','premium','vip_custom')),
  template_key text not null default 'zee-premium-v2',
  published boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.shop_page_design enable row level security;

drop policy if exists "Public can read published shop designs" on public.shop_page_design;
create policy "Public can read published shop designs" on public.shop_page_design for select to anon, authenticated using (
 published = true and exists (select 1 from public.shop_profiles p where p.shop_slug = shop_page_design.shop_slug and p.is_active = true)
);

drop policy if exists "Site admins can read all shop designs" on public.shop_page_design;
create policy "Site admins can read all shop designs" on public.shop_page_design for select to authenticated using ((select public.is_site_admin()));

drop policy if exists "Site admins can insert shop designs" on public.shop_page_design;
create policy "Site admins can insert shop designs" on public.shop_page_design for insert to authenticated with check ((select public.is_site_admin()));

drop policy if exists "Site admins can update shop designs" on public.shop_page_design;
create policy "Site admins can update shop designs" on public.shop_page_design for update to authenticated using ((select public.is_site_admin())) with check ((select public.is_site_admin()));

drop policy if exists "Site admins can delete shop designs" on public.shop_page_design;
create policy "Site admins can delete shop designs" on public.shop_page_design for delete to authenticated using ((select public.is_site_admin()));

revoke all privileges on table public.shop_page_design from anon;
grant select on table public.shop_page_design to anon;
revoke truncate, references, trigger on table public.shop_page_design from authenticated;
grant select, insert, update, delete on table public.shop_page_design to authenticated;

create index if not exists shop_page_design_published_idx on public.shop_page_design (published, shop_slug);

do $$ begin
 if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='shop_page_design') then
  alter publication supabase_realtime add table public.shop_page_design;
 end if;
end $$;