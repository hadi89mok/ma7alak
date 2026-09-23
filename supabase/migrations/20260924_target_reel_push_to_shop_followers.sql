create or replace function public.ma7alak_push_new_reel()
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
  v_request_id bigint;
  v_internal_key text;
begin
  if new.active is distinct from true then
    return new;
  end if;

  select shop_name
  into v_shop_name
  from public.shop_profiles
  where shop_slug = new.shop_slug
  limit 1;

  if v_shop_name is null or trim(v_shop_name) = '' then
    v_shop_name := coalesce(nullif(trim(new.shop_name), ''), 'A shop');
  end if;

  v_title := v_shop_name || ' 🔥';
  v_body := 'added a new Reel on ShoufHon';

  v_url :=
    'https://shoufhon.com/?reel=' ||
    replace(new.reel_id, ' ', '%20');

  select decrypted_secret
  into v_internal_key
  from vault.decrypted_secrets
  where name = 'shoufhon_internal_push_key'
  limit 1;

  if nullif(v_internal_key, '') is null then
    raise warning 'ShoufHon reel push skipped: internal push key is unavailable';
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
      'type', 'reel',
      'shop_slug', new.shop_slug,
      'content_id', new.reel_id,
      'target_followers_of_shop', new.shop_slug
    ),
    timeout_milliseconds := 5000
  )
  into v_request_id;

  return new;
end;
$function$;

drop trigger if exists ma7alak_push_new_reel_trigger
on public.shop_reels;

create trigger ma7alak_push_new_reel_trigger
after insert on public.shop_reels
for each row
execute function public.ma7alak_push_new_reel();

alter table public.shop_reels
  enable trigger ma7alak_push_new_reel_trigger;
