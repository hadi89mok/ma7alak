/* =========================================================
   SHOUFHON HOURS STATUS — SINGLE AUTHORITATIVE CONTROLLER
   Manual status text overrides the automatic weekly schedule.
   Blank manual text restores automatic schedule behavior.
   ========================================================= */
(function(){
"use strict";

if(window.__SHOUFHON_HOURS_STATUS_V2__)return;
window.__SHOUFHON_HOURS_STATUS_V2__=true;

const root=document.getElementById("ma7alak-hours-status");
if(!root)return;

const SUPABASE_URL="https://wdtaiuwtqdepzdamgsrs.supabase.co";
const SUPABASE_KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";
const DAYS=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
const LABELS={sunday:"Sunday",monday:"Monday",tuesday:"Tuesday",wednesday:"Wednesday",thursday:"Thursday",friday:"Friday",saturday:"Saturday"};
let options={};
let schedule=null;
let timezone="Asia/Beirut";
let realtimeChannel=null;
let previewChannel=null;
let clockTimer=null;
let lastPreviewStamp=0;

function cleanSlug(value){
  return String(value||"").trim().toLowerCase().replace(/^\/+|\/+$/g,"");
}

function fallbackSlug(){
  const candidates=[];
  try{if(window.parent&&window.parent!==window)candidates.push(window.parent.location.pathname||"")}catch(_){}
  try{if(document.referrer)candidates.push(new URL(document.referrer).pathname||"")}catch(_){}
  candidates.push(location.pathname||"");
  for(const path of candidates){
    const parts=String(path).split("/").filter(Boolean);
    const value=parts.length?decodeURIComponent(parts[parts.length-1]):"";
    if(value&&value!=="embed"&&value!=="editor")return cleanSlug(value);
  }
  return "";
}

async function resolveSlug(){
  const explicit=cleanSlug(root.getAttribute("data-shop-slug"));
  if(explicit)return explicit;
  if(window.ShoufHonShopContextClient?.resolve){
    try{
      return cleanSlug(await window.ShoufHonShopContextClient.resolve({
        explicit:"",
        fallback:fallbackSlug,
        timeout:1200
      }));
    }catch(_){}
  }
  return fallbackSlug();
}

function safeHex(value,fallback=""){
  const raw=String(value||"").trim();
  return /^#[0-9a-f]{6}$/i.test(raw)?raw:fallback;
}

function rgb(hex){
  const value=safeHex(hex,"#d9a441").slice(1);
  return {
    r:parseInt(value.slice(0,2),16),
    g:parseInt(value.slice(2,4),16),
    b:parseInt(value.slice(4,6),16)
  };
}

function mix(hex,target,amount){
  const a=rgb(hex);
  const b=rgb(target);
  const clamp=n=>Math.max(0,Math.min(255,Math.round(n)));
  return "#"+[clamp(a.r+(b.r-a.r)*amount),clamp(a.g+(b.g-a.g)*amount),clamp(a.b+(b.b-a.b)*amount)]
    .map(n=>n.toString(16).padStart(2,"0")).join("");
}

function normalizeSchedule(value){
  if(!value||typeof value!=="object"||Array.isArray(value))return null;
  const out={};
  let any=false;
  DAYS.forEach(day=>{
    const row=value[day]&&typeof value[day]==="object"?value[day]:{};
    const open=String(row.open||"").trim();
    const close=String(row.close||"").trim();
    const enabled=row.enabled===true||String(row.enabled||"").toLowerCase()==="true";
    out[day]={enabled,open,close};
    if(enabled&&/^\d{1,2}:\d{2}$/.test(open)&&/^\d{1,2}:\d{2}$/.test(close))any=true;
  });
  return any?out:null;
}

function minutes(value){
  const match=String(value||"").match(/^(\d{1,2}):(\d{2})$/);
  if(!match)return NaN;
  return Number(match[1])*60+Number(match[2]);
}

function formatTime(value){
  const total=minutes(value);
  if(!Number.isFinite(total))return String(value||"");
  let hour=Math.floor(total/60)%24;
  const minute=total%60;
  const suffix=hour>=12?"PM":"AM";
  hour=hour%12||12;
  return hour+(minute?":"+String(minute).padStart(2,"0"):"")+" "+suffix;
}

function localNow(){
  try{
    const parts=new Intl.DateTimeFormat("en-US",{
      timeZone:timezone,
      weekday:"long",
      hour:"2-digit",
      minute:"2-digit",
      hourCycle:"h23"
    }).formatToParts(new Date());
    const get=type=>parts.find(part=>part.type===type)?.value||"";
    const day=String(get("weekday")).toLowerCase();
    return {day,index:DAYS.indexOf(day),minutes:Number(get("hour"))*60+Number(get("minute"))};
  }catch(_){
    const d=new Date();
    return {day:DAYS[d.getDay()],index:d.getDay(),minutes:d.getHours()*60+d.getMinutes()};
  }
}

function nextOpening(dayIndex,nowMinutes){
  if(!schedule)return null;
  for(let offset=0;offset<8;offset++){
    const index=(dayIndex+offset)%7;
    const day=DAYS[index];
    const row=schedule[day];
    if(!row?.enabled)continue;
    const open=minutes(row.open);
    if(!Number.isFinite(open))continue;
    if(offset===0&&open<=nowMinutes)continue;
    return {day,time:row.open,today:offset===0};
  }
  return null;
}

function automaticState(){
  if(!schedule)return null;
  const now=localNow();
  const today=schedule[now.day]||{};
  const previousDay=DAYS[(now.index+6)%7];
  const previous=schedule[previousDay]||{};

  if(previous.enabled){
    const po=minutes(previous.open);
    const pc=minutes(previous.close);
    if(Number.isFinite(po)&&Number.isFinite(pc)&&pc<po&&now.minutes<pc){
      return {open:true,closesAt:previous.close};
    }
  }

  if(today.enabled){
    const open=minutes(today.open);
    const close=minutes(today.close);

    if(Number.isFinite(open)&&Number.isFinite(close)){
      if(open===close)return {open:true,open24:true,closesAt:today.close};

      if(close>open&&now.minutes>=open&&now.minutes<close){
        return {open:true,closesAt:today.close};
      }

      if(close<open&&now.minutes>=open){
        return {open:true,closesAt:today.close};
      }
    }
  }

  return {open:false,next:nextOpening(now.index,now.minutes)};
}

function applyDesign(){
  const accent=safeHex(options.hours_accent_color)||
    safeHex(options.story_color)||
    safeHex(options.card_color)||
    "#d9a441";
  const main=safeHex(options.hours_text_color,"#f7e5b6");
  const sub=safeHex(options.hours_sub_color,"#c9b889");
  const a=rgb(accent);

  root.style.setProperty("--m7-hours-accent",accent);
  root.style.setProperty("--m7-hours-accent-rgb",a.r+","+a.g+","+a.b);
  root.style.setProperty("--m7-hours-accent-light",mix(accent,"#ffffff",.42));
  root.style.setProperty("--m7-hours-accent-dark",mix(accent,"#000000",.42));
  root.style.setProperty("--m7-hours-main",main);
  root.style.setProperty("--m7-hours-sub",sub);

  const motion=String(options.page_motion_mode||options.global_motion_mode||"").trim().toLowerCase();
  root.classList.toggle("m7-hours-static",["none","off","static"].includes(motion));
  root.classList.toggle("m7-hours-subtle",["subtle","low","reduced"].includes(motion));
}

function setDotState(open,automatic){
  const custom=safeHex(options.hours_dot_color);
  const accent=safeHex(options.hours_accent_color)||safeHex(options.story_color)||"#d9a441";
  const color=custom||(automatic?(open?"#22c55e":"#ef4444"):accent);
  const value=rgb(color);
  root.style.setProperty("--m7-hours-dot",color);
  root.style.setProperty("--m7-hours-dot-rgb",value.r+","+value.g+","+value.b);
}

function setText(main,sub){
  root.innerHTML=
    '<span class="ma7alak-status-dot"></span>'+
    '<span class="ma7alak-status-text"></span>'+
    (sub?'<span class="ma7alak-hours-sub"></span>':"");

  root.querySelector(".ma7alak-status-text").textContent=main||"";
  const subEl=root.querySelector(".ma7alak-hours-sub");
  if(subEl)subEl.textContent=sub||"";

  root.classList.remove("m7-hours-pending");
  root.classList.add("m7-hours-ready");
}

function render(){
  /*
     Manual text is the explicit override.
     If either field contains text, automatic date/time logic is bypassed.
     Clear BOTH fields to return to the weekly Hours schedule.
  */
  const manualMain=String(options.hours_status_text||"").trim();
  const manualSub=String(options.hours_sub_text||"").trim();

  if(manualMain||manualSub){
    setDotState(false,false);
    setText(manualMain||"Availability",manualSub);
    return;
  }

  const state=automaticState();

  if(!state){
    setDotState(false,false);
    setText("Flexible hours","Request Only");
    return;
  }

  if(state.open){
    setDotState(true,true);
    setText(
      "Open now",
      state.open24?"Open 24 hours":"Closes at "+formatTime(state.closesAt)
    );
    return;
  }

  setDotState(false,true);

  if(state.next){
    setText(
      "Closed now",
      state.next.today
        ?"Opens at "+formatTime(state.next.time)
        :"Opens "+LABELS[state.next.day]+" at "+formatTime(state.next.time)
    );
    return;
  }

  setText("Closed","No opening hours set");
}

async function getClient(){
  if(window.Ma7alakAccount?.client)return window.Ma7alakAccount.client;
  if(window.__MA7ALAK_SHARED_SUPABASE_CLIENT__)return window.__MA7ALAK_SHARED_SUPABASE_CLIENT__;

  if(!window.supabase?.createClient){
    await new Promise((resolve,reject)=>{
      const existing=document.querySelector('script[data-m7-hours-supabase="1"],script[src*="@supabase/supabase-js@2"]');
      const done=()=>window.supabase?.createClient?resolve():reject(new Error("SUPABASE_LOAD_FAILED"));

      if(existing){
        if(window.supabase?.createClient){resolve();return}
        existing.addEventListener("load",done,{once:true});
        existing.addEventListener("error",reject,{once:true});
        return;
      }

      const script=document.createElement("script");
      script.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.async=true;
      script.dataset.m7HoursSupabase="1";
      script.onload=done;
      script.onerror=reject;
      document.head.appendChild(script);
    });
  }

  const client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{
    auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}
  });
  return client;
}

