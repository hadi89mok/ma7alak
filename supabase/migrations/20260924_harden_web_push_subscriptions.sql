alter table public.push_subscriptions enable row level security;

drop policy if exists "ma7alak push insert"
on public.push_subscriptions;

revoke all on table public.push_subscriptions
from anon, authenticated;
