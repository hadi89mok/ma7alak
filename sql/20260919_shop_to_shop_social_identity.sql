-- Ma7alak shop-to-shop social identity + messaging
-- Applied to production on 2026-09-19.
--
-- 1) Shop owners may message other shops, but never their own shop.
-- 2) Owner-heart follow notifications resolve an owner actor to the actor's shop.
-- 3) Chat can resolve the correct counterpart identity for viewer/shop participants.

create or replace function public.ma7alak_start_conversation(p_shop_slug text)
returns public.ma7alak_conversations
language plpgsql
security definer
set search_path = 'public'
as $$
declare
  v_row public.ma7alak_conversations;
  v_slug text := lower(btrim(p_shop_slug));
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if not exists(
    select 1
    from public.shop_profiles
    where lower(btrim(shop_slug)) = v_slug
  ) then
    raise exception 'Shop not found: %', v_slug;
  end if;

  select shop_slug
  into v_slug
  from public.shop_profiles
  where lower(btrim(shop_slug)) = v_slug
  limit 1;

  if exists(
    select 1
    from public.shop_owners
    where user_id = auth.uid()
      and shop_slug = v_slug
  ) then
    raise exception 'You cannot message your own shop';
  end if;

  insert into public.ma7alak_conversations(shop_slug,viewer_id)
  values(v_slug,auth.uid())
  on conflict(viewer_id,shop_slug)
  do update set updated_at = public.ma7alak_conversations.updated_at
  returning * into v_row;

  return v_row;
end;
$$;

revoke all on function public.ma7alak_start_conversation(text) from public;
grant execute on function public.ma7alak_start_conversation(text) to authenticated;

create or replace function public.ma7alak_get_my_owner_notifications()
returns table(
  id uuid,
  type text,
  shop_slug text,
  story_id integer,
  created_at timestamptz,
  seen boolean,
  actor_user_id uuid,
  actor_name text,
  actor_username text,
  actor_avatar text
)
language sql
security definer
set search_path = 'public'
as $$
  select
    n.id,
    n.type,
    n.shop_slug,
    n.story_id,
    n.created_at,
    n.seen,
    n.actor_user_id,
    case
      when n.type = 'follow' and actor_shop.shop_slug is not null
        then coalesce(nullif(actor_shop.shop_name,''),'Shop')
      else coalesce(nullif(v.display_name,''),nullif(v.username,''),'Someone')
    end as actor_name,
    case
      when n.type = 'follow' and actor_shop.shop_slug is not null
        then 'shop:' || coalesce(nullif(actor_shop.shop_url,''),actor_shop.shop_slug)
      else v.username
    end as actor_username,
    case
      when n.type = 'follow' and actor_shop.shop_slug is not null
        then actor_shop.profile_image_url
      else v.avatar_url
    end as actor_avatar
  from public.ma7alak_owner_notifications n
  left join public.viewer_profiles v
    on v.user_id = n.actor_user_id
  left join public.shop_owners actor_owner
    on actor_owner.user_id = n.actor_user_id
  left join public.shop_profiles actor_shop
    on actor_shop.shop_slug = actor_owner.shop_slug
  where n.shop_slug in(
    select shop_slug
    from public.shop_owners
    where user_id = auth.uid()
  )
  order by n.created_at desc
  limit 100;
$$;

revoke all on function public.ma7alak_get_my_owner_notifications() from public;
grant execute on function public.ma7alak_get_my_owner_notifications() to authenticated;

create or replace function public.ma7alak_get_conversation_partners(
  p_conversation_ids uuid[]
)
returns table(
  conversation_id uuid,
  counterpart_type text,
  display_name text,
  username text,
  avatar_url text,
  shop_slug text,
  shop_url text
)
language sql
stable
security definer
set search_path = 'public'
as $$
  select
    c.id as conversation_id,

    case
      when c.viewer_id = auth.uid() then 'shop'
      when source_owner.shop_slug is not null then 'shop'
      else 'viewer'
    end as counterpart_type,

    case
      when c.viewer_id = auth.uid()
        then coalesce(nullif(target_shop.shop_name,''),c.shop_slug)
      when source_owner.shop_slug is not null
        then coalesce(nullif(source_shop.shop_name,''),source_owner.shop_slug)
      else coalesce(nullif(v.display_name,''),nullif(v.username,''),'Customer')
    end as display_name,

    case
      when c.viewer_id = auth.uid()
        then target_shop.shop_slug
      when source_owner.shop_slug is not null
        then source_owner.shop_slug
      else v.username
    end as username,

    case
      when c.viewer_id = auth.uid()
        then target_shop.profile_image_url
      when source_owner.shop_slug is not null
        then source_shop.profile_image_url
      else v.avatar_url
    end as avatar_url,

    case
      when c.viewer_id = auth.uid()
        then target_shop.shop_slug
      when source_owner.shop_slug is not null
        then source_owner.shop_slug
      else null
    end as shop_slug,

    case
      when c.viewer_id = auth.uid()
        then target_shop.shop_url
      when source_owner.shop_slug is not null
        then source_shop.shop_url
      else null
    end as shop_url

  from public.ma7alak_conversations c
  left join public.shop_profiles target_shop
    on target_shop.shop_slug = c.shop_slug
  left join public.shop_owners source_owner
    on source_owner.user_id = c.viewer_id
  left join public.shop_profiles source_shop
    on source_shop.shop_slug = source_owner.shop_slug
  left join public.viewer_profiles v
    on v.user_id = c.viewer_id
  where c.id = any(coalesce(p_conversation_ids,'{}'::uuid[]))
    and public.ma7alak_can_access_conversation(c.id);
$$;

revoke all on function public.ma7alak_get_conversation_partners(uuid[]) from public;
grant execute on function public.ma7alak_get_conversation_partners(uuid[]) to authenticated;
