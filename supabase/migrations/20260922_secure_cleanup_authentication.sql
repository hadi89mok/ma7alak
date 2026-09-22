do $$
begin
  if not exists (
    select 1
    from vault.secrets
    where name = 'shoufhon_cleanup_key'
  ) then
    perform vault.create_secret(
      encode(extensions.gen_random_bytes(32), 'hex'),
      'shoufhon_cleanup_key',
      'Internal authentication key for ShoufHon cleanup jobs'
    );
  end if;
end
$$;

create or replace function public.shoufhon_verify_cleanup_key(p_secret text)
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
      where s.name = 'shoufhon_cleanup_key'
        and s.decrypted_secret = p_secret
    );
$$;

revoke all on function public.shoufhon_verify_cleanup_key(text)
from public, anon, authenticated;

grant execute on function public.shoufhon_verify_cleanup_key(text)
to service_role;

select cron.alter_job(
  2,
  command := $job$
    select net.http_post(
      url := 'https://wdtaiuwtqdepzdamgsrs.supabase.co/functions/v1/ma7alak-ephemeral-cleanup',
      headers := jsonb_build_object(
        'Content-Type','application/json',
        'x-ma7alak-cleanup-key',
        (
          select decrypted_secret
          from vault.decrypted_secrets
          where name='shoufhon_cleanup_key'
          limit 1
        )
      ),
      body := jsonb_build_object('source','cron'),
      timeout_milliseconds := 120000
    );
  $job$
);
