import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Supabase server configuration is missing.");
    }

    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      throw new Error("Missing admin session.");
    }

    const accessToken = authHeader.replace("Bearer ", "").trim();
    if (!accessToken) {
      throw new Error("Missing admin access token.");
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data: userResult, error: userError } =
      await adminClient.auth.getUser(accessToken);

    if (userError || !userResult?.user) {
      console.error("ADMIN TOKEN ERROR:", userError);
      throw new Error("Invalid admin session.");
    }

    const adminUserId = userResult.user.id;

    const { data: adminRow, error: adminCheckError } = await adminClient
      .from("site_admins")
      .select("user_id")
      .eq("user_id", adminUserId)
      .maybeSingle();

    if (adminCheckError) {
      console.error("ADMIN CHECK ERROR:", adminCheckError);
      throw new Error("Could not verify admin permissions.");
    }
    if (!adminRow) {
      throw new Error("You are not authorized to manage shop owners.");
    }

    const body = await req.json();
    const action = String(body.action || "create").trim();
    const shopSlug = String(body.shop_slug || "").trim();

    async function getAuthUserByEmail(email: string) {
      const target = email.trim().toLowerCase();
      for (let page = 1; page <= 50; page++) {
        const { data, error } = await adminClient.auth.admin.listUsers({
          page,
          perPage: 100
        });
        if (error) throw error;
        const users = data?.users || [];
        const found = users.find((u: any) =>
          String(u?.email || "").trim().toLowerCase() === target
        );
        if (found) return found;
        if (users.length < 100) break;
      }
      return null;
    }

    function hasGoogleIdentity(user: any) {
      const identities = Array.isArray(user?.identities) ? user.identities : [];
      if (identities.some((i: any) => String(i?.provider || "").toLowerCase() === "google")) {
        return true;
      }
      const provider = String(user?.app_metadata?.provider || "").toLowerCase();
      const providers = Array.isArray(user?.app_metadata?.providers)
        ? user.app_metadata.providers.map((p: any) => String(p).toLowerCase())
        : [];
      return provider === "google" || providers.includes("google");
    }

    if (action === "list_status") {
      const { data: ownerLinks, error: ownerLinksError } = await adminClient
        .from("shop_owners")
        .select("user_id,shop_slug");

      if (ownerLinksError) {
        console.error("OWNER LIST ERROR:", ownerLinksError);
        throw new Error("Could not load owner status list.");
      }

      const owners = [];
      for (const link of ownerLinks || []) {
        let email = "";
        let google = false;
        const { data: authUser, error: authUserError } =
          await adminClient.auth.admin.getUserById(link.user_id);
        if (!authUserError && authUser?.user) {
          email = authUser.user.email || "";
          google = hasGoogleIdentity(authUser.user);
        }
        owners.push({
          shop_slug: link.shop_slug,
          owner_exists: true,
          user_id: link.user_id,
          email,
          google
        });
      }

      return json({ success: true, action: "list_status", owners });
    }

    if (!shopSlug) throw new Error("Shop slug is required.");

    const { data: shop, error: shopError } = await adminClient
      .from("shop_profiles")
      .select("shop_slug,shop_name")
      .eq("shop_slug", shopSlug)
      .maybeSingle();

    if (shopError) {
      console.error("SHOP CHECK ERROR:", shopError);
      throw new Error("Could not check shop.");
    }
    if (!shop) throw new Error("That shop does not exist.");

    async function getOwnerLink() {
      const { data, error } = await adminClient
        .from("shop_owners")
        .select("user_id,shop_slug")
        .eq("shop_slug", shopSlug)
        .limit(1);

      if (error) {
        console.error("OWNER CHECK ERROR:", error);
        throw new Error("Could not check shop owner.");
      }
      return data && data.length > 0 ? data[0] : null;
    }

    async function getOwnerDetails() {
      const ownerLink = await getOwnerLink();
      if (!ownerLink) {
        return { owner_exists: false, user_id: null, email: null, google: false };
      }

      const { data: authUser, error: authUserError } =
        await adminClient.auth.admin.getUserById(ownerLink.user_id);

      if (authUserError) {
        console.error("OWNER AUTH LOOKUP ERROR:", authUserError);
        throw new Error("Owner link exists, but the Auth account could not be read.");
      }

      return {
        owner_exists: true,
        user_id: ownerLink.user_id,
        email: authUser?.user?.email || "",
        google: hasGoogleIdentity(authUser?.user)
      };
    }

    if (action === "status") {
      const owner = await getOwnerDetails();
      return json({
        success: true,
        action: "status",
        shop_slug: shop.shop_slug,
        shop_name: shop.shop_name,
        ...owner
      });
    }

    // Google-only owner assignment. The user must sign in to ShoufHon with Google first.
    if (action === "create" || action === "assign") {
      const email = String(body.email || "").trim().toLowerCase();
      if (!email) throw new Error("Owner Google email is required.");

      const existingOwner = await getOwnerLink();
      if (existingOwner) {
        throw new Error("This shop already has an owner assigned.");
      }

      const authUser = await getAuthUserByEmail(email);
      if (!authUser) {
        throw new Error("No ShoufHon user found with that email. Ask them to sign in with Google once first.");
      }
      if (!hasGoogleIdentity(authUser)) {
        throw new Error("That account is not a Google account. Ask them to sign in with Google first.");
      }

      const { data: alreadyLinked, error: linkedError } = await adminClient
        .from("shop_owners")
        .select("shop_slug")
        .eq("user_id", authUser.id)
        .maybeSingle();

      if (linkedError) {
        console.error("OWNER USER CHECK ERROR:", linkedError);
        throw new Error("Could not check whether this Google user already owns a shop.");
      }
      if (alreadyLinked?.shop_slug) {
        throw new Error("That Google account is already assigned to /" + alreadyLinked.shop_slug + ".");
      }

      const { error: ownerInsertError } = await adminClient
        .from("shop_owners")
        .insert({ user_id: authUser.id, shop_slug: shopSlug });

      if (ownerInsertError) {
        console.error("OWNER LINK ERROR:", ownerInsertError);
        throw new Error(ownerInsertError.message || "Could not assign this Google user to the shop.");
      }

      return json({
        success: true,
        action: "assign",
        user_id: authUser.id,
        email: authUser.email || email,
        google: true,
        shop_slug: shop.shop_slug,
        shop_name: shop.shop_name
      });
    }

    // Password management is intentionally retired. ShoufHon owner auth is Google-only.
    if (action === "reset_password") {
      throw new Error("Password owner accounts are retired. ShoufHon owner access uses Google sign-in only.");
    }

    // Remove owner access only. Never delete the user's Google/ShoufHon account.
    if (action === "delete_owner" || action === "remove_owner") {
      const owner = await getOwnerDetails();
      if (!owner.owner_exists || !owner.user_id) {
        throw new Error("This shop does not have an owner assigned.");
      }

      const { error: deleteLinkError } = await adminClient
        .from("shop_owners")
        .delete()
        .eq("user_id", owner.user_id)
        .eq("shop_slug", shopSlug);

      if (deleteLinkError) {
        console.error("OWNER LINK DELETE ERROR:", deleteLinkError);
        throw new Error(deleteLinkError.message || "Could not remove owner access.");
      }

      return json({
        success: true,
        action: "remove_owner",
        removed_email: owner.email || "",
        shop_slug: shop.shop_slug,
        shop_name: shop.shop_name
      });
    }

    throw new Error("Unknown owner-management action.");
  } catch (error) {
    console.error("SHOUFHON OWNER MANAGEMENT:", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      400
    );
  }
});
