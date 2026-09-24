/* SHOUFHON SHARED STORY VIEWER V2 — story time + media/voice replies */
(function ShoufHonSharedStoryViewer(){
  "use strict";
  if(window.__SHOUFHON_SHARED_STORY_VIEWER_V2__)return;
  window.__SHOUFHON_SHARED_STORY_VIEWER_V2__=true;

  const SCRIPT_SRC=document.currentScript?.src||"";
  const SUPABASE_URL="https://wdtaiuwtqdepzdamgsrs.supabase.co";
  const SUPABASE_KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
  const VISITOR_KEY="ma7alak_visitor_id";
  const INTERACTION_TOKEN_KEY="ma7alak_interaction_token_v1";
  const LIKED_STORIES_KEY="ma7alak_story_liked_ids";
  const ROOT_ID="shoufhon-global-story-viewer";
  const STYLE_ID="shoufhon-global-story-viewer-css";

  let client=null;
  let root=null;
  let stories=[];
  let profile=null;
  let currentIndex=0;
  let currentOwner=false;
  let currentSignedIn=false;
  let storyPaused=false;
  let storyClockRemainingMs=0;
  let storyClockStartedAt=0;
  let replyViewportSyncTimer=0;
  let mediaTimer=0;
  let loadToken=0;
  let historyArmed=false;
  let storyChannel=null;
  let touchX=0;
  let touchY=0;

  /* Homepage/shared Story reply media state. */
  let storyReplyBusy=false;
  let storyReplyRecorder=null;
  let storyReplyMicStream=null;
  let storyReplyVoiceChunks=[];
  let storyReplyVoiceStartedAt=0;
  let storyReplyVoiceTimer=0;
  let storyReplyVoiceDiscard=false;
  let replyKeyboardLockOffset=0;

  const esc=value=>String(value??"").replace(
    /[&<>"']/g,
    ch=>({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#39;"
    }[ch])
  );

  function getClient(){
    if(client)return client;

    client=
      window.Ma7alakOwnerAuth?.client||
      window.Ma7alakAccount?.client||
      window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||
      window.Ma7alakSupabase?.client||
      window.Ma7alakSupabaseBootstrap?.client||
      window.supabase?.createClient?.(
        SUPABASE_URL,
        SUPABASE_KEY
      )||
      null;

    return client;
  }

  function randomId(){
    try{
      return crypto.randomUUID();
    }
    catch(_){}

    try{
      const bytes=
        new Uint8Array(
          16
        );

      crypto.getRandomValues(
        bytes
      );

      return [...bytes]
        .map(
          x=>
            x
              .toString(16)
              .padStart(2,"0")
        )
        .join("");
    }
    catch(_){
      return (
        "v-"+
        Date.now()+
        "-"+
        Math.random()
          .toString(36)
          .slice(2)
      );
    }
  }

  function visitorId(){
    try{
      let value=
        String(
          localStorage.getItem(
            VISITOR_KEY
          )||
          ""
        ).trim();

      if(
        value.length<
        8
      ){
        value=
          randomId();

        localStorage.setItem(
          VISITOR_KEY,
          value
        );
      }

      return value;
    }
    catch(_){
      return randomId();
    }
  }

  function interactionToken(){
    try{
      const helper=
        window.Ma7alakInteractionSecurity||
        window.ShoufHonInteractionSecurityBridge;

      if(
        typeof helper?.getToken===
        "function"
      ){
        const value=
          String(
            helper.getToken()||
            ""
          ).trim();

        if(
          value.length>=
          32
        ){
          return value;
        }
      }
    }
    catch(_){}

    try{
      let value=
        String(
          localStorage.getItem(
            INTERACTION_TOKEN_KEY
          )||
          ""
        ).trim();

      if(
        !/^[A-Za-z0-9._:-]{32,200}$/.test(
          value
        )
      ){
        const bytes=
          new Uint8Array(
            24
          );

        crypto.getRandomValues(
          bytes
        );

        value=
          [...bytes]
            .map(
              x=>
                x
                  .toString(16)
                  .padStart(2,"0")
            )
            .join("");

        localStorage.setItem(
          INTERACTION_TOKEN_KEY,
          value
        );
      }

      return value;
    }
    catch(_){
      return (
        randomId()+
        randomId()
      )
        .replace(
          /[^A-Za-z0-9._:-]/g,
          ""
        )
        .slice(
          0,
          64
        );
    }
  }

  function mediaUrl(story){
    const raw=
      String(
        story?.storage_path||
        ""
      ).trim();

    if(
      /^https:\/\//i.test(
        raw
      )
    ){
      return raw;
    }

    const c=
      getClient();

    return (
      raw &&
      c?.storage?.from
    )
      ? c
          .storage
          .from(
            "shop-stories"
          )
          .getPublicUrl(
            raw
          )
          .data
          .publicUrl
      : "";
  }

  function readLikedStoryIds(){
    try{
      const parsed=JSON.parse(localStorage.getItem(LIKED_STORIES_KEY)||"[]");
      return new Set(Array.isArray(parsed)?parsed.map(value=>String(value)):[]);
    }catch(_){
      return new Set();
    }
  }

  function saveLikedStoryIds(set){
    try{
      localStorage.setItem(
        LIKED_STORIES_KEY,
        JSON.stringify(Array.from(set))
      );
    }catch(_){}
  }

  function isLocallyLiked(id){
    const storyId=String(id||"");
    if(!storyId)return false;

    const ids=readLikedStoryIds();
    if(ids.has(storyId))return true;

    try{
      if(localStorage.getItem("ma7alak_story_liked_"+storyId)==="1"){
        ids.add(storyId);
        saveLikedStoryIds(ids);
        return true;
      }
    }catch(_){}

    return false;
  }

  function markLocallyLiked(id){
    const storyId=String(id||"");
    if(!storyId)return;

    const ids=readLikedStoryIds();
    ids.add(storyId);
    saveLikedStoryIds(ids);

    try{
      localStorage.setItem("ma7alak_story_liked_"+storyId,"1");
    }catch(_){}

    try{
      window.dispatchEvent(
        new CustomEvent(
          "ma7alak:story-liked",
          {detail:{story_id:storyId}}
        )
      );
    }catch(_){}
  }

  function launchLikeHearts(){
    if(!root||root.hidden)return;

    let burst=root.querySelector(".ssv-heart-burst");

    if(!burst){
      burst=document.createElement("div");
      burst.className="ssv-heart-burst";
      root.querySelector(".ssv-frame")?.appendChild(burst);
    }

    burst.replaceChildren();

    for(let index=0;index<14;index++){
      const heart=document.createElement("span");
      heart.className="ssv-floating-heart";
      heart.textContent="♥";

      const x=(Math.random()*180)-90;
      const y=-(100+Math.random()*190);
      const scale=.72+Math.random()*.85;
      const rotation=(Math.random()*70)-35;
      const duration=1.05+Math.random()*.75;
      const delay=Math.random()*.16;
      const size=18+Math.random()*18;

      heart.style.setProperty("--ssv-heart-x",x+"px");
      heart.style.setProperty("--ssv-heart-y",y+"px");
      heart.style.setProperty("--ssv-heart-scale",String(scale));
      heart.style.setProperty("--ssv-heart-rotate",rotation+"deg");
      heart.style.setProperty("--ssv-heart-duration",duration+"s");
      heart.style.animationDelay=delay+"s";
      heart.style.fontSize=size+"px";

      burst.appendChild(heart);
    }

    setTimeout(()=>{
      if(burst)burst.replaceChildren();
    },2100);
  }

  function injectStyle(){
    if(
      document.getElementById(
        STYLE_ID
      )
    ){
      return;
    }

    const style=
      document.createElement(
        "style"
      );

    style.id=
      STYLE_ID;

    style.textContent=`
html.ssv-open,body.ssv-open{overflow:hidden!important;overscroll-behavior:none!important}
#${ROOT_ID}{position:fixed;inset:0;width:100vw;height:100vh;height:100dvh;z-index:2147483647;display:grid;place-items:center;background:#000;color:#fff;font-family:Arial,"Segoe UI",sans-serif;touch-action:none;overscroll-behavior:none}
#${ROOT_ID}[hidden]{display:none!important}
#${ROOT_ID} *{box-sizing:border-box}
#${ROOT_ID} .ssv-frame{position:relative;width:min(100vw,470px);height:100vh;height:100dvh;overflow:hidden;background:#000;isolation:isolate}
#${ROOT_ID} .ssv-media-host{position:absolute;inset:0;display:grid;place-items:center;background:#000}
#${ROOT_ID} .ssv-media{width:100%;height:100%;object-fit:contain;background:#000;display:block}
#${ROOT_ID} .ssv-loading{position:absolute;inset:0;display:grid;place-items:center;color:#aaa;font-size:12px}
#${ROOT_ID} .ssv-top{position:absolute;z-index:20;top:0;left:0;right:0;padding:max(10px,env(safe-area-inset-top)) 12px 30px;background:linear-gradient(#000d,#0008 58%,transparent)}
#${ROOT_ID} .ssv-bars{display:flex;gap:3px;margin-bottom:10px}
#${ROOT_ID} .ssv-bar{height:3px;flex:1;border-radius:4px;background:#ffffff4a;overflow:hidden}
#${ROOT_ID} .ssv-bar>i{display:block;width:0;height:100%;background:#fff}
#${ROOT_ID} .ssv-bar.done>i{width:100%}
#${ROOT_ID} .ssv-bar.active>i{animation:ssvProgress var(--ssv-duration,6s) linear forwards;-webkit-animation:ssvProgress var(--ssv-duration,6s) linear forwards}
#${ROOT_ID}.is-paused .ssv-bar.active>i{animation-play-state:paused!important;-webkit-animation-play-state:paused!important}
#${ROOT_ID} .ssv-head-row{display:flex;align-items:center;gap:9px;min-width:0}
#${ROOT_ID} .ssv-shop-avatar{width:38px;height:38px;flex:0 0 38px;padding:0;border:2px solid #d9a441;border-radius:50%;overflow:hidden;background:#211a15;color:#efc878;display:grid;place-items:center;font-weight:900;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
#${ROOT_ID} .ssv-shop-avatar img{width:100%;height:100%;object-fit:cover;display:block}
#${ROOT_ID} .ssv-copy{min-width:0;flex:1}
#${ROOT_ID} .ssv-name{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:900}
#${ROOT_ID} .ssv-time{display:block;margin-top:2px;color:#d7d7d7;font-size:10px;font-weight:750;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#${ROOT_ID} .ssv-status{display:block;margin-top:2px;color:#c4c4c4;font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#${ROOT_ID} .ssv-owner-views{display:none;align-items:center;gap:5px;padding:7px 9px;border:1px solid #ffffff2a;border-radius:999px;background:#0007;color:#fff;font-size:11px;font-weight:800;white-space:nowrap}
#${ROOT_ID}.is-owner .ssv-owner-views{display:inline-flex}
#${ROOT_ID} .ssv-close{width:40px;height:40px;flex:0 0 40px;padding:0;border:1px solid #ffffff35;border-radius:50%;background:#0008;color:#fff;font-size:25px;line-height:1;display:grid;place-items:center;cursor:pointer;touch-action:manipulation}
#${ROOT_ID} .ssv-nav{position:absolute;z-index:8;top:82px;bottom:92px;width:34%;border:0;background:transparent;color:transparent;padding:0}
#${ROOT_ID} .ssv-prev{left:0}
#${ROOT_ID} .ssv-next{right:0}
#${ROOT_ID} .ssv-bottom{position:absolute;z-index:24;left:0;right:0;bottom:0;padding:28px max(12px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left));background:linear-gradient(transparent,#000b 40%,#000e);display:flex;align-items:center;gap:8px}
#${ROOT_ID}.is-keyboard-open .ssv-bottom{z-index:30;padding:0;background:transparent;pointer-events:none}
#${ROOT_ID}.is-keyboard-open .ssv-like{display:none!important}
#${ROOT_ID}.is-keyboard-open .ssv-reply{position:absolute;left:14px;right:14px;bottom:calc(max(14px,env(safe-area-inset-bottom)) + var(--ssv-keyboard-offset,0px));width:auto;z-index:31;padding:5px 6px 5px 14px;border:1px solid rgba(255,255,255,.30);border-radius:999px;background:linear-gradient(145deg,rgba(24,24,27,.98),rgba(7,7,9,.96));box-shadow:0 10px 34px rgba(0,0,0,.58),0 0 0 1px rgba(217,164,65,.12);backdrop-filter:blur(18px) saturate(135%);-webkit-backdrop-filter:blur(18px) saturate(135%);pointer-events:auto}
#${ROOT_ID}.is-owner .ssv-bottom{display:none}
#${ROOT_ID}.is-logged-out .ssv-reply{display:none!important}
#${ROOT_ID}.is-logged-out .ssv-bottom{justify-content:flex-end}
#${ROOT_ID} .ssv-like{width:44px;height:44px;flex:0 0 44px;padding:0;border:1px solid #ffffff38;border-radius:50%;background:#090909b8;color:#fff;display:grid;place-items:center;font-size:23px;cursor:pointer;touch-action:manipulation}
#${ROOT_ID} .ssv-like.is-liked{color:#ff3e55;border-color:#ff5b6c88;background:#2b0d12cc}
#${ROOT_ID} .ssv-reply{min-width:0;flex:1;display:flex;align-items:center;gap:7px}
#${ROOT_ID} .ssv-reply-text{min-width:0;flex:1;height:44px;border:1px solid #ffffff32;border-radius:999px;background:#0d0d0dc9;color:#fff;padding:0 15px;font-size:16px;outline:0}
#${ROOT_ID} .ssv-reply-text:focus{border-color:#d9a441}
#${ROOT_ID} .ssv-send{height:44px;min-width:54px;padding:0 14px;border:0;border-radius:999px;background:#d9a441;color:#160f08;font-weight:950;cursor:pointer;touch-action:manipulation}
#${ROOT_ID} .ssv-send:disabled,#${ROOT_ID} .ssv-like:disabled{opacity:.55;cursor:default}
#${ROOT_ID} .ssv-feedback{position:absolute;z-index:25;left:50%;bottom:max(70px,calc(env(safe-area-inset-bottom) + 62px));transform:translateX(-50%);max-width:calc(100% - 30px);padding:8px 11px;border-radius:999px;background:#17120fee;border:1px solid #d9a44155;color:#f2d093;font-size:11px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:0;pointer-events:none;transition:opacity .16s ease}
#${ROOT_ID} .ssv-feedback.show{opacity:1}
#${ROOT_ID} .ssv-heart-burst{position:absolute;inset:0;z-index:31;overflow:hidden;pointer-events:none}
#${ROOT_ID} .ssv-floating-heart{position:absolute;left:50%;top:72%;display:block;color:#ff375f;text-shadow:0 2px 7px #000,0 0 16px #ff375f66;opacity:0;transform:translate(-50%,-50%) scale(.45);animation:ssvHeartFloat var(--ssv-heart-duration,1.35s) cubic-bezier(.17,.67,.21,1) forwards;will-change:transform,opacity}
@keyframes ssvHeartFloat{0%{opacity:0;transform:translate(-50%,-50%) scale(.45) rotate(0deg)}12%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--ssv-heart-x,0px)),calc(-50% + var(--ssv-heart-y,-180px))) scale(var(--ssv-heart-scale,1)) rotate(var(--ssv-heart-rotate,0deg))}}
@-webkit-keyframes ssvHeartFloat{0%{opacity:0;-webkit-transform:translate(-50%,-50%) scale(.45) rotate(0deg)}12%{opacity:1}100%{opacity:0;-webkit-transform:translate(calc(-50% + var(--ssv-heart-x,0px)),calc(-50% + var(--ssv-heart-y,-180px))) scale(var(--ssv-heart-scale,1)) rotate(var(--ssv-heart-rotate,0deg))}}
@keyframes ssvProgress{from{width:0}to{width:100%}}
@-webkit-keyframes ssvProgress{from{width:0}to{width:100%}}
@media(max-width:600px){#${ROOT_ID} .ssv-frame{width:100vw}#${ROOT_ID} .ssv-nav{bottom:86px}}
`;

    document.head.appendChild(
      style
    );
  }

  function storyReplyVisibleBottom(){
    const candidates=[];

    function addWindow(win){
      if(!win)return;

      try{
        const vv=win.visualViewport;
        if(vv){
          const bottom=Number(vv.offsetTop||0)+Number(vv.height||0);
          if(Number.isFinite(bottom)&&bottom>0)candidates.push(bottom);
        }
      }catch(_){}

      try{
        const inner=Number(win.innerHeight||0);
        if(Number.isFinite(inner)&&inner>0)candidates.push(inner);
      }catch(_){}

      try{
        const keyboard=win.navigator?.virtualKeyboard;
        const box=keyboard?.boundingRect;
        const y=Number(box?.y);
        const height=Number(box?.height);
        if(Number.isFinite(y)&&Number.isFinite(height)&&height>0&&y>0){
          candidates.push(y);
        }
      }catch(_){}
    }

    addWindow(window);

    try{
      if(window.parent&&window.parent!==window)addWindow(window.parent);
    }catch(_){}

    try{
      if(window.top&&window.top!==window&&window.top!==window.parent)addWindow(window.top);
    }catch(_){}

    return candidates.length
      ? Math.min(...candidates)
      : Number(window.innerHeight||0);
  }

  function syncVisualViewport(){
    if(!root||root.hidden)return;

    const reply=
      root.querySelector(
        ".ssv-reply"
      );

    const input=
      root.querySelector(
        ".ssv-reply-text"
      );

    if(!reply)return;

    const focused=
      !!input &&
      document.activeElement===input;

    if(!focused){
      replyKeyboardLockOffset=0;

      root.style.setProperty(
        "--ssv-keyboard-offset",
        "0px"
      );

      root.classList.remove(
        "is-keyboard-open"
      );

      return;
    }

    /*
      Reset before measuring. This avoids accumulating an old offset across
      Android keyboard animation frames.
    */
    root.style.setProperty(
      "--ssv-keyboard-offset",
      "0px"
    );

    root.classList.add(
      "is-keyboard-open"
    );

    const visibleBottom=
      storyReplyVisibleBottom();

    const rect=
      reply.getBoundingClientRect();

    let offset=
      Math.max(
        0,
        Math.ceil(
          rect.bottom-
          visibleBottom+
          14
        )
      );

    const frame=
      root.querySelector(
        ".ssv-frame"
      );

    const frameRect=
      frame?.getBoundingClientRect?.()||
      root.getBoundingClientRect();

    const layoutHeight=
      Math.max(
        Number(frameRect.height||0),
        Number(window.innerHeight||0)
      );

    const measuredKeyboard=
      layoutHeight>0 &&
      visibleBottom<(layoutHeight-80);

    const androidMobile=
      /Android/i.test(
        String(navigator.userAgent||"")
      ) &&
      Math.min(
        Number(window.innerWidth||9999),
        Number(frameRect.width||9999)
      )<=900;

    /*
      Samsung/Brave can leave VisualViewport at full height while the IME
      overlays the Story. In that case use the same conservative fallback
      that already works on the shop-profile Story viewer.
    */
    if(
      androidMobile &&
      !measuredKeyboard &&
      layoutHeight>0
    ){
      offset=
        Math.max(
          offset,
          Math.round(
            layoutHeight*.50
          )
        );
    }

    if(offset<8)offset=0;

    const maxOffset=
      Math.max(
        0,
        Math.floor(
          rect.bottom-70
        )
      );

    offset=
      Math.min(
        offset,
        maxOffset
      );

    /*
      Never let a later bad Android viewport reading push the reply bar
      downward while the keyboard is still open.
    */
    offset=
      Math.max(
        replyKeyboardLockOffset,
        offset
      );

    replyKeyboardLockOffset=offset;

    root.style.setProperty(
      "--ssv-keyboard-offset",
      offset+"px"
    );

    if(
      input &&
      document.activeElement===input
    ){
      try{
        input.scrollIntoView({
          block:"nearest",
          inline:"nearest",
          behavior:"instant"
        });
      }
      catch(_){
        try{
          input.scrollIntoView(false);
        }catch(__){}
      }
    }
  }

  function scheduleVisualViewportSync(){
    requestAnimationFrame(
      syncVisualViewport
    );

    clearTimeout(
      replyViewportSyncTimer
    );

    replyViewportSyncTimer=
      setTimeout(
        ()=>{
          replyViewportSyncTimer=0;
          syncVisualViewport();
        },
        120
      );
  }

  function storyTimeAgo(value){
    const time=
      new Date(
        value||
        0
      ).getTime();

    if(!Number.isFinite(time)||time<=0){
      return "";
    }

    const seconds=
      Math.max(
        0,
        Math.floor(
          (Date.now()-time)/
          1000
        )
      );

    if(seconds<10)return "Just now";
    if(seconds<60)return seconds+"s ago";

    const minutes=Math.floor(seconds/60);
    if(minutes<60)return minutes+"m ago";

    const hours=Math.floor(minutes/60);
    if(hours<24)return hours+"h ago";

    const days=Math.floor(hours/24);
    if(days===1)return "Yesterday";
    return days+"d ago";
  }

  function storyReplyFormatDuration(value){
    const seconds=
      Math.max(
        0,
        Math.round(
          Number(value)||
          0
        )
      );

    return (
      Math.floor(seconds/60)+
      ":"+
      String(seconds%60).padStart(2,"0")
    );
  }

  function storyReplyMime(value){
    return String(value||"")
      .split(";")[0]
      .trim()
      .toLowerCase();
  }

  function storyReplyExt(mime,name){
    const map={
      "image/jpeg":"jpg",
      "image/png":"png",
      "image/webp":"webp",
      "image/gif":"gif",
      "video/mp4":"mp4",
      "video/webm":"webm",
      "video/quicktime":"mov",
      "audio/webm":"webm",
      "audio/ogg":"ogg",
      "audio/mp4":"m4a",
      "audio/mpeg":"mp3",
      "audio/wav":"wav",
      "audio/aac":"aac",
      "audio/x-m4a":"m4a"
    };

    const clean=
      storyReplyMime(mime);

    if(map[clean])return map[clean];

    const match=
      String(name||"")
        .match(
          /\.([a-z0-9]{1,6})$/i
        );

    return match
      ? match[1].toLowerCase()
      : "bin";
  }

  function storyReplyRandomId(){
    try{
      return crypto.randomUUID();
    }
    catch(_){
      return (
        Date.now().toString(36)+
        "-"+
        Math.random().toString(36).slice(2)
      );
    }
  }

  function setStoryReplyBusy(value){
    storyReplyBusy=!!value;

    if(!root)return;

    root
      .querySelectorAll(
        ".ssv-reply button,.ssv-reply input"
      )
      .forEach(
        element=>{
          if(
            element.classList.contains("ssv-media-input")
          ){
            element.disabled=storyReplyBusy;
            return;
          }

          if(
            element.classList.contains("ssv-mic") &&
            storyReplyRecorder?.state==="recording"
          ){
            element.disabled=false;
            return;
          }

          element.disabled=storyReplyBusy;
        }
      );
  }

  function stopStoryReplyMicTracks(){
    if(!storyReplyMicStream)return;

    try{
      storyReplyMicStream
        .getTracks()
        .forEach(
          track=>track.stop()
        );
    }
    catch(_){}

    storyReplyMicStream=null;
  }

  function clearStoryReplyVoiceTimer(){
    clearInterval(
      storyReplyVoiceTimer
    );

    storyReplyVoiceTimer=0;
  }

  function resetStoryReplyVoiceUi(){
    if(!root)return;

    const mic=
      root.querySelector(
        ".ssv-mic"
      );

    const timer=
      root.querySelector(
        ".ssv-mic-time"
      );

    mic?.classList.remove(
      "is-recording"
    );

    if(mic){
      mic.textContent="🎤";
      mic.setAttribute(
        "aria-label",
        "Voice message"
      );
    }

    timer?.classList.remove(
      "visible"
    );

    if(timer){
      timer.textContent="0:00";
    }
  }

  function discardStoryReplyVoice(){
    storyReplyVoiceDiscard=true;
    clearStoryReplyVoiceTimer();

    if(
      storyReplyRecorder &&
      storyReplyRecorder.state!=="inactive"
    ){
      try{
        storyReplyRecorder.stop();
      }
      catch(_){}
    }

    storyReplyRecorder=null;
    storyReplyVoiceChunks=[];
    storyReplyVoiceStartedAt=0;
    stopStoryReplyMicTracks();
    resetStoryReplyVoiceUi();
  }

  async function storyReplyConversation(){
    const c=
      getClient();

    const story=
      stories[currentIndex];

    if(!c||!story){
      throw new Error(
        "Story is unavailable."
      );
    }

    const auth=
      await c.auth.getUser();

    const signedUser=
      auth?.data?.user||
      null;

    if(!signedUser){
      currentSignedIn=false;
      renderHeader();
      window.Ma7alakAccount?.open?.();
      const error=new Error(
        "Sign in with Google to reply."
      );
      error.login_required=true;
      throw error;
    }

    if(currentOwner){
      throw new Error(
        "You cannot reply to your own Story."
      );
    }

    const slug=
      String(
        story.shop_slug||
        profile?.shop_slug||
        ""
      ).trim();

    if(!slug){
      throw new Error(
        "Story shop is unavailable."
      );
    }

    const acceptsResult=
      await c.rpc(
        "ma7alak_shop_accepts_messages",
        {
          p_shop_slug:slug
        }
      );

    if(
      !acceptsResult.error &&
      acceptsResult.data===false
    ){
      throw new Error(
        "This shop is not accepting messages right now."
      );
    }

    const conversationResult=
      await c.rpc(
        "ma7alak_start_conversation",
        {
          p_shop_slug:slug
        }
      );

    if(conversationResult.error){
      const message=
        String(
          conversationResult.error.message||
          ""
        );

      if(message.includes("CHAT_BLOCKED")){
        throw new Error(
          "This shop has blocked this chat."
        );
      }

      throw conversationResult.error;
    }

    const conversation=
      Array.isArray(
        conversationResult.data
      )
        ? conversationResult.data[0]
        : conversationResult.data;

    if(!conversation?.id){
      throw new Error(
        "Could not open this conversation."
      );
    }

    return {
      client:c,
      user:signedUser,
      story:story,
      slug:slug,
      conversation:conversation
    };
  }

  async function compressStoryReplyImage(file){
    if(
      !file ||
      !String(file.type||"").startsWith("image/") ||
      file.size<=2097152 ||
      file.type==="image/gif"
    ){
      return file;
    }

    let url="";

    try{
      url=URL.createObjectURL(file);

      const image=new Image();
      image.decoding="async";

      await new Promise(
        (resolve,reject)=>{
          image.onload=resolve;
          image.onerror=reject;
          image.src=url;
        }
      );

      const max=1600;
      const scale=
        Math.min(
          1,
          max/
          Math.max(
            image.naturalWidth||1,
            image.naturalHeight||1
          )
        );

      const canvas=
        document.createElement(
          "canvas"
        );

      canvas.width=
        Math.max(
          1,
          Math.round(
            (image.naturalWidth||1)*
            scale
          )
        );

      canvas.height=
        Math.max(
          1,
          Math.round(
            (image.naturalHeight||1)*
            scale
          )
        );

      const context=
        canvas.getContext(
          "2d",
          {alpha:false}
        );

      context.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const blob=
        await new Promise(
          resolve=>
            canvas.toBlob(
              resolve,
              "image/webp",
              .82
            )
        );

      if(
        blob &&
        blob.size>0 &&
        blob.size<file.size
      ){
        return blob;
      }
    }
    catch(error){
      console.warn(
        "Story reply image compression:",
        error
      );
    }
    finally{
      try{
        if(url)URL.revokeObjectURL(url);
      }
      catch(_){}
    }

    return file;
  }

  function storyReplyContext(story,extra){
    return {
      story_reply:true,
      story_id:String(story?.id||""),
      shop_slug:String(story?.shop_slug||profile?.shop_slug||""),
      story_expires_at:String(story?.expires_at||""),
      story_media_type:String(story?.media_type||""),
      story_storage_path:String(story?.storage_path||""),
      story_status_text:String(story?.status_text||""),
      story_created_at:String(story?.created_at||""),
      shop_name:String(profile?.shop_name||""),
      shop_url:String(profile?.shop_url||""),
      ...(extra&&typeof extra==="object"?extra:{})
    };
  }

  async function uploadStoryReplyMedia(type,blob,mime,name,extra){
    if(storyReplyBusy)return false;

    setStoryReplyBusy(true);
    pauseStoryPlayback();

    let uploadedPath="";

    try{
      const state=
        await storyReplyConversation();

      const cleanMime=
        storyReplyMime(
          mime||
          blob?.type
        );

      const path=
        String(
          state.conversation.id
        )+
        "/"+
        String(
          state.user.id
        )+
        "/"+
        Date.now()+
        "-"+
        storyReplyRandomId()+
        "."+
        storyReplyExt(
          cleanMime,
          name
        );

      uploadedPath=path;

      const upload=
        await state.client
          .storage
          .from(
            "chat-media"
          )
          .upload(
            path,
            blob,
            {
              contentType:cleanMime,
              upsert:false,
              cacheControl:"3600"
            }
          );

      if(upload.error){
        throw upload.error;
      }

      const context=
        storyReplyContext(
          state.story,
          extra
        );

      const sent=
        await state.client.rpc(
          "ma7alak_send_media_message",
          {
            p_conversation_id:
              state.conversation.id,
            p_message_type:
              type,
            p_storage_path:
              path,
            p_body:
              null,
            p_context:
              context
          }
        );

      if(sent.error){
        try{
          await state.client
            .storage
            .from(
              "chat-media"
            )
            .remove(
              [path]
            );
        }
        catch(_){}

        throw sent.error;
      }

      try{
        window.dispatchEvent(
          new Event(
            "ma7alak:messages-read"
          )
        );
      }
      catch(_){}

      flash(
        type==="voice"
          ? "Voice sent ✓"
          : type==="image"
            ? "Photo sent ✓"
            : "Video sent ✓"
      );

      return true;
    }
    catch(error){
      console.warn(
        "Story media reply:",
        error
      );

      flash(
        error?.message||
        "Could not send media."
      );

      return false;
    }
    finally{
      setStoryReplyBusy(false);
      resumeStoryPlayback();
    }
  }

  async function sendStoryReplyFile(file){
    if(!file)return false;

    let type="";
    const mime=
      storyReplyMime(
        file.type
      );

    if(
      String(file.type||"")
        .startsWith("image/")
    ){
      type="image";
    }
    else if(
      [
        "video/mp4",
        "video/webm",
        "video/quicktime"
      ].includes(mime)
    ){
      type="video";
    }
    else{
      flash(
        "Choose a photo or MP4/WebM/MOV video."
      );
      return false;
    }

    let blob=file;

    if(type==="image"){
      blob=
        await compressStoryReplyImage(
          file
        );
    }

    if(
      type==="image" &&
      blob.size>8388608
    ){
      flash(
        "Photo must be 8 MB or smaller."
      );
      return false;
    }

    if(
      type==="video" &&
      blob.size>26214400
    ){
      flash(
        "Video must be 25 MB or smaller."
      );
      return false;
    }

    return uploadStoryReplyMedia(
      type,
      blob,
      storyReplyMime(
        blob.type||
        file.type
      ),
      file.name||
      type,
      {
        original_name:
          String(
            file.name||
            ""
          ).slice(0,180)
      }
    );
  }

  function storyReplyVoiceMimeChoice(){
    if(!window.MediaRecorder)return "";

    const choices=[
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus"
    ];

    for(const choice of choices){
      try{
        if(
          MediaRecorder.isTypeSupported(
            choice
          )
        ){
          return choice;
        }
      }
      catch(_){}
    }

    return "";
  }

  async function startStoryReplyVoice(){
    if(
      storyReplyBusy ||
      storyReplyRecorder?.state==="recording"
    ){
      return;
    }

    if(
      !navigator.mediaDevices?.getUserMedia ||
      !window.MediaRecorder
    ){
      flash(
        "Voice messages are not supported by this browser."
      );
      return;
    }

    try{
      /*
        Validate login/ownership/message availability before asking for mic.
      */
      await storyReplyConversation();

      storyReplyVoiceDiscard=false;
      storyReplyVoiceChunks=[];

      storyReplyMicStream=
        await navigator.mediaDevices.getUserMedia(
          {
            audio:{
              echoCancellation:true,
              noiseSuppression:true,
              autoGainControl:true
            }
          }
        );

      const choice=
        storyReplyVoiceMimeChoice();

      const options=
        choice
          ? {
              mimeType:choice,
              audioBitsPerSecond:64000
            }
          : {
              audioBitsPerSecond:64000
            };

      storyReplyRecorder=
        new MediaRecorder(
          storyReplyMicStream,
          options
        );

      storyReplyVoiceStartedAt=
        Date.now();

      storyReplyRecorder.ondataavailable=
        event=>{
          if(
            event.data &&
            event.data.size
          ){
            storyReplyVoiceChunks.push(
              event.data
            );
          }
        };

      storyReplyRecorder.onstop=
        async ()=>{
          const recorder=
            storyReplyRecorder;

          storyReplyRecorder=null;
          clearStoryReplyVoiceTimer();
          stopStoryReplyMicTracks();

          const discard=
            storyReplyVoiceDiscard;

          storyReplyVoiceDiscard=false;

          const duration=
            Math.max(
              1,
              (
                Date.now()-
                storyReplyVoiceStartedAt
              )/
              1000
            );

          storyReplyVoiceStartedAt=0;

          const mime=
            storyReplyMime(
              recorder?.mimeType||
              choice||
              storyReplyVoiceChunks[0]?.type||
              "audio/webm"
            )||
            "audio/webm";

          const blob=
            new Blob(
              storyReplyVoiceChunks,
              {type:mime}
            );

          storyReplyVoiceChunks=[];
          resetStoryReplyVoiceUi();

          if(discard){
            resumeStoryPlayback();
            return;
          }

          if(blob.size<700){
            flash(
              "Voice message was too short."
            );
            resumeStoryPlayback();
            return;
          }

          if(blob.size>10485760){
            flash(
              "Voice message is too large."
            );
            resumeStoryPlayback();
            return;
          }

          await uploadStoryReplyMedia(
            "voice",
            blob,
            mime,
            "voice."+
            storyReplyExt(mime),
            {
              duration:
                Number(
                  duration.toFixed(2)
                )
            }
          );
        };

      storyReplyRecorder.start(
        250
      );

      pauseStoryPlayback();

      const mic=
        root?.querySelector(
          ".ssv-mic"
        );

      const timer=
        root?.querySelector(
          ".ssv-mic-time"
        );

      mic?.classList.add(
        "is-recording"
      );

      if(mic){
        mic.textContent="■";
        mic.setAttribute(
          "aria-label",
          "Stop and send voice message"
        );
      }

      timer?.classList.add(
        "visible"
      );

      clearStoryReplyVoiceTimer();

      storyReplyVoiceTimer=
        setInterval(
          ()=>{
            const seconds=
              Math.max(
                0,
                (
                  Date.now()-
                  storyReplyVoiceStartedAt
                )/
                1000
              );

            if(timer){
              timer.textContent=
                storyReplyFormatDuration(
                  seconds
                );
            }

            if(seconds>=120){
              stopStoryReplyVoice(
                false
              );
            }
          },
          250
        );
    }
    catch(error){
      stopStoryReplyMicTracks();
      storyReplyRecorder=null;
      clearStoryReplyVoiceTimer();
      resetStoryReplyVoiceUi();

      console.warn(
        "Story voice reply:",
        error
      );

      flash(
        error?.message||
        "Microphone permission is required."
      );
    }
  }

  function stopStoryReplyVoice(discard){
    if(
      !storyReplyRecorder ||
      storyReplyRecorder.state==="inactive"
    ){
      return;
    }

    storyReplyVoiceDiscard=
      !!discard;

    try{
      storyReplyRecorder.stop();
    }
    catch(_){
      discardStoryReplyVoice();
    }
  }

  function ensureRoot(){
    injectStyle();

    root=
      document.getElementById(
        ROOT_ID
      );

    if(root){
      return root;
    }

    root=
      document.createElement(
        "div"
      );

    root.id=
      ROOT_ID;

    root.hidden=
      true;

    root.setAttribute(
      "role",
      "dialog"
    );

    root.setAttribute(
      "aria-modal",
      "true"
    );

    root.innerHTML=`
      <div class="ssv-frame">
        <div class="ssv-loading">Loading Story…</div>
        <div class="ssv-media-host"></div>

        <div class="ssv-top">
          <div class="ssv-bars"></div>

          <div class="ssv-head-row">

            <button
              type="button"
              class="ssv-shop-avatar"
              aria-label="Open shop page"
            ></button>

            <div class="ssv-copy">
              <b class="ssv-name"></b>
              <span class="ssv-time"></span>
              <span class="ssv-status"></span>
            </div>

            <span
              class="ssv-owner-views"
              title="Story views"
            >
              ◉ <b>0</b>
            </span>

            <button
              type="button"
              class="ssv-close"
              aria-label="Close Story"
            >
              ×
            </button>

          </div>
        </div>

        <button
          type="button"
          class="ssv-nav ssv-prev"
          aria-label="Previous Story"
        >
          Previous
        </button>

        <button
          type="button"
          class="ssv-nav ssv-next"
          aria-label="Next Story"
        >
          Next
        </button>

        <div class="ssv-bottom">

          <button
            type="button"
            class="ssv-like"
            aria-label="Like Story"
          >
            ♡
          </button>

          <form class="ssv-reply">

            <input
              class="ssv-reply-text"
              type="text"
              maxlength="2000"
              autocomplete="off"
              enterkeyhint="send"
              placeholder="Reply to story…"
              aria-label="Reply to Story"
            >

            <button
              type="submit"
              class="ssv-send"
            >
              Send
            </button>

          </form>

        </div>

        <div
          class="ssv-feedback"
          role="status"
          aria-live="polite"
        ></div>

      </div>
    `;

    document.body.appendChild(
      root
    );

    root
      .querySelector(
        ".ssv-close"
      )
      .onclick=
        ()=>
          close();

    root
      .querySelector(
        ".ssv-prev"
      )
      .onclick=
        event=>{
          event.preventDefault();
          event.stopPropagation();
          previous();
        };

    root
      .querySelector(
        ".ssv-next"
      )
      .onclick=
        event=>{
          event.preventDefault();
          event.stopPropagation();
          next();
        };

    root
      .querySelector(
        ".ssv-shop-avatar"
      )
      .onclick=
        event=>{
          event.preventDefault();
          event.stopPropagation();
          goShop();
        };

    root
      .querySelector(
        ".ssv-like"
      )
      .onclick=
        event=>{
          event.preventDefault();
          event.stopPropagation();
          likeCurrent();
        };

    root
      .querySelector(
        ".ssv-reply"
      )
      .onsubmit=
        event=>{
          event.preventDefault();
          event.stopPropagation();
          replyCurrent();
        };

    const replyInput=
      root.querySelector(
        ".ssv-reply-text"
      );

    replyInput.setAttribute(
      "enterkeyhint",
      "send"
    );

    replyInput.addEventListener(
      "focus",
      ()=>{
        replyKeyboardLockOffset=0;
        pauseStoryPlayback();
        scheduleVisualViewportSync();
        [40,100,180,300,460].forEach(delay=>{
          setTimeout(()=>{
            if(document.activeElement===replyInput){
              scheduleVisualViewportSync();
            }
          },delay);
        });
      }
    );

    replyInput.addEventListener(
      "blur",
      ()=>{
        replyKeyboardLockOffset=0;
        resumeStoryPlayback();
        scheduleVisualViewportSync();
      }
    );

    replyInput.addEventListener(
      "keydown",
      event=>{
        event.stopPropagation();
      }
    );

    root.addEventListener(
      "touchstart",
      event=>{

        if(
          event.target.closest(
            "button,input,form"
          )
        ){
          return;
        }

        touchX=
          event.touches?.[0]?.clientX||
          0;

        touchY=
          event.touches?.[0]?.clientY||
          0;

      },
      {
        passive:true
      }
    );

    root.addEventListener(
      "touchend",
      event=>{

        if(
          event.target.closest(
            "button,input,form"
          )
        ){
          return;
        }

        const x=
          event.changedTouches?.[0]?.clientX||
          0;

        const y=
          event.changedTouches?.[0]?.clientY||
          0;

        const dx=
          x-
          touchX;

        const dy=
          y-
          touchY;

        if(
          Math.abs(dx)>
          65 &&
          Math.abs(dx)>
          Math.abs(dy)*
          1.1
        ){

          if(dx<0){
            next();
          }
          else{
            previous();
          }

        }

      },
      {
        passive:true
      }
    );

    return root;
  }

  function flash(message){
    const box=
      ensureRoot()
        .querySelector(
          ".ssv-feedback"
        );

    box.textContent=
      String(
        message||
        ""
      );

    box.classList.add(
      "show"
    );

    clearTimeout(
      box.__timer
    );

    box.__timer=
      setTimeout(
        ()=>
          box.classList.remove(
            "show"
          ),
        2200
      );
  }

  function armStoryAdvance(delayMs){
    clearTimeout(
      mediaTimer
    );

    mediaTimer=0;

    storyClockRemainingMs=
      Math.max(
        0,
        Number(delayMs)||
        0
      );

    storyClockStartedAt=
      performance.now();

    if(
      !storyPaused &&
      storyClockRemainingMs>
      0
    ){
      mediaTimer=
        setTimeout(
          next,
          storyClockRemainingMs
        );
    }
  }

  function pauseStoryPlayback(){
    if(
      storyPaused ||
      !root ||
      root.hidden
    ){
      return;
    }

    storyPaused=true;

    root.classList.add(
      "is-paused"
    );

    if(mediaTimer){
      clearTimeout(
        mediaTimer
      );

      mediaTimer=0;

      const elapsed=
        Math.max(
          0,
          performance.now()-
          storyClockStartedAt
        );

      storyClockRemainingMs=
        Math.max(
          0,
          storyClockRemainingMs-
          elapsed
        );
    }

    const video=
      root.querySelector(
        ".ssv-media-host video"
      );

    if(video){
      try{
        video.pause();
      }
      catch(_){}
    }
  }

  function resumeStoryPlayback(){
    if(
      !storyPaused ||
      !root ||
      root.hidden
    ){
      return;
    }

    storyPaused=false;

    root.classList.remove(
      "is-paused"
    );

    if(
      storyClockRemainingMs>
      0
    ){
      storyClockStartedAt=
        performance.now();

      mediaTimer=
        setTimeout(
          next,
          storyClockRemainingMs
        );
    }

    const video=
      root.querySelector(
        ".ssv-media-host video"
      );

    if(video){
      video
        .play()
        .catch(
          ()=>{}
        );
    }
  }

  function stopMedia(){
    clearTimeout(
      mediaTimer
    );

    mediaTimer=0;
    storyClockRemainingMs=0;
    storyClockStartedAt=0;
    storyPaused=false;

    root?.classList.remove(
      "is-paused"
    );

    const video=
      root?.querySelector(
        ".ssv-media-host video"
      );

    if(video){
      try{
        video.pause();
      }
      catch(_){}
    }
  }

  function exitFullscreen(){
    try{
      const active=
        document.fullscreenElement||
        document.webkitFullscreenElement;

      if(
        !active ||
        active!==root
      ){
        return;
      }

      const exit=
        document.exitFullscreen||
        document.webkitExitFullscreen;

      if(
        typeof exit===
        "function"
      ){
        const result=
          exit.call(
            document
          );

        if(
          result &&
          typeof result.catch===
          "function"
        ){
          result.catch(
            ()=>{}
          );
        }
      }
    }
    catch(_){}
  }

  function close(fromHistory){
    if(
      !root ||
      root.hidden
    ){
      return;
    }

    stopMedia();
    discardStoryReplyVoice();

    loadToken++;

    root.hidden=
      true;

    root.classList.remove(
      "is-owner"
    );

    root.classList.remove(
      "is-logged-out"
    );

    root.classList.remove(
      "is-paused"
    );

    root.classList.remove(
      "is-keyboard-open"
    );

    root.style.setProperty(
      "--ssv-keyboard-offset",
      "0px"
    );

    clearTimeout(
      replyViewportSyncTimer
    );

    replyViewportSyncTimer=0;

    root
      .querySelector(
        ".ssv-media-host"
      )
      ?.replaceChildren();

    document
      .documentElement
      .classList
      .remove(
        "ssv-open"
      );

    document
      .body
      ?.classList
      .remove(
        "ssv-open"
      );

    if(
      storyChannel &&
      getClient()
        ?.removeChannel
    ){
      try{
        getClient()
          .removeChannel(
            storyChannel
          );
      }
      catch(_){}
    }

    storyChannel=
      null;

    exitFullscreen();

    if(
      !fromHistory &&
      historyArmed &&
      history.state
        ?.shoufhonSharedStory
    ){
      historyArmed=
        false;

      history.back();
    }
    else{
      historyArmed=
        false;
    }
  }

  function armHistory(){
    try{
      const nextState={
        ...(history.state||{}),
        shoufhonSharedStory:true
      };

      /*
        If a header panel already owns the current phone-history entry,
        convert that entry into the Story entry instead of leaving a hidden
        panel entry underneath the Story.
      */
      if(
        Object.prototype.hasOwnProperty.call(
          nextState,
          "shoufhonUiPanel"
        )
      ){
        delete nextState.shoufhonUiPanel;
        history.replaceState(nextState,"");
        try{window.dispatchEvent(new Event("ma7alak:panel-history-replaced-by-content"))}catch(_){}
      }
      else{
        history.pushState(nextState,"");
      }

      historyArmed=true;
    }
    catch(_){
      historyArmed=false;
    }
  }

  function requestFullscreen(){
    try{
      const request=
        root?.requestFullscreen||
        root?.webkitRequestFullscreen;

      if(
        typeof request===
        "function"
      ){
        const result=
          request.call(
            root,
            {
              navigationUI:"hide"
            }
          );

        if(
          result &&
          typeof result.catch===
          "function"
        ){
          result.catch(
            ()=>{}
          );
        }
      }
    }
    catch(_){}
  }

  function markSeen(
    slug,
    list
  ){
    const latest=
      (list||[])
        .reduce(
          (
            best,
            story
          )=>
            new Date(
              story.created_at||
              0
            )>
            new Date(
              best||
              0
            )
              ? story.created_at
              : best,
          ""
        );

    if(latest){
      try{
        localStorage.setItem(
          "ma7alak_story_seen_"+
          slug,
          latest
        );
      }
      catch(_){}
    }

    try{
      window.dispatchEvent(
        new CustomEvent(
          "ma7alak:story-seen",
          {
            detail:{
              shop_slug:
                slug,
              created_at:
                latest
            }
          }
        )
      );
    }
    catch(_){}
  }

  async function ownerFor(slug){
    const known=
      String(
        window
          .Ma7alakOwnerAuth
          ?.owner
          ?.shop_slug||
        ""
      )
        .trim()
        .toLowerCase();

    const c=
      getClient();

    if(
      !c?.auth
    ){
      currentSignedIn=
        !!known;

      return (
        !!known &&
        known===
        String(
          slug||
          ""
        )
          .trim()
          .toLowerCase()
      );
    }

    try{
      const user=
        (
          await c
            .auth
            .getUser()
        )
          .data
          ?.user;

      currentSignedIn=
        !!user;

      if(!user){
        return false;
      }

      if(known){
        return (
          known===
          String(
            slug||
            ""
          )
            .trim()
            .toLowerCase()
        );
      }

      const result=
        await c
          .from(
            "shop_owners"
          )
          .select(
            "shop_slug"
          )
          .eq(
            "user_id",
            user.id
          )
          .eq(
            "shop_slug",
            slug
          )
          .maybeSingle();

      return (
        !result.error &&
        !!result.data
      );
    }
    catch(_){
      currentSignedIn=
        !!known;

      return (
        !!known &&
        known===
        String(
          slug||
          ""
        )
          .trim()
          .toLowerCase()
      );
    }
  }

  function shopTarget(){
    const raw=
      String(
        profile?.shop_url||
        ""
      ).trim();

    if(raw){
      return raw;
    }

    const slug=
      String(
        profile?.shop_slug||
        stories[currentIndex]
          ?.shop_slug||
        ""
      ).trim();

    return slug
      ? (
          "/"+
          encodeURIComponent(
            slug
          )
        )
      : "/";
  }

  function renderHeader(){
    if(!root){
      return;
    }

    const story=
      stories[
        currentIndex
      ]||
      {};

    const slug=
      String(
        story.shop_slug||
        profile?.shop_slug||
        ""
      );

    const name=
      String(
        profile?.shop_name||
        slug||
        "Story"
      );

    const image=
      String(
        profile?.story_logo_url||
        profile?.profile_image_url||
        ""
      ).trim();

    const avatar=
      root.querySelector(
        ".ssv-shop-avatar"
      );

    avatar.innerHTML=
      image
        ? (
            '<img src="'+
            esc(
              image
            )+
            '" alt="">'
          )
        : (
            "<span>"+
            esc(
              name
                .slice(
                  0,
                  1
                )
                .toUpperCase()
            )+
            "</span>"
          );

    root
      .querySelector(
        ".ssv-name"
      )
      .textContent=
        name;

    root
      .querySelector(
        ".ssv-time"
      )
      .textContent=
        storyTimeAgo(
          story.created_at
        );

    root
      .querySelector(
        ".ssv-status"
      )
      .textContent=
        String(
          story.status_text||
          ""
        );

    root.classList.toggle(
      "is-owner",
      currentOwner
    );

    root.classList.toggle(
      "is-logged-out",
      !currentSignedIn
    );

    const liked=
      isLocallyLiked(
        story.id
      );

    const like=
      root.querySelector(
        ".ssv-like"
      );

    like.classList.toggle(
      "is-liked",
      liked
    );

    like.textContent=
      liked
        ? "♥"
        : "♡";

    like.disabled=
      currentOwner;

    root
      .querySelector(
        ".ssv-reply-text"
      )
      .disabled=
        (
          currentOwner ||
          !currentSignedIn
        );

    root
      .querySelector(
        ".ssv-send"
      )
      .disabled=
        (
          currentOwner ||
          !currentSignedIn
        );
  }

  function renderBars(duration){
    const box=
      root.querySelector(
        ".ssv-bars"
      );

    box.innerHTML=
      stories
        .map(
          (
            _,
            index
          )=>
            (
              '<span class="ssv-bar '+
              (
                index<
                currentIndex
                  ? "done"
                  : (
                      index===
                      currentIndex
                        ? "active"
                        : ""
                    )
              )+
              '"><i></i></span>'
            )
        )
        .join("");

    box.style.setProperty(
      "--ssv-duration",
      Math.max(
        .5,
        duration||
        6
      )+
      "s"
    );
  }

  async function recordView(story){
    const c=
      getClient();

    if(
      !c ||
      !story?.id
    ){
      return;
    }

    try{
      await c.rpc(
        "record_story_view_secure",
        {
          p_story_id:
            Number(
              story.id
            ),
          p_shop_slug:
            String(
              story.shop_slug||
              ""
            ),
          p_visitor_id:
            visitorId(),
          p_interaction_token:
            interactionToken()
        }
      );

      if(currentOwner){

        const result=
          await c.rpc(
            "get_story_view_count",
            {
              p_story_id:
                Number(
                  story.id
                ),
              p_shop_slug:
                String(
                  story.shop_slug||
                  ""
                )
            }
          );

        if(
          !result.error &&
          root &&
          !root.hidden &&
          String(
            stories[
              currentIndex
            ]?.id
          )===
          String(
            story.id
          )
        ){

          root
            .querySelector(
              ".ssv-owner-views b"
            )
            .textContent=
              String(
                Number(
                  result.data
                )||
                0
              );

        }
      }
    }
    catch(error){
      console.warn(
        "ShoufHon Story view:",
        error
      );
    }
  }

  async function likeCurrent(){
    if(currentOwner){
      return;
    }

    const story=
      stories[
        currentIndex
      ];

    if(
      !story?.id
    ){
      return;
    }

    const button=
      root.querySelector(
        ".ssv-like"
      );

    button.disabled=
      true;

    try{
      const c=
        getClient();

      if(!c){
        throw new Error(
          "Connection unavailable."
        );
      }

      const result=
        await c.rpc(
          "like_story_secure",
          {
            p_story_id:
              Number(
                story.id
              ),
            p_visitor_id:
              visitorId(),
            p_interaction_token:
              interactionToken()
          }
        );

      if(result.error){
        throw result.error;
      }

      const data=
        result.data||
        {};

      if(
        data.blocked &&
        !data.success
      ){
        throw new Error(
          data.message||
          "Could not like Story."
        );
      }

      if(
        data.success!==
        false
      ){
        const wasLiked=isLocallyLiked(story.id);

        markLocallyLiked(
          story.id
        );

        button.classList.add(
          "is-liked"
        );

        button.textContent=
          "♥";

        if(!wasLiked){
          launchLikeHearts();
        }

        flash(
          data.already_liked
            ? "Already liked"
            : "Story liked ♥"
        );
      }
      else{
        throw new Error(
          data.message||
          "Could not like Story."
        );
      }
    }
    catch(error){
      flash(
        error?.message||
        "Could not like Story."
      );
    }
    finally{
      button.disabled=
        currentOwner;
    }
  }

  function siblingUrl(file){
    try{
      return new URL(
        file,
        SCRIPT_SRC||
        location.href
      ).href;
    }
    catch(_){
      return file;
    }
  }

  async function ensureChat(){
    if(
      window.Ma7alakChat
        ?.sendStoryReply
    ){
      return window.Ma7alakChat;
    }

    if(
      window
        .__shoufhonChatLoadingPromise
    ){
      return window
        .__shoufhonChatLoadingPromise;
    }

    window
      .__shoufhonChatLoadingPromise=
        new Promise(
          function(resolve){

            const existing=
              Array.from(
                document.scripts
              )
                .find(
                  function(script){
                    return /ma7alak-chat\.js(?:$|[?#])/.test(
                      script.src||
                      ""
                    );
                  }
                );

            if(existing){

              let tries=0;

              const wait=
                function(){

                  if(
                    window
                      .Ma7alakChat
                      ?.sendStoryReply
                  ){
                    resolve(
                      window
                        .Ma7alakChat
                    );
                    return;
                  }

                  tries++;

                  if(
                    tries<
                    100
                  ){
                    setTimeout(
                      wait,
                      50
                    );
                  }
                  else{
                    resolve(
                      null
                    );
                  }

                };

              wait();

              return;
            }

            const script=
              document.createElement(
                "script"
              );

            script.src=
              siblingUrl(
                "ma7alak-chat.js"
              );

            script.onload=
              function(){
                resolve(
                  window
                    .Ma7alakChat||
                  null
                );
              };

            script.onerror=
              function(){
                resolve(
                  null
                );
              };

            document
              .head
              .appendChild(
                script
              );

          }
        );

    return window
      .__shoufhonChatLoadingPromise;
  }

  async function replyCurrent(){
    if(
      currentOwner ||
      !currentSignedIn
    ){
      return;
    }

    const c=
      getClient();

    try{
      const user=
        (
          await c
            ?.auth
            ?.getUser?.()
        )
          ?.data
          ?.user;

      if(!user){
        currentSignedIn=false;
        renderHeader();
        return;
      }
    }
    catch(_){
      currentSignedIn=false;
      renderHeader();
      return;
    }

    const story=
      stories[
        currentIndex
      ];

    const input=
      root.querySelector(
        ".ssv-reply-text"
      );

    const send=
      root.querySelector(
        ".ssv-send"
      );

    const body=
      String(
        input.value||
        ""
      ).trim();

    if(!body){
      flash(
        "Write a reply first."
      );
      return;
    }

    send.disabled=
      true;

    try{
      const chat=
        await ensureChat();

      if(
        !chat?.sendStoryReply
      ){
        throw new Error(
          "Messages are unavailable right now."
        );
      }

      const result=
        await chat
          .sendStoryReply({
            story_id:
              Number(
                story.id
              ),
            shop_slug:
              String(
                story.shop_slug||
                ""
              ),
            body:
              body
          });

      if(
        result?.ok
      ){
        input.value=
          "";

        input.blur();
        resumeStoryPlayback();
        scheduleVisualViewportSync();

        flash(
          "Reply sent ✓"
        );

        return;
      }

      if(
        result
          ?.login_required
      ){
        close();

        setTimeout(
          ()=>
            window
              .Ma7alakAccount
              ?.open?.(),
          100
        );

        return;
      }

      throw new Error(
        result?.error||
        "Could not send reply."
      );
    }
    catch(error){
      flash(
        error?.message||
        "Could not send reply."
      );
    }
    finally{
      if(
        root &&
        !root.hidden
      ){
        send.disabled=
          currentOwner;
      }
    }
  }

  function goShop(){
    const target=
      shopTarget();

    close(
      true
    );

    setTimeout(
      ()=>{
        try{
          window.location.href=
            new URL(
              target,
              window.location.origin
            ).toString();
        }
        catch(_){
          window.location.href=
            target;
        }
      },
      40
    );
  }

  function next(){
    if(
      currentIndex+
      1>=
      stories.length
    ){
      close();
      return;
    }

    currentIndex++;

    showCurrent();
  }

  function previous(){
    if(
      currentIndex<=
      0
    ){
      currentIndex=
        0;

      showCurrent();

      return;
    }

    currentIndex--;

    showCurrent();
  }

  function showCurrent(){
    stopMedia();

    if(storyReplyRecorder?.state==="recording"){
      discardStoryReplyVoice();
    }

    let story=
      stories[
        currentIndex
      ];

    if(
      !story ||
      new Date(
        story.expires_at||
        0
      ).getTime()<=
      Date.now()
    ){

      stories=
        stories.filter(
          item=>
            new Date(
              item.expires_at||
              0
            ).getTime()>
            Date.now()
        );

      if(
        !stories.length
      ){
        close();
        return;
      }

      currentIndex=
        Math.min(
          currentIndex,
          stories.length-
          1
        );

      story=
        stories[
          currentIndex
        ];
    }

    const host=
      root.querySelector(
        ".ssv-media-host"
      );

    const loading=
      root.querySelector(
        ".ssv-loading"
      );

    loading.hidden=
      false;

    host.replaceChildren();

    renderHeader();

    const url=
      mediaUrl(
        story
      );

    if(
      !/^https:\/\//i.test(
        url
      )
    ){
      flash(
        "Story media is unavailable."
      );

      next();

      return;
    }

    const media=
      document.createElement(
        story.media_type===
        "video"
          ? "video"
          : "img"
      );

    media.className=
      "ssv-media";

    media.src=
      url;

    if(
      media.tagName===
      "VIDEO"
    ){

      media.autoplay=
        true;

      media.playsInline=
        true;

      media.controls=
        false;

      media.preload=
        "auto";

      media.onloadedmetadata=
        ()=>{

          const duration=
            Math.max(
              .6,
              Math.min(
                30,
                Number(
                  media.duration
                )||
                15
              )
            );

          renderBars(
            duration
          );

          armStoryAdvance(
            duration*
            1000
          );

          if(storyPaused){
            try{
              media.pause();
            }
            catch(_){}
          }

          loading.hidden=
            true;

        };

      media.onended=
        next;

      media.onerror=
        next;

      host.appendChild(
        media
      );

      renderBars(
        15
      );

      loading.hidden=
        true;

      media
        .play()
        .catch(
          ()=>{
            media.controls=
              true;
          }
        );

      armStoryAdvance(
        30000
      );

    }
    else{

      media.onload=
        ()=>{
          loading.hidden=
            true;
        };

      media.onerror=
        next;

      host.appendChild(
        media
      );

      renderBars(
        6
      );

      armStoryAdvance(
        6000
      );

    }

    recordView(
      story
    );

    if(
      document.activeElement===
      root.querySelector(
        ".ssv-reply-text"
      )
    ){
      pauseStoryPlayback();
    }
  }

  async function loadStories(slug){
    const c=
      getClient();

    if(!c){
      throw new Error(
        "Connection unavailable."
      );
    }

    const [
      storyResult,
      profileResult
    ]=
      await Promise.all([
        c
          .from(
            "shop_stories"
          )
          .select(
            "id,shop_slug,media_type,storage_path,status_text,created_at,expires_at"
          )
          .eq(
            "shop_slug",
            slug
          )
          .gt(
            "expires_at",
            new Date()
              .toISOString()
          )
          .order(
            "created_at",
            {
              ascending:true
            }
          ),

        c
          .from(
            "shop_profiles"
          )
          .select(
            "shop_slug,shop_name,profile_image_url,story_logo_url,shop_url"
          )
          .eq(
            "shop_slug",
            slug
          )
          .maybeSingle()
      ]);

    if(
      storyResult.error
    ){
      throw storyResult.error;
    }

    if(
      profileResult.error
    ){
      throw profileResult.error;
    }

    return {
      stories:
        storyResult.data||
        [],
      profile:
        profileResult.data||
        {
          shop_slug:
            slug
        }
    };
  }

  function subscribe(slug){
    const c=
      getClient();

    if(
      storyChannel &&
      c?.removeChannel
    ){
      try{
        c.removeChannel(
          storyChannel
        );
      }
      catch(_){}
    }

    storyChannel=
      null;

    if(
      !c?.channel
    ){
      return;
    }

    try{
      storyChannel=
        c
          .channel(
            "ssv-"+
            slug+
            "-"+
            Math
              .random()
              .toString(36)
              .slice(2)
          )
          .on(
            "postgres_changes",
            {
              event:"*",
              schema:"public",
              table:"shop_stories",
              filter:
                "shop_slug=eq."+
                slug
            },
            ()=>{

              if(
                root?.hidden
              ){
                return;
              }

              reloadOpen(
                slug,
                stories[
                  currentIndex
                ]?.id
              );

            }
          )
          .subscribe();
    }
    catch(_){}
  }

  async function reloadOpen(
    slug,
    storyId
  ){
    const token=
      ++loadToken;

    try{
      const data=
        await loadStories(
          slug
        );

      if(
        token!==
        loadToken ||
        root?.hidden
      ){
        return;
      }

      stories=
        data.stories;

      profile=
        data.profile;

      if(
        !stories.length
      ){
        close();
        return;
      }

      const target=
        stories.findIndex(
          story=>
            String(
              story.id
            )===
            String(
              storyId
            )
        );

      currentIndex=
        target>=0
          ? target
          : Math.min(
              currentIndex,
              stories.length-
              1
            );

      currentOwner=
        await ownerFor(
          slug
        );

      if(
        token!==
        loadToken ||
        root?.hidden
      ){
        return;
      }

      showCurrent();
    }
    catch(_){}
  }

  async function open(input){
    input=
      input||
      {};

    const slug=
      String(
        input.shopSlug||
        input.shop_slug||
        ""
      ).trim();

    const storyId=
      String(
        input.storyId??
        input.story_id??
        ""
      ).trim();

    if(!slug){
      return false;
    }

    ensureRoot();

    root.hidden=
      false;

    syncVisualViewport();

    root.classList.remove(
      "is-owner"
    );

    root
      .querySelector(
        ".ssv-loading"
      )
      .hidden=
        false;

    root
      .querySelector(
        ".ssv-media-host"
      )
      .replaceChildren();

    document
      .documentElement
      .classList
      .add(
        "ssv-open"
      );

    document
      .body
      ?.classList
      .add(
        "ssv-open"
      );

    if(
      !historyArmed
    ){
      armHistory();
    }

    /*
      Request immediately, before any await, so a direct mobile tap can
      enter browser fullscreen when supported.
    */
    requestFullscreen();

    const token=
      ++loadToken;

    try{
      const data=
        await loadStories(
          slug
        );

      if(
        token!==
        loadToken ||
        root.hidden
      ){
        return false;
      }

      stories=
        data.stories;

      profile=
        data.profile;

      if(
        !stories.length
      ){
        flash(
          "This Story is no longer available."
        );

        setTimeout(
          ()=>close(),
          700
        );

        return false;
      }

      let targetIndex=
        storyId
          ? stories.findIndex(
              story=>
                String(
                  story.id
                )===
                storyId
            )
          : -1;

      if(
        targetIndex<
        0 &&
        input.preferUnseen!==
        false
      ){

        let seenAt=
          0;

        try{
          seenAt=
            new Date(
              localStorage.getItem(
                "ma7alak_story_seen_"+
                slug
              )||
              0
            )
              .getTime()||
            0;
        }
        catch(_){}

        targetIndex=
          stories.findIndex(
            story=>
              new Date(
                story.created_at||
                0
              )
                .getTime()>
              seenAt
          );

      }

      currentIndex=
        targetIndex>=
        0
          ? targetIndex
          : 0;

      currentOwner=
        await ownerFor(
          slug
        );

      if(
        token!==
        loadToken ||
        root.hidden
      ){
        return false;
      }

      markSeen(
        slug,
        stories
      );

      subscribe(
        slug
      );

      showCurrent();

      return true;
    }
    catch(error){

      console.warn(
        "ShoufHon shared Story viewer:",
        error
      );

      flash(
        "Could not load this Story."
      );

      setTimeout(
        ()=>close(),
        900
      );

      return false;
    }
  }

  if(window.visualViewport){
    window.visualViewport.addEventListener(
      "resize",
      scheduleVisualViewportSync,
      {passive:true}
    );

    window.visualViewport.addEventListener(
      "scroll",
      scheduleVisualViewportSync,
      {passive:true}
    );
  }

  try{
    const keyboard=navigator.virtualKeyboard;
    if(
      keyboard &&
      typeof keyboard.addEventListener==="function"
    ){
      keyboard.addEventListener(
        "geometrychange",
        scheduleVisualViewportSync
      );
    }
  }catch(_){}

  window.addEventListener(
    "resize",
    scheduleVisualViewportSync,
    {passive:true}
  );

  try{
    getClient()?.auth?.onAuthStateChange?.(
      ()=>{
        if(
          !root ||
          root.hidden
        ){
          return;
        }

        const slug=
          String(
            stories[currentIndex]?.shop_slug||
            profile?.shop_slug||
            ""
          ).trim();

        if(!slug)return;

        ownerFor(slug)
          .then(()=>{
            if(
              root &&
              !root.hidden
            ){
              renderHeader();
            }
          })
          .catch(()=>{});
      }
    );
  }
  catch(_){}

  function sharedStoryFullscreenChanged(){
    if(
      !root ||
      root.hidden
    ){
      return;
    }

    const active=
      document.fullscreenElement||
      document.webkitFullscreenElement;

    /*
      Android Back gesture/button can exit browser fullscreen before it
      changes page history. Treat that fullscreen exit as "close Story".
      close() then consumes the Story history sentinel, keeping the user on
      the same ShoufHon page instead of navigating/reloading it.
    */
    if(
      !active &&
      historyArmed
    ){
      close();
    }
  }

  document.addEventListener(
    "fullscreenchange",
    sharedStoryFullscreenChanged
  );

  document.addEventListener(
    "webkitfullscreenchange",
    sharedStoryFullscreenChanged
  );

  window.addEventListener(
    "popstate",
    ()=>{
      if(
        root &&
        !root.hidden
      ){
        close(
          true
        );
      }
    }
  );

  document.addEventListener(
    "keydown",
    event=>{
      if(
        event.key===
        "Escape" &&
        root &&
        !root.hidden
      ){
        close();
      }
    }
  );

  window.addEventListener(
    "message",
    event=>{
      const data=
        event.data;

      if(
        data?.type===
        "SHOUFHON_OPEN_STORY_BY_ID"
      ){
        open({
          shopSlug:
            data.shopSlug||
            data.shop_slug,
          storyId:
            data.storyId||
            data.story_id,
          preferUnseen:
            false
        });
      }
    }
  );

  window.ShoufHonStoryViewer={
    open:open,
    openStory:
      (
        shopSlug,
        storyId
      )=>
        open({
          shopSlug:
            shopSlug,
          storyId:
            storyId,
          preferUnseen:
            false
        }),
    openShop:
      shopSlug=>
        open({
          shopSlug:
            shopSlug,
          preferUnseen:
            true
        }),
    close:close,
    isOpen:
      ()=>
        !!root &&
        !root.hidden
  };
})();
