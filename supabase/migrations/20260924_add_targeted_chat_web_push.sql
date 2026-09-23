alter table public.push_subscriptions
  add column if not exists user_id uuid null references auth.users(id) on delete set null;

create index if not exists push_subscriptions_user_id_enabled_idx
  on public.push_subscriptions(user_id, enabled)
  where user_id is not null;

create or replace function public.ma7alak_push_new_message()
returns trigger
language plpgsql
security definer
set search_path = 'public'
as $function$
declare
  v_conversation public.ma7alak_conversations%rowtype;
  v_owner_user_id uuid;
  v_recipient_user_id uuid;
  v_sender_label text;
  v_message_body text;
  v_internal_key text;
  v_request_id bigint;
begin
  select *
  into v_conversation
  from public.ma7alak_conversations
  where id = new.conversation_id
  limit 1;

  if not found then
    return new;
  end if;

  select so.user_id
  into v_owner_user_id
  from public.shop_owners so
  where so.shop_slug = v_conversation.shop_slug
  limit 1;

  if v_owner_user_id is null then
    return new;
  end if;

  if new.sender_id = v_conversation.viewer_id then
    v_recipient_user_id := v_owner_user_id;

    select coalesce(
      nullif(trim(vp.display_name), ''),
      nullif(trim(vp.username), ''),
      'ShoufHon user'
    )
    into v_sender_label
    from public.viewer_profiles vp
    where vp.user_id = new.sender_id
    limit 1;

  elsif new.sender_id = v_owner_user_id then
    v_recipient_user_id := v_conversation.viewer_id;

    select coalesce(
      nullif(trim(sp.shop_name), ''),
      'ShoufHon shop'
    )
    into v_sender_label
    from public.shop_profiles sp
    where sp.shop_slug = v_conversation.shop_slug
    limit 1;

  else
    return new;
  end if;

  v_sender_label := coalesce(
    nullif(trim(v_sender_label), ''),
    'ShoufHon'
  );

  v_message_body :=
    case
      when new.message_type = 'story_reply'
        then 'Story reply: ' || left(coalesce(new.body, ''), 110)
      else left(coalesce(new.body, ''), 140)
    end;

  if nullif(trim(v_message_body), '') is null then
    v_message_body := 'Sent you a message';
  end if;

  select decrypted_secret
  into v_internal_key
  from vault.decrypted_secrets
  where name = 'shoufhon_internal_push_key'
  limit 1;

  if nullif(v_internal_key, '') is null then
    raise warning 'ShoufHon message push skipped: internal push key is unavailable';
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
      'title', v_sender_label,
      'body', v_message_body,
      'url', 'https://shoufhon.com/?chat=' || new.conversation_id::text,
      'type', 'message',
      'shop_slug', v_conversation.shop_slug,
      'content_id', new.id::text,
      'target_user_id', v_recipient_user_id::text
    ),
    timeout_milliseconds := 5000
  )
  into v_request_id;

  return new;
end;
$function$;

drop trigger if exists ma7alak_push_new_message_trigger
on public.ma7alak_messages;

create trigger ma7alak_push_new_message_trigger
after insert on public.ma7alak_messages
for each row
execute function public.ma7alak_push_new_message();

alter table public.ma7alak_messages
  enable trigger ma7alak_push_new_message_trigger;
