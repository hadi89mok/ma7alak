-- SHOUFHON LIVE/OFFER MEDIA CAPTIONS
alter table public.shop_live_post_media
  add column if not exists caption text;

update public.shop_live_post_media
set caption = null
where caption is not null and btrim(caption)='';

comment on column public.shop_live_post_media.caption
  is 'Optional owner-written description for this individual Live/Offer media item.';
