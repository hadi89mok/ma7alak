-- Remove the retired multi-row Availability payload.
-- The Hub now has one canonical manual day/time pair and automatic Hours fallback.

update public.shop_profiles
set directory_options = coalesce(directory_options,'{}'::jsonb) - 'availability_extra_rows'
where coalesce(directory_options,'{}'::jsonb) ? 'availability_extra_rows';
