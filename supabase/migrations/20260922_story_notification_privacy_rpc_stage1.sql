-- Stage 1 privacy hardening for Story notification seen-state.
-- Add narrow RPCs first while legacy direct table policies remain in place.
-- The frontend is migrated to these RPCs before direct table access is revoked.

create or replace function public.get_story_notification_seen_state(
  p_visitor_id text,
  p_story_ids bigint[]
)
returns table(story_id bigint, seen_at timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.ma7alak_valid_follow_visitor_id(p_visitor_id) then
    raise exception 'Invalid visitor id';
  end if;

  if p_story_ids is null
     or coalesce(array_length(p_story_ids,1),0)=0 then
    return;
  end if;

  if array_length(p_story_ids,1)>100 then
    raise exception 'Too many story ids';
  end if;

  return query
  select v.story_id,v.seen_at
  from public.story_notification_views v
  where v.visitor_id=btrim(p_visitor_id)
    and v.story_id=any(p_story_ids)
  order by v.story_id;
end;
$$;

revoke all on function public.get_story_notification_seen_state(text,bigint[])
from public,anon,authenticated;

grant execute on function public.get_story_notification_seen_state(text,bigint[])
to anon,authenticated;

create or replace function public.mark_story_notifications_seen(
  p_visitor_id text,
  p_story_ids bigint[]
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_inserted integer := 0;
begin
  if not public.ma7alak_valid_follow_visitor_id(p_visitor_id) then
    raise exception 'Invalid visitor id';
  end if;

  if p_story_ids is null
     or coalesce(array_length(p_story_ids,1),0)=0 then
    return 0;
  end if;

  if array_length(p_story_ids,1)>100 then
    raise exception 'Too many story ids';
  end if;

  insert into public.story_notification_views(visitor_id,story_id)
  select btrim(p_visitor_id),ids.story_id
  from (
    select distinct unnest(p_story_ids)::bigint as story_id
  ) ids
  join public.shop_stories s
    on s.id=ids.story_id
  where s.expires_at>now()
  on conflict(visitor_id,story_id) do nothing;

  get diagnostics v_inserted=row_count;
  return v_inserted;
end;
$$;

revoke all on function public.mark_story_notifications_seen(text,bigint[])
from public,anon,authenticated;

grant execute on function public.mark_story_notifications_seen(text,bigint[])
to anon,authenticated;
