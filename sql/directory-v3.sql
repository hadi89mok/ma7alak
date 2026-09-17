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

-- Public directory ranking. Raw visitor/follow rows stay private; callers only
-- receive per-shop aggregate signals used by the Popular section.
create or replace function public.get_directory_popularity()
returns table(
  shop_slug text,
  weekly_views bigint,
  follower_count bigint,
  active_story boolean,
  active_offer boolean,
  active_reel boolean,
  popularity_score numeric
)
language sql
stable
security definer
set search_path = ''
as $$
  with views as (
    select shop_id as shop_slug, count(*)::bigint as weekly_views
    from public.shop_views
    where viewed_at >= now() - interval '7 days'
    group by shop_id
  ), follows as (
    select sf.shop_slug, count(*)::bigint as follower_count
    from public.shop_follows sf
    group by sf.shop_slug
  ), stories as (
    select distinct ss.shop_slug
    from public.shop_stories ss
    where ss.expires_at > now()
  ), offers as (
    select distinct lp.shop_slug
    from public.shop_live_posts lp
    where lp.status = 'active' and lp.starts_at <= now() and lp.ends_at > now()
  ), reels as (
    select distinct sr.shop_slug
    from public.shop_reels sr
    where sr.active = true
  )
  select p.shop_slug,
    coalesce(v.weekly_views, 0)::bigint,
    coalesce(f.follower_count, 0)::bigint,
    (s.shop_slug is not null),
    (o.shop_slug is not null),
    (r.shop_slug is not null),
    round(
      least(coalesce(v.weekly_views, 0), 100)::numeric
      + least(coalesce(f.follower_count, 0), 100) * 5
      + case when s.shop_slug is not null then 20 else 0 end
      + case when o.shop_slug is not null then 25 else 0 end
      + case when r.shop_slug is not null then 10 else 0 end
      + least(
          coalesce(case
            when coalesce(p.directory_options->>'rating', '') ~ '^[0-9]+([.][0-9]+)?$'
            then (p.directory_options->>'rating')::numeric
            else 0
          end, 0),
          5
        ) * 4,
      2
    ) as popularity_score
  from public.shop_profiles p
  left join views v on v.shop_slug = p.shop_slug
  left join follows f on f.shop_slug = p.shop_slug
  left join stories s on s.shop_slug = p.shop_slug
  left join offers o on o.shop_slug = p.shop_slug
  left join reels r on r.shop_slug = p.shop_slug
  where p.is_active = true;
$$;
revoke all on function public.get_directory_popularity() from public;
grant execute on function public.get_directory_popularity() to anon, authenticated;
