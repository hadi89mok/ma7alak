-- ShoufHon public rebrand cutover
-- Applied to Supabase on 2026-09-20.
-- Internal ma7alak_* table/function names intentionally remain unchanged.

begin;

update public.shop_profiles
set shop_url = replace(
  replace(shop_url,'https://www.ma7alak.com','https://shoufhon.com'),
  'https://ma7alak.com',
  'https://shoufhon.com'
)
where shop_url ilike '%ma7alak.com%';

update public.shop_reels
set shop_url = replace(
  replace(shop_url,'https://www.ma7alak.com','https://shoufhon.com'),
  'https://ma7alak.com',
  'https://shoufhon.com'
)
where shop_url ilike '%ma7alak.com%';

update public.subscription_page_settings
set settings = replace(
                 replace(
                   replace(
                     replace(
                       settings::text,
                       'https://6aa2c9b0ea08b9137fd5ada9.imgix.net/sandbox/3d5e9803-9a46-49c5-bf62-c7bbf7b5bc84.png',
                       'https://6aa2c9b0ea08b9137fd5ada9.imgix.net/sandbox/Gemini_Generated_Image_ds8wfsds8wfsds8w.jfif'
                     ),
                     'Basic ma7alak page',
                     'Basic ShoufHon page'
                   ),
                   'Ma7alak',
                   'ShoufHon'
                 ),
                 'MA7ALAK',
                 'SHOUFHON'
               )::jsonb
where lower(settings::text) like '%ma7alak%'
   or settings::text like '%3d5e9803-9a46-49c5-bf62-c7bbf7b5bc84.png%';

do $rebrand$
declare
  r record;
  ddl text;
begin
  for r in
    select p.oid
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prokind in ('f','p')
      and p.proname in (
        'ma7alak_push_new_reel',
        'ma7alak_push_new_story',
        'publish_my_reel',
        'ma7alak_create_viewer_profile',
        'ma7alak_admin_assign_shop_owner',
        'ma7alak_guard_owner_reel_insert'
      )
  loop
    ddl := pg_get_functiondef(r.oid);
    ddl := replace(ddl, 'https://ma7alak.com', 'https://shoufhon.com');
    ddl := replace(ddl, 'Ma7alak', 'ShoufHon');
    ddl := replace(ddl, 'MA7ALAK', 'SHOUFHON');
    execute ddl;
  end loop;
end
$rebrand$;

commit;
