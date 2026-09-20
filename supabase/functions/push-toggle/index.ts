import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL =
  Deno.env.get("SUPABASE_URL")!;

const SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase =
  createClient(
    SUPABASE_URL,
    SERVICE_ROLE_KEY
  );


Deno.serve(async (req) => {

  /* =========================================================
     CORS
  ========================================================= */

  const allowedOrigins = new Set([
    "https://shoufhon.com",
    "https://www.shoufhon.com"
  ]);

  const requestOrigin = req.headers.get("origin") || "";
  const allowOrigin = allowedOrigins.has(requestOrigin)
    ? requestOrigin
    : "https://shoufhon.com";

  const corsHeaders = {
    "Access-Control-Allow-Origin": allowOrigin,
    "Vary": "Origin",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",

    "Access-Control-Allow-Methods":
      "POST, OPTIONS"
  };


  if (req.method === "OPTIONS") {

    return new Response(
      "ok",
      {
        headers:
          corsHeaders
      }
    );

  }


  if (req.method !== "POST") {

    return new Response(
      JSON.stringify({
        success: false,
        error: "Method not allowed"
      }),
      {
        status: 405,

        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json"
        }
      }
    );

  }


  try {

    const body =
      await req.json();


    const visitorId =
      String(
        body.visitor_id || ""
      ).trim();


    const enabled =
      body.enabled;


    /* =========================================================
       VALIDATE
    ========================================================= */

    if (!visitorId) {

      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing visitor_id"
        }),
        {
          status: 400,

          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json"
          }
        }
      );

    }


    if (
      typeof enabled !==
      "boolean"
    ) {

      return new Response(
        JSON.stringify({
          success: false,
          error: "enabled must be true or false"
        }),
        {
          status: 400,

          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json"
          }
        }
      );

    }


    /* =========================================================
       UPDATE THIS DEVICE
    ========================================================= */

    const {
      data,
      error
    } =
      await supabase
        .from(
          "push_subscriptions"
        )
        .update({
          enabled:
            enabled,

          updated_at:
            new Date()
              .toISOString()
        })
        .eq(
          "visitor_id",
          visitorId
        )
        .select(
          "id,enabled"
        );


    if (error) {
      throw error;
    }


    if (
      !data ||
      data.length === 0
    ) {

      return new Response(
        JSON.stringify({
          success: false,
          error:
            "Push subscription not found"
        }),
        {
          status: 404,

          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json"
          }
        }
      );

    }


    /* =========================================================
       SUCCESS
    ========================================================= */

    return new Response(
      JSON.stringify({
        success: true,
        enabled:
          enabled,
        updated:
          data.length
      }),
      {
        status: 200,

        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json"
        }
      }
    );

  }

  catch (error: any) {

    console.error(
      "PUSH TOGGLE ERROR:",
      error
    );


    return new Response(
      JSON.stringify({
        success: false,

        error:
          error?.message ||
          String(error)
      }),
      {
        status: 500,

        headers: {
          ...corsHeaders,
          "Content-Type":
            "application/json"
        }
      }
    );

  }

});