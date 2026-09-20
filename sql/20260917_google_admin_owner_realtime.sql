-- Google-only ShoufHon administration and instant owner-assignment refresh.
-- The Edge Function still performs permanent Auth-user deletion because the
-- service-role key must never be exposed to browser JavaScript.

insert into public.site_admins (user_id)
select id
from auth.users
where lower(email) = lower('hadizeboss89@gmail.com')
on conflict (user_id) do nothing;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'shop_owners'
  ) then
    alter publication supabase_realtime add table public.shop_owners;
  end if;
end
$$;
