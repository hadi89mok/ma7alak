-- ShoufHon: Profile & Banner is the only image source for public directory/home cards.
update public.shop_profiles
set directory_options = coalesce(directory_options,'{}'::jsonb) - 'cover'
where coalesce(directory_options,'{}'::jsonb) ? 'cover';
