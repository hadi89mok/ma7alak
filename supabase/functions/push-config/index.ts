const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY") || "";

const allowedOrigins = new Set([
  "https://shoufhon.com",
  "https://www.shoufhon.com"
]);

function headers(req: Request) {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin":
      allowedOrigins.has(origin) ? origin : "https://shoufhon.com",
    "Vary": "Origin",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=3600"
  };
}

Deno.serve((req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: headers(req) });
  }

  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: headers(req) }
    );
  }

  if (!VAPID_PUBLIC_KEY) {
    return new Response(
      JSON.stringify({ success: false, error: "Push is not configured" }),
      { status: 503, headers: headers(req) }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      vapid_public_key: VAPID_PUBLIC_KEY
    }),
    { status: 200, headers: headers(req) }
  );
});
