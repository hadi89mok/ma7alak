/* MA7ALAK ADMIN AUTH ISOLATION
   Load BEFORE ma7alak-admin-panel.js.
   Keeps /admin authentication in its own storage key so public viewer/owner
   scripts cannot sign the admin session out.
*/
(function(){
  "use strict";
  const path=(location.pathname||"/").replace(/\/+$/,"")||"/";
  if(path!=="/admin") return;

  const ADMIN_STORAGE_KEY="ma7alak-admin-auth-v1";
  let tries=0;

  function patch(){
    if(!window.supabase || typeof window.supabase.createClient!=="function"){
      if(tries++<200) setTimeout(patch,25);
      return;
    }
    if(window.supabase.__ma7alakAdminIsolated) return;

    const original=window.supabase.createClient.bind(window.supabase);
    window.supabase.createClient=function(url,key,options){
      const opts=options && typeof options==="object" ? {...options} : {};
      const auth=opts.auth && typeof opts.auth==="object" ? {...opts.auth} : {};
      auth.storage=localStorage;
      auth.storageKey=ADMIN_STORAGE_KEY;
      auth.persistSession=true;
      auth.autoRefreshToken=true;
      auth.detectSessionInUrl=true;
      opts.auth=auth;
      return original(url,key,opts);
    };
    window.supabase.__ma7alakAdminIsolated=true;
  }

  patch();
})();