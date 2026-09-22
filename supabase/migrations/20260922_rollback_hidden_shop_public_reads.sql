-- Roll back the inactive-shop public-read RLS experiment.
-- This restores the pre-Fix-3 public behavior while keeping the
-- compatibility visibility RPC available for the pinned guard.

drop policy if exists "Public can view active shop profiles" on public.shop_profiles;
drop policy if exists "Authenticated can view permitted shop profiles" on public.shop_profiles;
create policy "Anyone can view shop profiles"
on public.shop_profiles
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read active shop gallery" on public.shop_gallery;
drop policy if exists "Authenticated can read permitted shop gallery" on public.shop_gallery;
create policy "Public can read shop gallery"
on public.shop_gallery
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read active shop videos" on public.shop_videos;
drop policy if exists "Authenticated can read permitted shop videos" on public.shop_videos;
create policy "Public can read shop videos"
on public.shop_videos
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read active reels for active shops" on public.shop_reels;
drop policy if exists "Authenticated can read permitted reels" on public.shop_reels;
create policy "public can read active reels"
on public.shop_reels
for select
to anon
using (active = true);
create policy "authenticated can read permitted reels"
on public.shop_reels
for select
to authenticated
using (
  (active = true)
  or (select public.is_site_admin())
  or exists (
    select 1
    from public.shop_owners so
    where so.user_id = (select auth.uid())
      and so.shop_slug = shop_reels.shop_slug
  )
);

drop policy if exists "Public can read active stories for active shops" on public.shop_stories;
drop policy if exists "Authenticated can read permitted stories" on public.shop_stories;
create policy "Anyone can view active stories"
on public.shop_stories
for select
to public
using (expires_at > now());

drop policy if exists "Public can read active live posts for active shops" on public.shop_live_posts;
drop policy if exists "Authenticated can read permitted live posts" on public.shop_live_posts;
create policy "public read active live posts"
on public.shop_live_posts
for select
to anon
using ((status = 'active') and (ends_at > now()));
create policy "authenticated read permitted live posts"
on public.shop_live_posts
for select
to authenticated
using (
  ((status = 'active') and (ends_at > now()))
  or exists (
    select 1
    from public.shop_owners o
    where o.user_id = (select auth.uid())
      and o.shop_slug = shop_live_posts.shop_slug
  )
);

drop policy if exists "Public can read active live media for active shops" on public.shop_live_post_media;
drop policy if exists "Authenticated can read permitted live media" on public.shop_live_post_media;
create policy "public read active live post media"
on public.shop_live_post_media
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.shop_live_posts p
    where p.id = shop_live_post_media.post_id
      and p.status = 'active'
      and p.ends_at > now()
  )
  or exists (
    select 1
    from public.shop_owners o
    where o.user_id = (select auth.uid())
      and o.shop_slug = shop_live_post_media.shop_slug
  )
);

create or replace function public.get_shop_visibility_status(p_shop_slug text)
returns table(shop_slug text, exists_in_directory boolean, is_active boolean)
language sql
stable
security definer
set search_path = ''
as $$
  with target as (
    select p.shop_slug, p.is_active
    from public.shop_profiles p
    where lower(p.shop_slug) = lower(trim(both '/' from btrim(coalesce(p_shop_slug,''))))
    limit 1
  )
  select
    coalesce((select t.shop_slug from target t), trim(both '/' from btrim(coalesce(p_shop_slug,'')))) as shop_slug,
    exists(select 1 from target) as exists_in_directory,
    coalesce((select t.is_active from target t), false) as is_active;
$$;

revoke all on function public.get_shop_visibility_status(text) from public;
grant execute on function public.get_shop_visibility_status(text) to anon, authenticated;
