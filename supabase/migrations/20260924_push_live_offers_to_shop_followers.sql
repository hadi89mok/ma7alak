create or replace function public.ma7alak_push_new_live_offer()
returns trigger
language plpgsql
security definer
set search_path = 'public'
as $function$
declare
  v_shop_name text;
  v_title text;
  v_body text;
  v_url text;
  v_internal_key text;
  v_request_id bigint;
begin
  if new.status is distinct from 'active' then
    return new;
  end if;

  if new.ends_at <= now() then
    return new;
  end if;

  select coalesce(
    nullif(trim(sp.shop_name), ''),
    nullif(trim(new.shop_name), ''),
    'ShoufHon shop'
  )
  into v_shop_name
  from public.shop_profiles sp
  where sp.shop_slug = new.shop_slug
  limit 1;

  v_shop_name := coalesce(
    nullif(trim(v_shop_name), ''),
    nullif(trim(new.shop_name), ''),
    'ShoufHon shop'
  );

  v_title := v_shop_name || ' 🔥';

  v_body :=
    case new.post_type
      when 'offer' then
        'New offer: ' || left(coalesce(nullif(trim(new.title), ''), 'Tap to view'), 110)
      when 'happening' then
        'Happening now: ' || left(coalesce(nullif(trim(new.title), ''), 'Tap to view'), 110)
      when 'arrival' then
        'New arrival: ' || left(coalesce(nullif(trim(new.title), ''), 'Tap to view'), 110)
      when 'event' then
        'New event: ' || left(coalesce(nullif(trim(new.title), ''), 'Tap to view'), 110)
      else
        'New Live update: ' || left(coalesce(nullif(trim(new.title), ''), 'Tap to view'), 110)
    end;

  v_url :=
    'https://shoufhon.com/?live=' ||
    new.id::text;

  select decrypted_secret
  into v_internal_key
  from vault.decrypted_secrets
  where name = 'shoufhon_internal_push_key'
  limit 1;

  if nullif(v_internal_key, '') is null then
    raise warning 'ShoufHon Live/Offer push skipped: internal push key is unavailable';
    return new;
  end if;

  select net.http_post(
    url := 'https://wdtaiuwtqdepzdamgsrs.supabase.co/functions/v1/send-push',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', 'sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl',
      'x-shoufhon-internal-key', v_internal_key
    ),
    body := jsonb_build_object(
      'title', v_title,
      'body', v_body,
      'url', v_url,
      'type', 'live-offer',
      'shop_slug', new.shop_slug,
      'content_id', new.id::text,
      'target_followers_of_shop', new.shop_slug
    ),
    timeout_milliseconds := 5000
  )
  into v_request_id;

  return new;
end;
$function$;

drop trigger if exists ma7alak_push_new_live_offer_trigger
on public.shop_live_posts;

create trigger ma7alak_push_new_live_offer_trigger
after insert on public.shop_live_posts
for each row
execute function public.ma7alak_push_new_live_offer();

alter table public.shop_live_posts
  enable trigger ma7alak_push_new_live_offer_trigger;
