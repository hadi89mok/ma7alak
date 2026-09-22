import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT =
  Deno.env.get("VAPID_SUBJECT") || "https://shoufhon.com";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

webpush.setVapidDetails(
  VAPID_SUBJECT,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

const allowedOrigins = new Set([
  "https://shoufhon.com",
  "https://www.shoufhon.com"
]);

function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin":
      allowedOrigins.has(origin) ? origin : "https://shoufhon.com",
    "Vary": "Origin",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
}

function json(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(req),
      "Content-Type": "application/json"
    }
  });
}

async function trustedInternalCall(req: Request) {
  const internalKey =
    String(req.headers.get("x-shoufhon-internal-key") || "").trim();

  if (!internalKey) return false;

  const { data, error } = await supabase.rpc(
    "shoufhon_verify_internal_push_key",
    { p_secret: internalKey }
  );

  if (error) {
    console.error("PUSH INTERNAL AUTH ERROR:", error);
    return false;
  }

  return data === true;
}

async function siteAdminCall(req: Request) {
  const authHeader = req.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) return false;

  const token = authHeader.slice(7).trim();
  if (!token) return false;

  const { data: userResult, error: userError } =
    await supabase.auth.getUser(token);

  if (userError || !userResult?.user) return false;

  const { data: adminRow, error: adminError } = await supabase
    .from("site_admins")
    .select("user_id")
    .eq("user_id", userResult.user.id)
    .maybeSingle();

  if (adminError) {
    console.error("PUSH ADMIN AUTH ERROR:", adminError);
    return false;
  }

  return !!adminRow;
}

/* =========================================================
   SHOUFHON SEND PUSH
   - Trusted database triggers authenticate with a Vault-backed
     internal key.
   - Browser/user calls must belong to a current site admin.
   - Normal authenticated users cannot broadcast pushes.
========================================================= */

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(req) });
  }

  if (req.method !== "POST") {
    return json(req, { success: false, error: "Method not allowed." }, 405);
  }

  try {
    const isInternal = await trustedInternalCall(req);
    const isAdmin = isInternal ? false : await siteAdminCall(req);

    if (!isInternal && !isAdmin) {
      return json(
        req,
        { success: false, error: "Not authorized to send push notifications." },
        403
      );
    }

    const body = await req.json();

    const title = body.title || "ShoufHon";
    const message = body.body || "New update on ShoufHon";
    const targetUrl = body.url || "https://shoufhon.com/";
    const icon =
      body.icon ||
      "https://6aa2c9b0ea08b9137fd5ada9.imgix.net/sandbox/Gemini_Generated_Image_ds8wfsds8wfsds8w.jfif";
    const image = body.image || null;
    const type = body.type || "";
    const shopSlug = body.shop_slug || "";
    const contentId = body.content_id || "";

    const { data: subscriptions, error: subscriptionError } =
      await supabase
        .from("push_subscriptions")
        .select("id,endpoint,p256dh,auth,enabled")
        .eq("enabled", true);

    if (subscriptionError) throw subscriptionError;

    if (!subscriptions || subscriptions.length === 0) {
      return json(req, {
        success: true,
        message: "No enabled push subscribers",
        sent: 0,
        failed: 0,
        removed: 0
      });
    }

    const payload = JSON.stringify({
      title,
      body: message,
      url: targetUrl,
      icon,
      image,
      type,
      shop_slug: shopSlug,
      content_id: contentId,
      tag:
        (type || "ma7alak") +
        "-" +
        (shopSlug || "general") +
        "-" +
        (contentId || Date.now())
    });

    let sent = 0;
    let failed = 0;
    const expiredSubscriptionIds: number[] = [];

    const jobs = subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth
            }
          },
          payload,
          { TTL: 86400 }
        );

        sent++;
      } catch (error: any) {
        failed++;
        console.error("Push failed:", subscription.id, error);

        if (
          error &&
          (error.statusCode === 404 || error.statusCode === 410)
        ) {
          expiredSubscriptionIds.push(subscription.id);
        }
      }
    });

    await Promise.allSettled(jobs);

    if (expiredSubscriptionIds.length > 0) {
      const { error: deleteError } = await supabase
        .from("push_subscriptions")
        .delete()
        .in("id", expiredSubscriptionIds);

      if (deleteError) {
        console.error(
          "Could not remove dead subscriptions:",
          deleteError
        );
      }
    }

    return json(req, {
      success: true,
      subscribers: subscriptions.length,
      sent,
      failed,
      removed: expiredSubscriptionIds.length
    });
  } catch (error: any) {
    console.error("SHOUFHON PUSH ERROR:", error);

    return json(
      req,
      {
        success: false,
        error: error?.message || String(error)
      },
      500
    );
  }
});
