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

  const normalizeSlug = (value: unknown) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/^\/+|\/+$/g, "");

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Supabase server configuration is missing.");
    }

    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return json({ success: false, error: "Missing admin session." }, 401);
    }

    const accessToken = authHeader.slice(7).trim();
    if (!accessToken) {
      return json({ success: false, error: "Missing admin session." }, 401);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data: authData, error: authError } =
      await admin.auth.getUser(accessToken);

    if (authError || !authData?.user) {
      return json({ success: false, error: "Invalid admin session." }, 401);
    }

    const adminUser = authData.user;

    const { data: adminRow, error: adminCheckError } = await admin
      .from("site_admins")
      .select("user_id")
      .eq("user_id", adminUser.id)
      .maybeSingle();

    if (adminCheckError || !adminRow) {
      return json({ success: false, error: "Admin access required." }, 403);
    }

    const body = await req.json().catch(() => ({}));
    const shopSlug = normalizeSlug(body.shop_slug);
    const confirmSlug = normalizeSlug(body.confirm_slug);
    const dryRun = body.dry_run === true;

    if (!shopSlug || !/^[a-z0-9][a-z0-9-]*$/.test(shopSlug)) {
      return json({ success: false, error: "A valid shop slug is required." }, 400);
    }

    if (!dryRun && confirmSlug !== shopSlug) {
      return json({
        success: false,
        error: "Deletion confirmation did not match the shop slug."
      }, 400);
    }

    const { data: shop, error: shopError } = await admin
      .from("shop_profiles")
      .select("shop_slug,shop_name,profile_image_url,story_logo_url,intro_media_url,intro_poster_url,main_image_url,menu_image_url,directory_options")
      .eq("shop_slug", shopSlug)
      .maybeSingle();

    if (shopError) throw shopError;
    if (!shop) {
      return json({ success: false, error: "Shop not found." }, 404);
    }

    const bucketNames = [
      "shop-stories",
      "shop-gallery",
      "shop-videos",
      "shop-page-media",
      "live-offers"
    ];

    const paths = new Map<string, Set<string>>();
    for (const bucket of bucketNames) paths.set(bucket, new Set());

    function addPath(bucket: string, path: unknown) {
      const clean = String(path || "").trim().replace(/^\/+/, "");
      if (!clean || !paths.has(bucket)) return;
      paths.get(bucket)!.add(clean);
    }

    function pathFromUrl(value: unknown) {
      const text = String(value || "").trim();
      if (!text) return null;

      for (const bucket of bucketNames) {
        const markers = [
          "/storage/v1/object/public/" + bucket + "/",
          "/storage/v1/object/sign/" + bucket + "/"
        ];

        for (const marker of markers) {
          const index = text.indexOf(marker);
          if (index >= 0) {
            let path = text.slice(index + marker.length).split("?")[0];
            try { path = decodeURIComponent(path); } catch (_) {}
            return { bucket, path };
          }
        }
      }

      return null;
    }

    function collectUrls(value: unknown) {
      if (typeof value === "string") {
        const parsed = pathFromUrl(value);
        if (parsed) addPath(parsed.bucket, parsed.path);
        return;
      }

      if (Array.isArray(value)) {
        for (const item of value) collectUrls(item);
        return;
      }

      if (value && typeof value === "object") {
        for (const item of Object.values(value as Record<string, unknown>)) {
          collectUrls(item);
        }
      }
    }

    collectUrls(shop);

    const [
      storyRows,
      galleryRows,
      videoRows,
      mediaRows,
      reelRows,
      livePostRows,
      liveMediaRows,
      pageDesignRows,
      ownerRows
    ] = await Promise.all([
      admin.from("shop_stories").select("storage_path").eq("shop_slug", shopSlug),
      admin.from("shop_gallery").select("storage_path,image_url").eq("shop_slug", shopSlug),
      admin.from("shop_videos").select("storage_path,video_url").eq("shop_slug", shopSlug),
      admin.from("shop_media").select("media_url,poster_url").eq("shop_slug", shopSlug),
      admin.from("shop_reels").select("reel_id,video_url,shop_icon").eq("shop_slug", shopSlug),
      admin.from("shop_live_posts").select("id,media_url").eq("shop_slug", shopSlug),
      admin.from("shop_live_post_media").select("storage_path,media_url").eq("shop_slug", shopSlug),
      admin.from("shop_page_design").select("config").eq("shop_slug", shopSlug),
      admin.from("shop_owners").select("user_id").eq("shop_slug", shopSlug)
    ]);

    const queryErrors = [
      storyRows.error, galleryRows.error, videoRows.error, mediaRows.error,
      reelRows.error, livePostRows.error, liveMediaRows.error,
      pageDesignRows.error, ownerRows.error
    ].filter(Boolean);

    if (queryErrors.length) {
      throw queryErrors[0];
    }

    for (const row of storyRows.data || []) addPath("shop-stories", row.storage_path);
    for (const row of galleryRows.data || []) {
      addPath("shop-gallery", row.storage_path);
      collectUrls(row);
    }
    for (const row of videoRows.data || []) {
      addPath("shop-videos", row.storage_path);
      collectUrls(row);
    }

    collectUrls(mediaRows.data || []);
    collectUrls(reelRows.data || []);
    collectUrls(livePostRows.data || []);

    for (const row of liveMediaRows.data || []) {
      addPath("live-offers", row.storage_path);
      collectUrls(row);
    }

    collectUrls(pageDesignRows.data || []);

    async function listPrefix(bucket: string, prefix: string) {
      const found = new Set<string>();

      async function walk(folder: string) {
        let offset = 0;

        while (true) {
          const { data, error } = await admin.storage
            .from(bucket)
            .list(folder, {
              limit: 1000,
              offset,
              sortBy: { column: "name", order: "asc" }
            });

          if (error) throw error;

          const rows = data || [];
          for (const item of rows) {
            const full = folder ? folder + "/" + item.name : item.name;

            // Supabase folder placeholders have no object id/metadata.
            if (!item.id && !item.metadata) {
              await walk(full);
            } else {
              found.add(full);
            }
          }

          if (rows.length < 1000) break;
          offset += rows.length;
        }
      }

      await walk(prefix.replace(/^\/+|\/+$/g, ""));
      return found;
    }

    const prefixPlan: Record<string, string[]> = {
      "shop-stories": [shopSlug],
      "shop-gallery": [
        shopSlug,
        "profiles/" + shopSlug,
        "profile-banners/" + shopSlug,
        "profile-shell-backgrounds/" + shopSlug,
        "owner-profile/" + shopSlug,
        "owner-banner/" + shopSlug,
        "owner-gallery/" + shopSlug,
        "directory/" + shopSlug
      ],
      "shop-videos": [
        shopSlug,
        "reels/" + shopSlug,
        "owner-media/" + shopSlug
      ],
      "shop-page-media": [shopSlug],
      "live-offers": [shopSlug]
    };

    for (const [bucket, prefixes] of Object.entries(prefixPlan)) {
      for (const prefix of prefixes) {
        const listed = await listPrefix(bucket, prefix);
        for (const path of listed) addPath(bucket, path);
      }
    }

    const storageSummary = Object.fromEntries(
      [...paths.entries()].map(([bucket, set]) => [bucket, set.size])
    );

    const databaseSummary: Record<string, number> = {};
    const countTargets: Array<[string, string]> = [
      ["shop_stories", "shop_slug"],
      ["shop_gallery", "shop_slug"],
      ["shop_videos", "shop_slug"],
      ["shop_media", "shop_slug"],
      ["shop_reels", "shop_slug"],
      ["shop_live_posts", "shop_slug"],
      ["shop_follows", "shop_slug"],
      ["shop_likes", "shop_slug"],
      ["ma7alak_conversations", "shop_slug"],
      ["ma7alak_owner_notifications", "shop_slug"],
      ["shop_owners", "shop_slug"]
    ];

    for (const [table, column] of countTargets) {
      const result = await admin
        .from(table)
        .select("*", { count: "exact", head: true })
        .eq(column, shopSlug);

      if (result.error) throw result.error;
      databaseSummary[table] = result.count || 0;
    }

    if (dryRun) {
      return json({
        success: true,
        dry_run: true,
        shop_slug: shopSlug,
        shop_name: shop.shop_name,
        owner_links: ownerRows.data?.length || 0,
        storage_objects: storageSummary,
        database_rows: databaseSummary
      });
    }

    // Delete Storage through the Storage API, never by SQL.
    for (const [bucket, set] of paths.entries()) {
      const all = [...set];

      for (let index = 0; index < all.length; index += 500) {
        const batch = all.slice(index, index + 500);
        if (!batch.length) continue;

        const { error } = await admin.storage
          .from(bucket)
          .remove(batch);

        if (error) {
          throw new Error(
            "Storage cleanup failed in " + bucket + ": " + error.message
          );
        }
      }
    }

    const { data: purged, error: purgeError } = await admin
      .rpc("ma7alak_admin_purge_shop_rows", {
        p_shop_slug: shopSlug
      });

    if (purgeError) throw purgeError;

    if (purged !== true) {
      throw new Error("Shop database purge did not complete.");
    }

    return json({
      success: true,
      deleted: true,
      shop_slug: shopSlug,
      shop_name: shop.shop_name,
      owner_account_deleted: false,
      owner_access_removed: true,
      storage_objects_deleted: storageSummary,
      database_rows_deleted: databaseSummary
    });
  } catch (error) {
    console.error("SHOUFHON SHOP PURGE:", error);
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Shop purge failed."
      },
      400
    );
  }
});
