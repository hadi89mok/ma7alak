-- Block shop owners from following their own shop or liking their own story.

delete from public.story_like_notifications n
using public.shop_owners o
where n.actor_user_id = o.user_id
  and n.shop_slug = o.shop_slug;

delete from public.ma7alak_owner_notifications n
using public.shop_owners o
where n.actor_user_id = o.user_id
  and n.shop_slug = o.shop_slug
  and n.type in ('story_like','follow');

delete from public.story_likes l
using public.shop_owners o
where l.actor_user_id = o.user_id
  and l.shop_slug = o.shop_slug;

delete from public.shop_follows f
using public.shop_owners o
where f.user_id = o.user_id
  and f.shop_slug = o.shop_slug;

create or replace function public.follow_shop(p_shop_slug text, p_visitor_id text)
returns table(following boolean, follower_count bigint)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_shop_slug text := btrim(p_shop_slug);
  v_visitor_id text := btrim(p_visitor_id);
  v_user_id uuid := auth.uid();
begin
  if not public.ma7alak_valid_follow_shop_slug(v_shop_slug) then
    raise exception 'Invalid shop slug';
  end if;
  if not public.ma7alak_valid_follow_visitor_id(v_visitor_id) then
    raise exception 'Invalid visitor id';
  end if;
  if v_user_id is not null and exists (
    select 1 from public.shop_owners o
    where o.user_id = v_user_id and o.shop_slug = v_shop_slug
  ) then
    raise exception 'Shop owners cannot follow their own shop';
  end if;

  insert into public.shop_follows(shop_slug,visitor_id,user_id)
  values(v_shop_slug,v_visitor_id,v_user_id)
  on conflict(shop_slug,visitor_id) do update
    set user_id=coalesce(excluded.user_id,public.shop_follows.user_id);

  return query select true,(
    select count(*)::bigint from public.shop_follows f where f.shop_slug=v_shop_slug
  );
end;
$$;

create or replace function public.get_visitor_followed_shops(p_visitor_id text)
returns table(shop_slug text, followed_at timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare v_visitor_id text := btrim(p_visitor_id);
begin
  if not public.ma7alak_valid_follow_visitor_id(v_visitor_id) then
    raise exception 'Invalid visitor id';
  end if;
  return query
    select f.shop_slug,f.created_at
    from public.shop_follows f
    where f.visitor_id=v_visitor_id
      and not exists (
        select 1 from public.shop_owners o
        where o.user_id=auth.uid() and o.shop_slug=f.shop_slug
      )
    order by f.created_at desc;
end;
$$;

create or replace function public.like_story(p_story_id integer,p_visitor_id text)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_shop_slug text;
  v_like_id uuid;
  v_like_count integer;
  v_already_liked boolean := false;
  v_actor uuid := auth.uid();
begin
  if p_story_id is null or p_visitor_id is null or trim(p_visitor_id)='' then
    return json_build_object('success',false,'message','Missing story ID or visitor ID');
  end if;
  select s.shop_slug into v_shop_slug
  from public.shop_stories s
  where s.id=p_story_id and s.expires_at>now()
  limit 1;
  if v_shop_slug is null then
    return json_build_object('success',false,'message','Story not found or expired');
  end if;
  if v_actor is not null and exists (
    select 1 from public.shop_owners o
    where o.user_id=v_actor and o.shop_slug=v_shop_slug
  ) then
    return json_build_object('success',false,'blocked',true,'message','Shop owners cannot like their own story','story_id',p_story_id,'shop_slug',v_shop_slug);
  end if;

  insert into public.story_likes(story_id,shop_slug,visitor_id,actor_user_id)
  values(p_story_id,v_shop_slug,p_visitor_id,v_actor)
  on conflict(story_id,visitor_id) do nothing
  returning id into v_like_id;
  if v_like_id is null then
    v_already_liked:=true;
  else
    insert into public.story_like_notifications(shop_slug,story_id,like_id,visitor_id,actor_user_id)
    values(v_shop_slug,p_story_id,v_like_id,p_visitor_id,v_actor);
    insert into public.ma7alak_owner_notifications(shop_slug,type,actor_user_id,actor_visitor_id,story_id,source_id)
    values(v_shop_slug,'story_like',v_actor,p_visitor_id,p_story_id,v_like_id::text);
  end if;
  select count(*) into v_like_count from public.story_likes where story_id=p_story_id;
  return json_build_object('success',true,'liked',not v_already_liked,'already_liked',v_already_liked,'like_count',v_like_count,'story_id',p_story_id,'shop_slug',v_shop_slug);
end;
$$;

revoke all on function public.follow_shop(text,text) from public;
revoke all on function public.get_visitor_followed_shops(text) from public;
revoke all on function public.like_story(integer,text) from public;
grant execute on function public.follow_shop(text,text) to anon,authenticated;
grant execute on function public.get_visitor_followed_shops(text) to anon,authenticated;
grant execute on function public.like_story(integer,text) to anon,authenticated;

