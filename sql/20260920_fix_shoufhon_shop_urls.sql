-- Corrective live migration applied after the initial ShoufHon cutover.
-- Ensures all stored shop/reel URLs use shoufhon.com.

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

commit;
