(function(){
  "use strict";

  if(window.self!==window.top)return;
  if(window.__SHOUFHON_WEB_PUSH__)return;
  window.__SHOUFHON_WEB_PUSH__=true;

  const VERSION="2026.09.24.2";
  const SUPABASE_URL=
    "https://wdtaiuwtqdepzdamgsrs.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY=
    "sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
  const CONFIG_URL=
    SUPABASE_URL+
    "/functions/v1/push-config";
  const SUBSCRIBE_URL=
    SUPABASE_URL+
    "/functions/v1/push-subscribe";
  const VISITOR_KEY="ma7alak_visitor_id";
  const DISMISS_KEY=
    "shoufhon_push_prompt_dismissed_at_v1";
  const DISMISS_MS=
    3*24*60*60*1000;

  let card=null;
  let busy=false;

  function isStandalone(){
    return (
      window.matchMedia?.(
        "(display-mode: standalone)"
      )?.matches ||
      window.navigator.standalone===true
    );
  }

  function isIOS(){
    const ua=
      String(
        navigator.userAgent||""
      );

    return (
      /iPad|iPhone|iPod/i.test(ua) ||
      (
        navigator.platform==="MacIntel" &&
        Number(
          navigator.maxTouchPoints||0
        )>1
      )
    );
  }

  function supported(){
    return (
      window.isSecureContext===true &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window
    );
  }

  function getVisitorId(){
    let id="";

    try{
      id=
        localStorage.getItem(
          VISITOR_KEY
        )||"";
    }catch(_){}

    if(id)return id;

    try{
      if(
        window.crypto &&
        typeof window.crypto.randomUUID===
          "function"
      ){
        id=
          window.crypto.randomUUID();
      }
    }catch(_){}

    if(!id){
      id=
        "visitor_"+
        Date.now()+
        "_"+
        Math.random()
          .toString(36)
          .slice(2);
    }

    try{
      localStorage.setItem(
        VISITOR_KEY,
        id
      );
    }catch(_){}

    return id;
  }

  function dismissedRecently(){
    try{
      const value=
        Number(
          localStorage.getItem(
            DISMISS_KEY
          )||0
        );

      return (
        value>0 &&
        Date.now()-value<
          DISMISS_MS
      );
    }catch(_){
      return false;
    }
  }

  function markDismissed(){
    try{
      localStorage.setItem(
        DISMISS_KEY,
        String(Date.now())
      );
    }catch(_){}
  }

  function clearDismissed(){
    try{
      localStorage.removeItem(
        DISMISS_KEY
      );
    }catch(_){}
  }

  function base64UrlToUint8Array(value){
    const padding=
      "=".repeat(
        (4-value.length%4)%4
      );

    const base64=
      (value+padding)
        .replace(/-/g,"+")
        .replace(/_/g,"/");

    const raw=
      window.atob(base64);

    const output=
      new Uint8Array(
        raw.length
      );

    for(
      let i=0;
      i<raw.length;
      i++
    ){
      output[i]=
        raw.charCodeAt(i);
    }

    return output;
  }

  async function api(
    url,
    options={}
  ){
    const response=
      await fetch(
        url,
        {
          ...options,
          headers:{
            "apikey":
              SUPABASE_PUBLISHABLE_KEY,
            ...(options.headers||{})
          }
        }
      );

    let data=null;

    try{
      data=
        await response.json();
    }catch(_){}

    if(
      !response.ok ||
      !data ||
      data.success===false
    ){
      throw new Error(
        data?.error ||
        "Push service request failed"
      );
    }

    return data;
  }

  async function currentAccessToken(){
    try{
      if(
        window.Ma7alakAccount &&
        typeof window.Ma7alakAccount.ready==="function"
      ){
        await Promise.race([
          window.Ma7alakAccount.ready(),
          new Promise(resolve=>setTimeout(resolve,1800))
        ]);
      }
    }catch(_){}

    try{
      const token=
        String(
          window.Ma7alakAccount?.session?.access_token||
          ""
        ).trim();

      if(token)return token;
    }catch(_){}

    try{
      const client=
        window.__MA7ALAK_SHARED_SUPABASE_CLIENT__ ||
        window.Ma7alakSupabase?.client ||
        null;

      if(
        client &&
        client.auth &&
        typeof client.auth.getSession==="function"
      ){
        const result=
          await client.auth.getSession();

        return String(
          result?.data?.session?.access_token||
          ""
        ).trim();
      }
    }catch(_){}

    return "";
  }

  async function getVapidPublicKey(){
    const data=
      await api(
        CONFIG_URL,
        {
          method:"GET",
          cache:"no-store"
        }
      );

    const key=
      String(
        data.vapid_public_key||""
      ).trim();

    if(!key){
      throw new Error(
        "Push key is unavailable"
      );
    }

    return key;
  }

  async function getRegistration(){
    const ready=
      navigator.serviceWorker.ready;

    const timeout=
      new Promise(
        (_,reject)=>{
          setTimeout(
            ()=>reject(
              new Error(
                "Service worker is not ready yet"
              )
            ),
            10000
          );
        }
      );

    return Promise.race([
      ready,
      timeout
    ]);
  }

  function subscriptionPayload(
    subscription
  ){
    const json=
      subscription.toJSON();

    return {
      endpoint:
        String(
          subscription.endpoint||
          json.endpoint||
          ""
        ),
      p256dh:
        String(
          json.keys?.p256dh||""
        ),
      auth:
        String(
          json.keys?.auth||""
        )
    };
  }

  async function saveSubscription(
    subscription,
    sendTest
  ){
    const payload=
      subscriptionPayload(
        subscription
      );

    const accessToken=
      await currentAccessToken();

    return api(
      SUBSCRIBE_URL,
      {
        method:"POST",
        headers:{
          "Content-Type":
            "application/json",
          ...(accessToken
            ? {
                "Authorization":
                  "Bearer "+accessToken
              }
            : {})
        },
        body:JSON.stringify({
          action:"subscribe",
          visitor_id:
            getVisitorId(),
          endpoint:
            payload.endpoint,
          p256dh:
            payload.p256dh,
          auth:
            payload.auth,
          user_agent:
            String(
              navigator.userAgent||""
            ).slice(0,1000),
          send_test:
            sendTest===true
        })
      }
    );
  }

  async function syncExisting(){
    if(
      !supported() ||
      Notification.permission!=="granted"
    ){
      return false;
    }

    try{
      const registration=
        await getRegistration();

      const subscription=
        await registration
          .pushManager
          .getSubscription();

      if(!subscription){
        return false;
      }

      await saveSubscription(
        subscription,
        false
      );

      return true;
    }catch(error){
      console.warn(
        "[ShoufHon Push] Existing subscription sync failed:",
        error
      );

      return false;
    }
  }

  async function enable(){
    if(busy){
      return {
        success:false,
        reason:"busy"
      };
    }

    if(!supported()){
      throw new Error(
        "Push notifications are not supported on this browser."
      );
    }

    if(
      isIOS() &&
      !isStandalone()
    ){
      throw new Error(
        "On iPhone, add ShoufHon to the Home Screen first, then enable notifications from the installed ShoufHon app."
      );
    }

    busy=true;
    setBusyUi(true);

    try{
      let permission=
        Notification.permission;

      if(permission==="default"){
        permission=
          await Notification
            .requestPermission();
      }

      if(permission!=="granted"){
        throw new Error(
          permission==="denied"
            ? "Notifications are blocked. Enable them for ShoufHon in your phone or browser settings."
            : "Notification permission was not granted."
        );
      }

      const registration=
        await getRegistration();

      let subscription=
        await registration
          .pushManager
          .getSubscription();

      let created=false;

      if(!subscription){
        const vapid=
          await getVapidPublicKey();

        subscription=
          await registration
            .pushManager
            .subscribe({
              userVisibleOnly:true,
              applicationServerKey:
                base64UrlToUint8Array(
                  vapid
                )
            });

        created=true;
      }

      const result=
        await saveSubscription(
          subscription,
          created
        );

      clearDismissed();
      hideCard();

      window.dispatchEvent(
        new CustomEvent(
          "shoufhon:push-enabled",
          {
            detail:{
              testSent:
                result.test_sent===true
            }
          }
        )
      );

      return {
        success:true,
        subscribed:true,
        testSent:
          result.test_sent===true
      };
    }finally{
      busy=false;
      setBusyUi(false);
    }
  }

  async function disable(){
    if(!supported()){
      return {
        success:true,
        subscribed:false
      };
    }

    const registration=
      await getRegistration();

    const subscription=
      await registration
        .pushManager
        .getSubscription();

    if(subscription){
      const payload=
        subscriptionPayload(
          subscription
        );

      try{
        await api(
          SUBSCRIBE_URL,
          {
            method:"POST",
            headers:{
              "Content-Type":
                "application/json"
            },
            body:JSON.stringify({
              action:"disable",
              visitor_id:
                getVisitorId(),
              endpoint:
                payload.endpoint
            })
          }
        );
      }catch(error){
        console.warn(
          "[ShoufHon Push] Could not disable server subscription:",
          error
        );
      }

      try{
        await subscription
          .unsubscribe();
      }catch(_){}
    }

    return {
      success:true,
      subscribed:false
    };
  }

  async function getState(){
    const base={
      supported:supported(),
      standalone:isStandalone(),
      ios:isIOS(),
      permission:
        "Notification" in window
          ? Notification.permission
          : "unsupported",
      subscribed:false
    };

    if(!base.supported){
      return base;
    }

    try{
      const registration=
        await getRegistration();

      const subscription=
        await registration
          .pushManager
          .getSubscription();

      base.subscribed=
        !!subscription;
    }catch(_){}

    return base;
  }

  function installCss(){
    if(
      document.getElementById(
        "m7-push-style"
      )
    ){
      return;
    }

    const style=
      document.createElement(
        "style"
      );

    style.id=
      "m7-push-style";

    style.textContent=`
      #m7-push-card{
        position:fixed;
        left:50%;
        bottom:max(16px,env(safe-area-inset-bottom));
        z-index:2147482990;
        width:min(390px,calc(100vw - 22px));
        box-sizing:border-box;
        display:grid;
        grid-template-columns:44px minmax(0,1fr) auto;
        align-items:center;
        gap:10px;
        padding:10px;
        border:1px solid rgba(217,164,65,.48);
        border-radius:18px;
        background:rgba(12,10,9,.96);
        box-shadow:
          0 18px 42px rgba(0,0,0,.48),
          0 0 18px rgba(217,164,65,.07);
        color:#fff;
        font-family:Arial,"Segoe UI",sans-serif;
        opacity:0;
        pointer-events:none;
        transform:translateX(-50%) translateY(18px);
        transition:
          opacity .18s ease,
          transform .18s ease;
        -webkit-backdrop-filter:blur(12px);
        backdrop-filter:blur(12px)
      }

      #m7-push-card.show{
        opacity:1;
        pointer-events:auto;
        transform:translateX(-50%) translateY(0)
      }

      #m7-push-card .m7push-icon{
        width:42px;
        height:42px;
        display:grid;
        place-items:center;
        border-radius:12px;
        border:1px solid rgba(217,164,65,.40);
        background:
          radial-gradient(
            circle at 30% 20%,
            rgba(217,164,65,.20),
            rgba(255,255,255,.025)
          );
        font-size:20px
      }

      #m7-push-card .m7push-copy{
        min-width:0
      }

      #m7-push-card .m7push-copy b{
        display:block;
        margin:0 0 3px;
        font-size:13px;
        line-height:1.2;
        font-weight:950
      }

      #m7-push-card .m7push-copy span{
        display:block;
        color:rgba(255,255,255,.64);
        font-size:9px;
        line-height:1.4;
        font-weight:650
      }

      #m7-push-card .m7push-actions{
        display:flex;
        align-items:center;
        gap:6px
      }

      #m7-push-card button{
        border:0;
        cursor:pointer;
        -webkit-tap-highlight-color:transparent;
        touch-action:manipulation
      }

      #m7-push-card .m7push-enable{
        min-height:34px;
        padding:0 11px;
        border-radius:10px;
        background:
          linear-gradient(
            135deg,
            #f1ce7e,
            #d9a441
          );
        color:#1b1208;
        font-size:10px;
        font-weight:950
      }

      #m7-push-card .m7push-enable[disabled]{
        opacity:.62;
        cursor:default
      }

      #m7-push-card .m7push-close{
        width:30px;
        height:30px;
        display:grid;
        place-items:center;
        border-radius:50%;
        background:rgba(255,255,255,.055);
        color:rgba(255,255,255,.68);
        font-size:16px
      }

      #m7-push-card.error{
        border-color:rgba(220,96,75,.48)
      }

      #m7-push-card.error .m7push-copy span{
        color:#ffc3b9
      }

      @media(max-width:390px){
        #m7-push-card{
          grid-template-columns:40px minmax(0,1fr) auto;
          gap:8px;
          padding:9px
        }

        #m7-push-card .m7push-icon{
          width:38px;
          height:38px
        }

        #m7-push-card .m7push-copy b{
          font-size:12px
        }

        #m7-push-card .m7push-enable{
          padding:0 9px
        }
      }

      @media(prefers-reduced-motion:reduce){
        #m7-push-card{
          transition:none!important
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function ensureCard(){
    installCss();

    if(card&&card.isConnected){
      return card;
    }

    card=
      document.getElementById(
        "m7-push-card"
      );

    if(card)return card;

    card=
      document.createElement(
        "div"
      );

    card.id=
      "m7-push-card";
    card.setAttribute(
      "role",
      "dialog"
    );
    card.setAttribute(
      "aria-label",
      "ShoufHon notifications"
    );
    card.setAttribute(
      "aria-live",
      "polite"
    );

    card.innerHTML=`
      <span class="m7push-icon" aria-hidden="true">🔔</span>

      <span class="m7push-copy">
        <b>Turn on ShoufHon notifications</b>
        <span data-m7push-copy>Get new Stories & Reels even when ShoufHon is closed.</span>
      </span>

      <span class="m7push-actions">
        <button class="m7push-enable" type="button">Turn on</button>
        <button class="m7push-close" type="button" aria-label="Not now">×</button>
      </span>
    `;

    document.body.appendChild(
      card
    );

    card
      .querySelector(
        ".m7push-close"
      )
      ?.addEventListener(
        "click",
        ()=>{
          markDismissed();
          hideCard();
        }
      );

    card
      .querySelector(
        ".m7push-enable"
      )
      ?.addEventListener(
        "click",
        async()=>{
          try{
            await enable();
          }catch(error){
            showError(
              String(
                error?.message||
                error||
                "Could not enable notifications"
              )
            );
          }
        }
      );

    return card;
  }

  function setBusyUi(value){
    if(!card)return;

    const button=
      card.querySelector(
        ".m7push-enable"
      );

    if(button){
      button.disabled=
        value===true;
      button.textContent=
        value===true
          ? "Turning on…"
          : "Turn on";
    }
  }

  function showError(message){
    const current=
      ensureCard();

    current.classList.add(
      "error",
      "show"
    );

    const copy=
      current.querySelector(
        "[data-m7push-copy]"
      );

    if(copy){
      copy.textContent=
        message;
    }
  }

  function hideCard(){
    if(!card){
      card=
        document.getElementById(
          "m7-push-card"
        );
    }

    card?.classList.remove(
      "show",
      "error"
    );
  }

  async function showPrompt(options={}){
    if(!supported()){
      return false;
    }

    if(
      isIOS() &&
      !isStandalone()
    ){
      return false;
    }

    if(
      Notification.permission===
        "denied"
    ){
      return false;
    }

    const existing=
      await getState();

    if(existing.subscribed){
      return false;
    }

    if(
      options.force!==true &&
      dismissedRecently()
    ){
      return false;
    }

    const current=
      ensureCard();

    const copy=
      current.querySelector(
        "[data-m7push-copy]"
      );

    if(copy){
      copy.textContent=
        "Get messages, new Stories & Reels even when ShoufHon is closed.";
    }

    current.classList.remove(
      "error"
    );

    requestAnimationFrame(
      ()=>current.classList.add(
        "show"
      )
    );

    return true;
  }

  async function init(){
    if(!supported()){
      return;
    }

    if(
      Notification.permission===
        "granted"
    ){
      const synced=
        await syncExisting();

      if(synced)return;
    }

    /*
      Auto-surface the permission card only from the installed
      PWA. Regular browser visitors can still call
      Ma7alakPush.showPrompt() from a future settings button.
      On iPhone this also respects Apple's Home Screen requirement.
    */
    if(!isStandalone()){
      return;
    }

    if(
      Notification.permission===
        "default" &&
      !dismissedRecently()
    ){
      setTimeout(
        ()=>showPrompt(),
        1800
      );
    }
  }

  function scheduleAccountSubscriptionSync(){
    if(
      !supported() ||
      Notification.permission!=="granted"
    ){
      return;
    }

    setTimeout(
      ()=>syncExisting().catch(()=>{}),
      250
    );
  }

  addEventListener(
    "ma7alak:account-change",
    scheduleAccountSubscriptionSync
  );

  addEventListener(
    "ma7alak:owner-auth-change",
    scheduleAccountSubscriptionSync
  );

  /*
    Account/auth modules may finish after the push client.
    One delayed sync makes sure an already-granted subscription
    is linked to the current authenticated ShoufHon user.
  */
  setTimeout(
    scheduleAccountSubscriptionSync,
    3500
  );

  window.Ma7alakPush={
    version:VERSION,
    supported:supported(),
    standalone:isStandalone(),
    enable,
    disable,
    state:getState,
    showPrompt:()=>
      showPrompt({force:true})
  };

  if(document.readyState==="loading"){
    document.addEventListener(
      "DOMContentLoaded",
      ()=>init().catch(()=>{}),
      {once:true}
    );
  }
  else{
    init().catch(()=>{});
  }
})();