let SHOP_SLUG="";

async function loadProfile(){
  if(!SHOP_SLUG)return;

  try{
    let row=null;
    const client=
      window.Ma7alakAccount?.client||
      window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||
      null;

    if(client){
      const result=await client.from("shop_profiles")
        .select("shop_slug,directory_options")
        .eq("shop_slug",SHOP_SLUG)
        .maybeSingle();
      if(result.error)throw result.error;
      row=result.data;
    }else{
      const params=new URLSearchParams({
        select:"shop_slug,directory_options",
        shop_slug:"eq."+SHOP_SLUG,
        limit:"1"
      });
      const response=await fetch(SUPABASE_URL+"/rest/v1/shop_profiles?"+params.toString(),{
        headers:{
          apikey:SUPABASE_KEY,
          Authorization:"Bearer "+SUPABASE_KEY,
          Accept:"application/json"
        },
        cache:"no-store"
      });
      if(!response.ok)throw new Error("PROFILE_LOAD_FAILED");
      const rows=await response.json();
      row=Array.isArray(rows)?rows[0]:null;
    }

    options=row?.directory_options&&typeof row.directory_options==="object"
      ?row.directory_options
      :{};

    timezone=String(options.hours_timezone||"Asia/Beirut").trim()||"Asia/Beirut";
    schedule=normalizeSchedule(options.hours_schedule);
    applyDesign();
    render();
  }catch(error){
    console.warn("[ShoufHon Hours] profile:",error);
    applyDesign();
    render();
  }
}

