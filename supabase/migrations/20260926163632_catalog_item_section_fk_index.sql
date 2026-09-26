-- Catalog item -> section foreign-key lookup support.
-- Matches the FK column order so deletes/updates on sections do not require
-- a full scan of shop_catalog_items.
create index if not exists shop_catalog_items_section_shop_idx
on public.shop_catalog_items(section_id, shop_slug);
