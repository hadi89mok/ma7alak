/* =========================================================
   SHOUFHON SHOP VISIBILITY GUARD V1
   ---------------------------------------------------------
   One global guard for manual Hostinger shop pages.

   - Active shop: page opens normally.
   - Hidden shop (shop_profiles.is_active = false):
       normal visitor -> page is covered, loading is stopped,
       then redirected to /shwf-almhlat-
       site admin -> page remains available for preview/editing.
   - Non-shop routes fail open and are left untouched.
   - No destructive action: hiding never deletes the shop or media.
========================================================= */
(function(){
"use strict";

if(window.__SHOUFHON_SHOP_VISIBILITY_GUARD_V1__)return;
window.__SHOUFHON_SHOP_VISIBILITY_GUARD_V1__=true;

const SUPABASE_URL="https://wdtaiuwtqdepzdamgsrs.supabase.co";
const SUPABASE_KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
const REDIRECT_PATH="/shwf-almhlat-";

const RESERVED_PATHS=new Set([
  "",
  "admin",
  "shwf-almhlat-",
  "add-shop-",
  "add-shop"
]);

function normalizeSlug(value){
  let raw=String(value||"").trim();
  try{raw=decodeURIComponent(raw)}catch(_){}
  return raw
    .replace(/^\/+|\/+$/g,"")
    .trim()
    .toLowerCase();
}

const pathSlug=normalizeSlug(location.pathname);

if(
  !pathSlug ||
  pathSlug.includes("/") ||
  RESERVED_PATHS.has(pathSlug) ||
  /\.[a-z0-9]{1,8}$/i.test(pathSlug)
){
  return;
}

let curtainTimer=null;
let curtainStyle=null;
let curtainNode=null;
let resolved=false;

function installCurtain(){
  if(resolved||curtainStyle)return;

  document.documentElement.setAttribute(
    "data-shoufhon-shop-guard",
    "checking"
  );

  curtainStyle=document.createElement("style");
  curtainStyle.id="shoufhon-shop-visibility-guard-css";
  curtainStyle.textContent=`
    html[data-shoufhon-shop-guard="checking"] body,
    html[data-shoufhon-shop-guard="blocked"] body{
      visibility:hidden!important;
      background:#080705!important;
    }

    #shoufhon-shop-visibility-curtain{
      position:fixed!important;
      inset:0!important;
      z-index:2147483647!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      background:
        radial-gradient(circle at 50% 30%,rgba(217,164,65,.08),transparent 36%),
        #080705!important;
      color:#d9a441!important;
      font:800 12px/1.4 Arial,"Segoe UI",sans-serif!important;
      letter-spacing:.35px!important;
    }
  `;

  (document.head||document.documentElement).appendChild(curtainStyle);

  function mount(){
    if(resolved||curtainNode||!document.body)return;
    curtainNode=document.createElement("div");
    curtainNode.id="shoufhon-shop-visibility-curtain";
    curtainNode.setAttribute("aria-hidden","true");
    curtainNode.textContent="SHOUFHON";
    document.body.appendChild(curtainNode);
  }

  if(document.body)mount();
  else document.addEventListener("DOMContentLoaded",mount,{once:true});
}

function clearCurtain(){
  resolved=true;
  if(curtainTimer){
    clearTimeout(curtainTimer);
    curtainTimer=null;
  }
  document.documentElement.removeAttribute("data-shoufhon-shop-guard");
  curtainNode?.remove();
  curtainStyle?.remove();
  curtainNode=null;
  curtainStyle=null;
}

function keepBlocked(){
  if(curtainTimer){
    clearTimeout(curtainTimer);
    curtainTimer=null;
  }
  installCurtain();
  document.documentElement.setAttribute(
    "data-shoufhon-shop-guard",
    "blocked"
  );
}

curtainTimer=setTimeout(installCurtain,90);

async function fetchProfileBySlug(slug){
  const normalized=normalizeSlug(slug);
  if(!normalized)return null;

  const url=
    SUPABASE_URL+
    "/rest/v1/shop_profiles"+
    "?select=shop_slug,is_active,shop_url"+
    "&shop_slug=eq."+encodeURIComponent(normalized)+
    "&limit=1";

  const response=await fetch(url,{
    method:"GET",
    headers:{
      apikey:SUPABASE_KEY,
      Authorization:"Bearer "+SUPABASE_KEY,
      Accept:"application/json"
    },
    cache:"no-store",
    credentials:"omit"
  });

  if(!response.ok){
    throw new Error("Visibility lookup failed: "+response.status);
  }

  const rows=await response.json();
  return Array.isArray(rows)&&rows.length?rows[0]:null;
}

function domShopSlug(){
  const explicit=
    window.__MA7ALAK_EXACT_HUB_SLUG__ ||
    document
      .querySelector(
        "#ma7alak-shop-profile-hub-mount[data-shop-slug], [data-shop-slug]"
      )
      ?.getAttribute("data-shop-slug") ||
    "";

  return normalizeSlug(explicit);
}

async function fallbackProfileFromPage(){
  if(document.readyState==="loading"){
    await new Promise(resolve=>{
      document.addEventListener("DOMContentLoaded",resolve,{once:true});
      setTimeout(resolve,1200);
    });
  }

  const slug=domShopSlug();

  if(!slug||slug===pathSlug){
    return null;
  }

  return fetchProfileBySlug(slug);
}

function existingSupabaseClient(){
  return (
    window.__MA7ALAK_SHARED_SUPABASE_CLIENT__ ||
    window.Ma7alakSupabase?.client ||
    window.Ma7alakSupabaseBootstrap?.client ||
    window.Ma7alakAccount?.client ||
    window.Ma7alakOwnerAuth?.client ||
    null
  );
}

async function waitForExistingClient(){
  for(let i=0;i<24;i++){
    const client=existingSupabaseClient();
    if(client)return client;
    await new Promise(resolve=>setTimeout(resolve,50));
  }
  return null;
}

async function ensureSupabaseClient(){
  let client=await waitForExistingClient();
  if(client)return client;

  if(!window.supabase||typeof window.supabase.createClient!=="function"){
    await new Promise((resolve,reject)=>{
      const existing=document.querySelector(
        'script[data-shoufhon-visibility-supabase]'
      );

      if(existing){
        existing.addEventListener("load",resolve,{once:true});
        existing.addEventListener("error",reject,{once:true});
        setTimeout(resolve,1500);
        return;
      }

      const script=document.createElement("script");
      script.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.async=true;
      script.dataset.shoufhonVisibilitySupabase="1";
      script.onload=resolve;
      script.onerror=reject;
      (document.head||document.documentElement).appendChild(script);
    }).catch(()=>{});
  }

  if(!window.supabase||typeof window.supabase.createClient!=="function"){
    return null;
  }

  client=window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
      auth:{
        persistSession:true,
        autoRefreshToken:true,
        detectSessionInUrl:true
      }
    }
  );

  return client;
}

