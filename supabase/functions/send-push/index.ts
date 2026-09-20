import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL =
  Deno.env.get("SUPABASE_URL")!;

const SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const VAPID_PUBLIC_KEY =
  Deno.env.get("VAPID_PUBLIC_KEY")!;

const VAPID_PRIVATE_KEY =
  Deno.env.get("VAPID_PRIVATE_KEY")!;

const VAPID_SUBJECT =
  Deno.env.get("VAPID_SUBJECT") ||
  "https://shoufhon.com";


const supabase =
  createClient(
    SUPABASE_URL,
    SERVICE_ROLE_KEY
  );


webpush.setVapidDetails(
  VAPID_SUBJECT,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);


/* =========================================================
   SHOUFHON SEND PUSH
========================================================= */

Deno.serve(async (req) => {

  if (req.method === "OPTIONS") {

    return new Response(
      "ok",
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "authorization, x-client-info, apikey, content-type"
        }
      }
    );

  }


  try {

    const body =
      await req.json();


    const title =
      body.title ||
      "ShoufHon";


    const message =
      body.body ||
      "New update on ShoufHon";


    const targetUrl =
      body.url ||
      "https://shoufhon.com/";


    const icon =
      body.icon ||
      "https://6aa2c9b0ea08b9137fd5ada9.imgix.net/sandbox/Gemini_Generated_Image_ds8wfsds8wfsds8w.jfif";


    const image =
      body.image ||
      null;


    const type =
      body.type ||
      "";


    const shopSlug =
      body.shop_slug ||
      "";


    const contentId =
      body.content_id ||
      "";


    /* =====================================================
       GET ONLY ENABLED SUBSCRIPTIONS
    ===================================================== */

    const {
      data: subscriptions,
      error: subscriptionError
    } =
      await supabase
        .from(
          "push_subscriptions"
        )
        .select(
          "id,endpoint,p256dh,auth,enabled"
        )
        .eq(
          "enabled",
          true
        );


    if (subscriptionError) {
      throw subscriptionError;
    }


    if (
      !subscriptions ||
      subscriptions.length === 0
    ) {

      return new Response(
        JSON.stringify({
          success: true,
          message: "No enabled push subscribers",
          sent: 0,
          failed: 0,
          removed: 0
        }),
        {
          status: 200,
          headers: {
            "Content-Type":
              "application/json",

            "Access-Control-Allow-Origin":
              "*"
          }
        }
      );

    }


    /* =====================================================
       PAYLOAD SENT TO sw.js
    ===================================================== */

    const payload =
      JSON.stringify({

        title: title,

        body: message,

        url: targetUrl,

        icon: icon,

        image: image,

        type: type,

        shop_slug: shopSlug,

        content_id: contentId,

        tag:
          (
            type ||
            "ma7alak"
          ) +
          "-" +
          (
            shopSlug ||
            "general"
          ) +
          "-" +
          (
            contentId ||
            Date.now()
          )

      });


    let sent = 0;
    let failed = 0;


    const expiredSubscriptionIds: number[] =
      [];


    /* =====================================================
       SEND TO EVERY ENABLED PHONE / BROWSER
    ===================================================== */

    const jobs =
      subscriptions.map(
        async function (subscription) {

          try {

            await webpush.sendNotification(

              {
                endpoint:
                  subscription.endpoint,

                keys: {
                  p256dh:
                    subscription.p256dh,

                  auth:
                    subscription.auth
                }
              },

              payload,

              {
                TTL: 86400
              }

            );


            sent++;

          }

          catch (error: any) {

            failed++;


            console.error(
              "Push failed:",
              subscription.id,
              error
            );


            /*
              404 / 410 means the browser
              subscription no longer exists.
            */

            if (
              error &&
              (
                error.statusCode === 404 ||
                error.statusCode === 410
              )
            ) {

              expiredSubscriptionIds.push(
                subscription.id
              );

            }

          }

        }
      );


    await Promise.allSettled(
      jobs
    );


    /* =====================================================
       REMOVE DEAD SUBSCRIPTIONS
    ===================================================== */

    if (
      expiredSubscriptionIds.length > 0
    ) {

      const {
        error: deleteError
      } =
        await supabase
          .from(
            "push_subscriptions"
          )
          .delete()
          .in(
            "id",
            expiredSubscriptionIds
          );


      if (deleteError) {

        console.error(
          "Could not remove dead subscriptions:",
          deleteError
        );

      }

    }


    /* =====================================================
       RESPONSE
    ===================================================== */

    return new Response(
      JSON.stringify({
        success: true,

        subscribers:
          subscriptions.length,

        sent: sent,

        failed: failed,

        removed:
          expiredSubscriptionIds.length
      }),
      {
        status: 200,

        headers: {
          "Content-Type":
            "application/json",

          "Access-Control-Allow-Origin":
            "*"
        }
      }
    );

  }

  catch (error: any) {

    console.error(
      "SHOUFHON PUSH ERROR:",
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
          "Content-Type":
            "application/json",

          "Access-Control-Allow-Origin":
            "*"
        }
      }
    );

  }

});