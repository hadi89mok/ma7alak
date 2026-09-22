do $$
begin
  if not exists (
    select 1
    from vault.secrets
    where name = 'shoufhon_internal_push_key'
  ) then
    perform vault.create_secret(
      encode(extensions.gen_random_bytes(32), 'hex'),
      'shoufhon_internal_push_key',
      'Internal authentication key for trusted database-to-send-push calls'
    );
  end if;
end
$$;

create or replace function public.shoufhon_verify_internal_push_key(p_secret text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    p_secret is not null
    and exists (
      select 1
      from vault.decrypted_secrets s
      where s.name = 'shoufhon_internal_push_key'
        and s.decrypted_secret = p_secret
    );
$$;

revoke all on function public.shoufhon_verify_internal_push_key(text)
from public, anon, authenticated;

grant execute on function public.shoufhon_verify_internal_push_key(text)
to service_role;

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
    raise warning 'ShoufHon push skipped: internal push key is unavailable';
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
      'icon', new.shop_icon,
      'type', 'reel',
      'shop_slug', new.shop_slug,
      'content_id', new.reel_id
    ),
    timeout_milliseconds := 5000
  )
  into v_request_id;

  return new;
end;
$function$;

create or replace function public.ma7alak_push_new_story()
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
  select shop_name
  into v_shop_name
  from public.shop_profiles
  where shop_slug = new.shop_slug
  limit 1;

  if v_shop_name is null or trim(v_shop_name) = '' then
    v_shop_name :=
      replace(
        initcap(
          replace(new.shop_slug, '-', ' ')
        ),
        '  ',
        ' '
      );
  end if;

  v_title := v_shop_name || ' 🔥';
  v_body := 'added a new Story on ShoufHon';

  v_url :=
    'https://shoufhon.com/shwf-almhlat-?story='
    || new.id::text
    || '&shop='
    || new.shop_slug;

  select decrypted_secret
  into v_internal_key
  from vault.decrypted_secrets
  where name = 'shoufhon_internal_push_key'
  limit 1;

  if nullif(v_internal_key, '') is null then
    raise warning 'ShoufHon push skipped: internal push key is unavailable';
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
      'type', 'story',
      'shop_slug', new.shop_slug,
      'content_id', new.id::text
    ),
    timeout_milliseconds := 5000
  )
  into v_request_id;

  return new;
end;
$function$;