function applyPreview(message){
  if(!message||message.type!=="MA7ALAK_DESIGN_PREVIEW")return;
  const slug=cleanSlug(message.shop_slug||message.shopSlug);
  if(!slug||slug!==SHOP_SLUG)return;

  const stamp=Number(message.sent_at)||Date.now();
  if(stamp<lastPreviewStamp)return;
  lastPreviewStamp=stamp;

  const incoming=
    message.directory_options&&typeof message.directory_options==="object"
      ?message.directory_options
      :{};

  options={...options,...incoming};
  timezone=String(options.hours_timezone||"Asia/Beirut").trim()||"Asia/Beirut";
  schedule=normalizeSchedule(options.hours_schedule);
  applyDesign();
  render();
}

async function startRealtime(){
  if(realtimeChannel||!SHOP_SLUG)return;
  try{
    const client=await getClient();
    realtimeChannel=client
      .channel("shoufhon-hours-"+SHOP_SLUG+"-"+Math.random().toString(36).slice(2))
      .on("postgres_changes",{
        event:"UPDATE",
        schema:"public",
        table:"shop_profiles",
        filter:"shop_slug=eq."+SHOP_SLUG
      },()=>loadProfile())
      .subscribe();
  }catch(error){
    console.warn("[ShoufHon Hours] realtime:",error);
  }
}

function setupPreviewChannels(){
  window.addEventListener("message",event=>applyPreview(event?.data));

  try{
    if("BroadcastChannel" in window){
      previewChannel=new BroadcastChannel("ma7alak-design-live-v1");
      previewChannel.onmessage=event=>applyPreview(event?.data);
    }
  }catch(_){}

  window.addEventListener("storage",event=>{
    if(event.key!=="ma7alak_design_live_v1:"+SHOP_SLUG||!event.newValue)return;
    try{applyPreview(JSON.parse(event.newValue))}catch(_){}
  });
}

function setupVisibilityPause(){
  if(!("IntersectionObserver" in window))return;
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>root.classList.toggle("m7-hours-paused",!entry.isIntersecting));
  },{threshold:.01});
  observer.observe(root);
}

async function boot(){
  SHOP_SLUG=await resolveSlug();

  if(!SHOP_SLUG){
    console.warn("[ShoufHon Hours] No shop context available.");
    return;
  }

  root.setAttribute("data-shop-slug",SHOP_SLUG);
  setupPreviewChannels();
  setupVisibilityPause();

  await loadProfile();
  startRealtime();

  clockTimer=setInterval(()=>{
    if(document.visibilityState==="visible")render();
  },30000);

  window.addEventListener("focus",()=>loadProfile());

  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible"){
      loadProfile();
      startRealtime();
    }
  });

  window.addEventListener("beforeunload",()=>{
    if(clockTimer)clearInterval(clockTimer);
    try{previewChannel?.close()}catch(_){}
  });
}

boot().catch(error=>console.warn("[ShoufHon Hours] boot:",error));
})();
