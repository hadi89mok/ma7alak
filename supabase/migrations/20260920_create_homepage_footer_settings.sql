create table public.homepage_footer_settings (
  id text primary key default 'main',
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.homepage_footer_settings enable row level security;

grant select on table public.homepage_footer_settings to anon, authenticated;
grant insert, update, delete on table public.homepage_footer_settings to authenticated;
grant all on table public.homepage_footer_settings to service_role;

create policy "homepage_footer_settings_public_read"
on public.homepage_footer_settings
for select
to anon, authenticated
using (id = 'main');

create policy "homepage_footer_settings_admin_all"
on public.homepage_footer_settings
for all
to authenticated
using ((select public.is_site_admin()))
with check ((select public.is_site_admin()));

insert into public.homepage_footer_settings (id, settings)
values (
  'main',
  '{
    "enabled":true,
    "background_url":"builtin",
    "background_overlay":72,
    "background_position":"center 54%",
    "background_zoom":115,
    "background_color":"#080604",
    "accent_color":"#d9a441",
    "accent_color_2":"#f2cc7b",
    "panel_color":"#0b0805",
    "text_color":"#f7dfaa",
    "muted_color":"#d8c8a8",
    "logo_url":"https://6aa2c9b0ea08b9137fd5ada9.imgix.net/sandbox/hadi%20new.png",
    "logo_size":190,
    "logo_animation":"float-glow",
    "title":"شوف هون المحلات",
    "title_color":"#e7bd6b",
    "title_size":31,
    "title_animation":"glow",
    "subtitle":"اكتشف محلات منطقتك بمكان واحد",
    "subtitle_color":"#e8d5b5",
    "subtitle_size":17,
    "subtitle_animation":"fade",
    "top_line_enabled":true,
    "top_line_color":"#d9a441",
    "top_line_animation":"travel",
    "nav_color":"#f4d694",
    "nav_animation":"none",
    "navigation":[
      {"label":"الرئيسية","url":"/","enabled":true},
      {"label":"شوف المحلات","url":"/shwf-almhlat-","enabled":true},
      {"label":"ضيف محلك","url":"/add-shop-","enabled":true}
    ],
    "social_icon_color":"#f1c86e",
    "social_glow_color":"#d9a441",
    "social_size":46,
    "social_animation":"float",
    "socials":[
      {"type":"instagram","label":"Instagram","url":"","enabled":false},
      {"type":"tiktok","label":"TikTok","url":"","enabled":false},
      {"type":"whatsapp","label":"WhatsApp","url":"","enabled":false}
    ],
    "copyright_text":"© 2026 ShoufHon. All rights reserved.",
    "copyright_color":"#f0e4d0",
    "copyright_size":13,
    "copyright_animation":"none",
    "bottom_text":"Made with Love",
    "bottom_color":"#f4d694",
    "bottom_size":14,
    "bottom_animation":"heartbeat",
    "show_flag":true,
    "footer_min_height":590,
    "top_radius":34,
    "content_max_width":760,
    "overall_animation":"subtle",
    "animation_speed":100,
    "animation_intensity":65,
    "cedar_enabled":true,
    "side_note_enabled":true,
    "side_note_text":"Lebanon\nLocal\nAlways ♡",
    "side_note_color":"#cfa660"
  }'::jsonb
);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'homepage_footer_settings'
  ) then
    alter publication supabase_realtime add table public.homepage_footer_settings;
  end if;
end $$;
