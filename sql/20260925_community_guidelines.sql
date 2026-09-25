-- =========================================================
-- SHOUFHON COMMUNITY GUIDELINES
-- Public read / admin-only editing
-- Applied to Supabase on 2026-09-25
-- =========================================================

create table if not exists public.community_guidelines (
  id text primary key,
  eyebrow text not null default 'ShoufHon Safety & Community',
  title_ar text not null default 'إرشادات المجتمع',
  title_en text not null default 'Community Guidelines',
  intro_title text not null default 'خلّينا نخلي ShoufHon مكان محترم وآمن للكل.',
  intro_body text not null default 'ShoufHon connects people with local shops, businesses, services, offers and live content. Whether you are browsing, messaging a shop, posting content, or going LIVE, everyone is expected to use the platform responsibly.',
  rules jsonb not null default '[]'::jsonb,
  closing_title text not null default 'Keep it local. Keep it respectful.',
  closing_body text not null default 'ShoufHon is built to help people discover and communicate with local businesses. Be genuine, be respectful, and let every shop have a fair chance to be seen.',
  signature text not null default 'خلّي محلك ينشاف. ❤️',
  is_published boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid null references auth.users(id) on delete set null
);

alter table public.community_guidelines enable row level security;

revoke insert, update, delete on table public.community_guidelines from anon;
grant select on table public.community_guidelines to anon;
grant select, insert, update, delete on table public.community_guidelines to authenticated;
grant all on table public.community_guidelines to service_role;

drop policy if exists "community_guidelines_public_read" on public.community_guidelines;
create policy "community_guidelines_public_read"
on public.community_guidelines
for select
to anon, authenticated
using (is_published = true or public.is_site_admin());

drop policy if exists "community_guidelines_admin_insert" on public.community_guidelines;
create policy "community_guidelines_admin_insert"
on public.community_guidelines
for insert
to authenticated
with check (public.is_site_admin());

drop policy if exists "community_guidelines_admin_update" on public.community_guidelines;
create policy "community_guidelines_admin_update"
on public.community_guidelines
for update
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "community_guidelines_admin_delete" on public.community_guidelines;
create policy "community_guidelines_admin_delete"
on public.community_guidelines
for delete
to authenticated
using (public.is_site_admin());

insert into public.community_guidelines (
  id, eyebrow, title_ar, title_en, intro_title, intro_body, rules,
  closing_title, closing_body, signature, is_published
)
values (
  'main',
  'ShoufHon Safety & Community',
  'إرشادات المجتمع',
  'Community Guidelines',
  'خلّينا نخلي ShoufHon مكان محترم وآمن للكل.',
  'ShoufHon connects people with local shops, businesses, services, offers and live content. Whether you are browsing, messaging a shop, posting content, or going LIVE, everyone is expected to use the platform responsibly.',
  jsonb_build_array(
    jsonb_build_object('icon','🤝','title','Respect everyone','text','Speak to customers, shop owners and other users respectfully. Harassment, threats, bullying, hate speech, sexual harassment or deliberately abusive behavior are not allowed.','enabled',true),
    jsonb_build_object('icon','💬','title','Use messages for genuine communication','text','Use messaging for real questions about products, services, availability, prices and other relevant topics. Do not spam, repeatedly contact someone who does not want contact, impersonate others, send scams or send inappropriate content.','enabled',true),
    jsonb_build_object('icon','🏪','title','Keep customer conversations professional','text','Shop owners should answer honestly and avoid misleading claims, pressure or abuse. Customers should also communicate respectfully with businesses and their staff.','enabled',true),
    jsonb_build_object('icon','🔴','title','Keep LIVE safe and appropriate','text','Do not broadcast violence, dangerous behavior, nudity or sexual content, illegal activity, harassment, private conversations without permission, or content intended to seriously shock or harm viewers.','enabled',true),
    jsonb_build_object('icon','📸','title','Only share media you are allowed to use','text','Photos, videos, reels, stories and other uploaded media should belong to you or be content you have permission to publish. Do not upload private or copyrighted material without authorization.','enabled',true),
    jsonb_build_object('icon','🔐','title','Respect privacy','text','Do not expose private phone numbers, addresses, passwords, identification documents, financial details, private messages or other sensitive information without permission.','enabled',true),
    jsonb_build_object('icon','🎬','title','Stories, reels and posts should be honest','text','Do not use fake claims, deceptive edits, misleading before-and-after images, impersonation or unrelated bait content simply to attract attention.','enabled',true),
    jsonb_build_object('icon','🏷️','title','Offers must be real','text','Prices, discounts, availability, dates and conditions should be accurate. If an offer expires, sells out or changes, shop owners should update or end it.','enabled',true),
    jsonb_build_object('icon','🛡️','title','No scams or fraudulent listings','text','Do not ask users for passwords or verification codes, create suspicious payment requests, or pretend to represent another business or person.','enabled',true),
    jsonb_build_object('icon','⚖️','title','No illegal or prohibited activity','text','ShoufHon must not be used to advertise, arrange, sell or promote illegal goods, illegal services or criminal activity.','enabled',true),
    jsonb_build_object('icon','🚫','title','Do not manipulate the platform','text','Fake accounts, fake engagement, automated spam, abusive reporting, attempts to bypass restrictions, exploitation of technical vulnerabilities or interference with other users are prohibited.','enabled',true),
    jsonb_build_object('icon','🚩','title','Report problems instead of escalating them','text','If someone is harassing you, sending inappropriate messages, impersonating a business or posting unsafe content, use the available Report or Block tools instead of escalating the situation.','enabled',true),
    jsonb_build_object('icon','✅','title','Shop owners are responsible for their content','text','Businesses are responsible for information, prices, offers, media and statements published through their shop account.','enabled',true),
    jsonb_build_object('icon','🔎','title','ShoufHon may act when guidelines are broken','text','Content may be removed and features or accounts may be restricted or suspended when these guidelines are seriously or repeatedly violated.','enabled',true)
  ),
  'Keep it local. Keep it respectful.',
  'ShoufHon is built to help people discover and communicate with local businesses. Be genuine, be respectful, and let every shop have a fair chance to be seen.',
  'خلّي محلك ينشاف. ❤️',
  true
)
on conflict (id) do nothing;
