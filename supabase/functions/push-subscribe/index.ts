import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT =
  Deno.env.get("VAPID_SUBJECT") || "https://shoufhon.com";

const supabase = createClient(
  SUPABASE_URL,
  SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

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
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        ...corsHeaders(req),
        "Content-Type": "application/json"
      }
    }
  );
}

function validText(value: unknown, max: number) {
  const text = String(value || "").trim();
  return text && text.length <= max ? text : "";
}

function looksLikePushEndpoint(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.length > 3;
  } catch {
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(req) });
  }

  if (req.method !== "POST") {
    return json(req, { success: false, error: "Method not allowed" }, 405);
  }

  try {
    const body = await req.json();
    const action =
      String(body.action || "subscribe").trim().toLowerCase();

    const visitorId = validText(body.visitor_id, 180);
    const endpoint = validText(body.endpoint, 4096);

    if (!visitorId || !endpoint || !looksLikePushEndpoint(endpoint)) {
      return json(
        req,
        { success: false, error: "Invalid push subscription" },
        400
      );
    }

    if (action === "disable") {
      const { error } = await supabase
        .from("push_subscriptions")
        .update({
          enabled: false,
          updated_at: new Date().toISOString()
        })
        .eq("endpoint", endpoint)
        .eq("visitor_id", visitorId);

      if (error) throw error;

      return json(req, { success: true, enabled: false });
    }

    if (action !== "subscribe") {
      return json(
        req,
        { success: false, error: "Unsupported action" },
        400
      );
    }

    const p256dh = validText(body.p256dh, 1024);
    const auth = validText(body.auth, 1024);
    const userAgent = validText(body.user_agent, 1024);

    if (!p256dh || !auth) {
      return json(
        req,
        { success: false, error: "Missing subscription keys" },
        400
      );
    }

    const { data, error } = await supabase
      .from("push_subscriptions")
      .upsert(
        {
          visitor_id: visitorId,
          endpoint,
          p256dh,
          auth,
          user_agent: userAgent || null,
          enabled: true,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: "endpoint"
        }
      )
      .select("id,enabled")
      .single();

    if (error) throw error;

    let testSent = false;

    if (body.send_test === true) {
      try {
        await webpush.sendNotification(
          {
            endpoint,
            keys: { p256dh, auth }
          },
          JSON.stringify({
            title: "ShoufHon",
            body: "Notifications are on 🔔",
            url: "https://shoufhon.com/",
            icon: "https://shoufhon.com/pwa-icon-192.png",
            badge: "https://shoufhon.com/pwa-icon-192.png",
            type: "push-ready",
            tag: "shoufhon-push-ready"
          }),
          { TTL: 300 }
        );
        testSent = true;
      } catch (error) {
        console.error("WELCOME PUSH FAILED:", error);
      }
    }

    return json(req, {
      success: true,
      enabled: true,
      id: data?.id || null,
      test_sent: testSent
    });
  } catch (error: any) {
    console.error("PUSH SUBSCRIBE ERROR:", error);

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