async function currentUserIsSiteAdmin(){
  try{
    const client=await ensureSupabaseClient();
    if(!client)return false;

    const sessionResult=await client.auth.getSession();
    const session=sessionResult?.data?.session;

    if(!session)return false;

    const result=await client.rpc("is_site_admin");

    return !result.error&&result.data===true;
  }catch(_){
    return false;
  }
}

async function evaluate(){
  try{
    let profile=await fetchProfileBySlug(pathSlug);

    if(!profile){
      profile=await fallbackProfileFromPage();
    }

    /*
      No matching shop means this is not a shop route managed by
      shop_profiles. Never interfere with ordinary ShoufHon pages.
    */
    if(!profile){
      clearCurtain();
      return;
    }

    if(profile.is_active===true){
      clearCurtain();
      window.dispatchEvent(
        new CustomEvent(
          "shoufhon:shop-visibility",
          {detail:{shopSlug:profile.shop_slug,visible:true,adminPreview:false}}
        )
      );
      return;
    }

    keepBlocked();

    const admin=await Promise.race([
      currentUserIsSiteAdmin(),
      new Promise(resolve=>setTimeout(()=>resolve(false),3200))
    ]);

    if(admin===true){
      clearCurtain();
      document.documentElement.setAttribute(
        "data-shoufhon-hidden-shop-admin-preview",
        "true"
      );
      window.dispatchEvent(
        new CustomEvent(
          "shoufhon:shop-visibility",
          {detail:{shopSlug:profile.shop_slug,visible:false,adminPreview:true}}
        )
      );
      return;
    }

    /*
      Stop as much of the still-loading manual Hostinger page as possible
      before leaving it. The underlying Hostinger route still physically
      exists, but normal browser visitors never receive the shop UI.
    */
    try{window.stop()}catch(_){}

    const target=
      REDIRECT_PATH+
      "?unavailable="+
      encodeURIComponent(profile.shop_slug||pathSlug);

    location.replace(target);
  }catch(error){
    /*
      Fail open if Supabase/network is unavailable. A temporary backend
      problem must never make every ShoufHon route inaccessible.
    */
    console.warn("[ShoufHon Visibility Guard]",error);
    clearCurtain();
  }
}

evaluate();
})();
