-- Restrict ShoufHon plan-management RPCs to signed-in admins.
-- Functions also verify public.is_site_admin() internally.

revoke execute on function public.ma7alak_admin_apply_plan_to_shop(text,text) from anon;
revoke execute on function public.ma7alak_admin_apply_plan_to_assigned(text) from anon;
revoke execute on function public.ma7alak_admin_clear_shop_plan(text) from anon;

revoke execute on function public.ma7alak_admin_apply_plan_to_shop(text,text) from public;
revoke execute on function public.ma7alak_admin_apply_plan_to_assigned(text) from public;
revoke execute on function public.ma7alak_admin_clear_shop_plan(text) from public;

grant execute on function public.ma7alak_admin_apply_plan_to_shop(text,text) to authenticated;
grant execute on function public.ma7alak_admin_apply_plan_to_assigned(text) to authenticated;
grant execute on function public.ma7alak_admin_clear_shop_plan(text) to authenticated;
