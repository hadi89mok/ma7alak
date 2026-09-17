import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ success:false, error:"Method not allowed." }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const authHeader = req.headers.get("Authorization") || "";
    if (!supabaseUrl || !serviceKey) throw new Error("Server configuration is missing.");
    if (!authHeader.startsWith("Bearer ")) throw new Error("Missing admin session.");

    const service = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken:false, persistSession:false }
    });
    const token = authHeader.slice(7).trim();
    const { data:callerResult, error:callerError } = await service.auth.getUser(token);
    const caller = callerResult?.user;
    if (callerError || !caller) throw new Error("Invalid admin session.");

    const { data:adminRow, error:adminError } = await service
      .from("site_admins")
      .select("user_id")
      .eq("user_id", caller.id)
      .maybeSingle();
    if (adminError || !adminRow) throw new Error("Admin permission is required.");

    const body = await req.json().catch(() => ({}));
    const userId = String(body.user_id || "").trim();
    if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(userId)) throw new Error("A valid user ID is required.");
    if (userId === caller.id) throw new Error("You cannot delete your own active admin account.");

    const { data:targetAdmin, error:targetAdminError } = await service
      .from("site_admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (targetAdminError) throw new Error("Could not verify the target account.");
    if (targetAdmin) throw new Error("Remove site-admin access before deleting another admin.");

    /* shop_live_posts.created_by intentionally keeps a restrictive FK.
       Remove this user's authored Live/Offer posts first; their media rows
       and the rest of their account data then clean up through FK cascades. */
    const { error:postsError } = await service
      .from("shop_live_posts")
      .delete()
      .eq("created_by", userId);
    if (postsError) throw new Error("Could not remove the user's Live / Offer posts.");

    const { error:deleteError } = await service.auth.admin.deleteUser(userId, false);
    if (deleteError) throw deleteError;

    return json({ success:true, deleted_user_id:userId });
  } catch (error) {
    console.error("delete-ma7alak-user:", error);
    return json({
      success:false,
      error:error instanceof Error ? error.message : "Could not delete user."
    }, 400);
  }
});
