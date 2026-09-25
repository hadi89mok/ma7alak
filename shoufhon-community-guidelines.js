/* =========================================================
   SHOUFHON COMMUNITY GUIDELINES
   Public /community-guidelines page
   Content is editable from the ShoufHon Admin panel.
   ========================================================= */
(function(){
"use strict";

const cleanPath=String(location.pathname||"/").replace(/\/+$/,"")||"/";
if(cleanPath!=="/community-guidelines")return;
if(window.__SHOUFHON_COMMUNITY_GUIDELINES_PAGE__)return;
window.__SHOUFHON_COMMUNITY_GUIDELINES_PAGE__=true;

const SUPABASE_URL="https://wdtaiuwtqdepzdamgsrs.supabase.co";
const SUPABASE_KEY="sb_publishable_lzog5ZX19HK5_rFfer8Ylw_OPG_0bXl";

const DEFAULTS={
  eyebrow:"ShoufHon Safety & Community",
  title_ar:"إرشادات المجتمع",
  title_en:"Community Guidelines",
  intro_title:"خلّينا نخلي ShoufHon مكان محترم وآمن للكل.",
  intro_body:"ShoufHon connects people with local shops, businesses, services, offers and live content. Whether you are browsing, messaging a shop, posting content, or going LIVE, everyone is expected to use the platform responsibly.",
  rules:[
    {icon:"🤝",title:"Respect everyone",text:"Speak to customers, shop owners and other users respectfully. Harassment, threats, bullying, hate speech, sexual harassment or deliberately abusive behavior are not allowed.",enabled:true},
    {icon:"💬",title:"Use messages for genuine communication",text:"Use messaging for real questions about products, services, availability, prices and other relevant topics. Do not spam, repeatedly contact someone who does not want contact, impersonate others, send scams or send inappropriate content.",enabled:true},
    {icon:"🏪",title:"Keep customer conversations professional",text:"Shop owners should answer honestly and avoid misleading claims, pressure or abuse. Customers should also communicate respectfully with businesses and their staff.",enabled:true},
    {icon:"🔴",title:"Keep LIVE safe and appropriate",text:"Do not broadcast violence, dangerous behavior, nudity or sexual content, illegal activity, harassment, private conversations without permission, or content intended to seriously shock or harm viewers.",enabled:true},
    {icon:"📸",title:"Only share media you are allowed to use",text:"Photos, videos, reels, stories and other uploaded media should belong to you or be content you have permission to publish. Do not upload private or copyrighted material without authorization.",enabled:true},
    {icon:"🔐",title:"Respect privacy",text:"Do not expose private phone numbers, addresses, passwords, identification documents, financial details, private messages or other sensitive information without permission.",enabled:true},
    {icon:"🎬",title:"Stories, reels and posts should be honest",text:"Do not use fake claims, deceptive edits, misleading before-and-after images, impersonation or unrelated bait content simply to attract attention.",enabled:true},
    {icon:"🏷️",title:"Offers must be real",text:"Prices, discounts, availability, dates and conditions should be accurate. If an offer expires, sells out or changes, shop owners should update or end it.",enabled:true},
    {icon:"🛡️",title:"No scams or fraudulent listings",text:"Do not ask users for passwords or verification codes, create suspicious payment requests, or pretend to represent another business or person.",enabled:true},
    {icon:"⚖️",title:"No illegal or prohibited activity",text:"ShoufHon must not be used to advertise, arrange, sell or promote illegal goods, illegal services or criminal activity.",enabled:true},
    {icon:"🚫",title:"Do not manipulate the platform",text:"Fake accounts, fake engagement, automated spam, abusive reporting, attempts to bypass restrictions, exploitation of technical vulnerabilities or interference with other users are prohibited.",enabled:true},
    {icon:"🚩",title:"Report problems instead of escalating them",text:"If someone is harassing you, sending inappropriate messages, impersonating a business or posting unsafe content, use the available Report or Block tools instead of escalating the situation.",enabled:true},
    {icon:"✅",title:"Shop owners are responsible for their content",text:"Businesses are responsible for information, prices, offers, media and statements published through their shop account.",enabled:true},
    {icon:"🔎",title:"ShoufHon may act when guidelines are broken",text:"Content may be removed and features or accounts may be restricted or suspended when these guidelines are seriously or repeatedly violated.",enabled:true}
  ],
  closing_title:"Keep it local. Keep it respectful.",
  closing_body:"ShoufHon is built to help people discover and communicate with local businesses. Be genuine, be respectful, and let every shop have a fair chance to be seen.",
  signature:"خلّي محلك ينشاف. ❤️",
  updated_at:null
};

const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const formatDate=value=>{
  const d=new Date(value||0);
  if(!Number.isFinite(d.getTime()))return "";
  try{return d.toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"})}
  catch(_){return d.toISOString().slice(0,10)}
};

function ensureMeta(){
  document.title="Community Guidelines · ShoufHon";
  let description=document.querySelector('meta[name="description"]');
  if(!description){
    description=document.createElement("meta");
    description.name="description";
    document.head.appendChild(description);
  }
  description.content="Community Guidelines for viewers, customers and shop owners using ShoufHon messaging, LIVE, offers, stories, reels and media.";
  let theme=document.querySelector('meta[name="theme-color"]');
  if(!theme){
    theme=document.createElement("meta");
    theme.name="theme-color";
    document.head.appendChild(theme);
  }
  theme.content="#090806";
}

function injectCss(){
  if(document.getElementById("m7cg-css"))return;
  const s=document.createElement("style");
  s.id="m7cg-css";
  s.textContent=`
  body.m7cg-page{
    margin:0!important;
    background:#080706!important;
    color:#f7f1e8!important;
  }
  #m7cg-root{
    --gold:#e4b459;
    --gold2:#f5d48b;
    --line:rgba(228,180,89,.18);
    --muted:rgba(247,241,232,.64);
    --card:rgba(19,16,13,.86);
    position:relative;
    z-index:2;
    min-height:100dvh;
    overflow:hidden;
    background:
      radial-gradient(circle at 12% 2%,rgba(224,168,67,.10),transparent 26rem),
      radial-gradient(circle at 92% 20%,rgba(178,33,56,.08),transparent 24rem),
      linear-gradient(180deg,#0b0907 0%,#080706 52%,#060505 100%);
    font-family:Inter,Arial,"Segoe UI",sans-serif;
  }
  #m7cg-root *{box-sizing:border-box}
  .m7cg-shell{
    width:min(100%,1120px);
    margin:0 auto;
    padding:calc(92px + env(safe-area-inset-top)) 18px 54px;
  }
  .m7cg-hero{
    position:relative;
    overflow:hidden;
    padding:clamp(24px,5vw,58px);
    border:1px solid var(--line);
    border-radius:30px;
    background:
      linear-gradient(145deg,rgba(26,21,15,.95),rgba(11,10,9,.95)),
      radial-gradient(circle at 75% 15%,rgba(228,180,89,.08),transparent 40%);
    box-shadow:0 28px 70px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.04);
  }
  .m7cg-hero:before{
    content:"";
    position:absolute;
    width:240px;height:240px;
    right:-80px;top:-100px;
    border:1px solid rgba(228,180,89,.12);
    border-radius:50%;
    box-shadow:0 0 0 35px rgba(228,180,89,.025),0 0 0 72px rgba(228,180,89,.015);
  }
  .m7cg-eyebrow{
    display:inline-flex;
    align-items:center;
    gap:8px;
    min-height:30px;
    padding:0 11px;
    border:1px solid rgba(228,180,89,.24);
    border-radius:999px;
    background:rgba(228,180,89,.055);
    color:var(--gold2);
    font-size:10px;
    font-weight:900;
    letter-spacing:.55px;
    text-transform:uppercase;
  }
  .m7cg-eyebrow i{width:7px;height:7px;border-radius:50%;background:#d83c55;box-shadow:0 0 12px rgba(216,60,85,.48)}
  .m7cg-ar{
    margin:21px 0 2px;
    color:#fff8ed;
    font-size:clamp(34px,8vw,74px);
    line-height:1;
    font-weight:950;
    letter-spacing:-1.6px;
    direction:rtl;
    text-align:left;
  }
  .m7cg-en{
    margin:8px 0 0;
    color:var(--gold2);
    font-size:clamp(17px,3vw,28px);
    font-weight:900;
    letter-spacing:.2px;
  }
  .m7cg-intro-title{
    max-width:820px;
    margin:24px 0 7px;
    color:#fff;
    font-size:clamp(18px,3vw,25px);
    line-height:1.35;
    font-weight:900;
  }
  .m7cg-intro{
    max-width:830px;
    margin:0;
    color:var(--muted);
    font-size:clamp(13px,2.4vw,16px);
    line-height:1.72;
    font-weight:550;
  }
  .m7cg-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:21px}
  .m7cg-chip{
    min-height:31px;
    display:inline-flex;align-items:center;gap:6px;
    padding:0 10px;
    border:1px solid rgba(255,255,255,.075);
    border-radius:999px;
    background:rgba(255,255,255,.025);
    color:rgba(255,255,255,.72);
    font-size:9px;font-weight:850;
  }
  .m7cg-chip b{color:var(--gold2);font-size:11px}
  .m7cg-section-head{
    display:flex;
    align-items:end;
    justify-content:space-between;
    gap:12px;
    margin:34px 2px 13px;
  }
  .m7cg-section-head h2{margin:0;color:#fff;font-size:20px;font-weight:950}
  .m7cg-section-head p{margin:0;color:rgba(255,255,255,.42);font-size:9px;font-weight:750}
  .m7cg-grid{
    display:grid;
    grid-template-columns:repeat(2,minmax(0,1fr));
    gap:12px;
  }
  .m7cg-rule{
    position:relative;
    min-height:172px;
    padding:18px 18px 19px;
    border:1px solid rgba(255,255,255,.075);
    border-radius:22px;
    background:
      radial-gradient(circle at 0 0,rgba(228,180,89,.055),transparent 42%),
      rgba(18,15,13,.80);
    box-shadow:0 12px 30px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.025);
  }
  .m7cg-rule-num{
    position:absolute;
    top:14px;right:16px;
    color:rgba(255,255,255,.18);
    font-size:9px;
    font-weight:950;
    letter-spacing:.8px;
  }
  .m7cg-rule-icon{
    width:42px;height:42px;
    display:grid;place-items:center;
    border:1px solid rgba(228,180,89,.19);
    border-radius:14px;
    background:rgba(228,180,89,.055);
    font-size:20px;
    box-shadow:inset 0 1px 0 rgba(255,255,255,.035);
  }
  .m7cg-rule h3{
    margin:12px 0 6px;
    color:#fff6e9;
    font-size:15px;
    line-height:1.28;
    font-weight:950;
  }
  .m7cg-rule p{
    margin:0;
    color:rgba(255,255,255,.61);
    font-size:12px;
    line-height:1.58;
  }
  .m7cg-note{
    display:grid;
    grid-template-columns:auto 1fr;
    gap:12px;
    align-items:start;
    margin-top:14px;
    padding:16px;
    border:1px solid rgba(211,58,82,.20);
    border-radius:20px;
    background:linear-gradient(135deg,rgba(91,18,30,.21),rgba(18,12,13,.64));
  }
  .m7cg-note-icon{
    width:40px;height:40px;display:grid;place-items:center;
    border-radius:13px;background:rgba(221,54,80,.12);
    color:#ff7890;font-size:19px;
  }
  .m7cg-note strong{display:block;color:#ffecef;font-size:13px;margin-bottom:4px}
  .m7cg-note span{display:block;color:rgba(255,255,255,.58);font-size:11px;line-height:1.55}
  .m7cg-closing{
    position:relative;
    margin-top:34px;
    padding:26px;
    overflow:hidden;
    border:1px solid rgba(228,180,89,.25);
    border-radius:26px;
    background:linear-gradient(145deg,rgba(34,26,17,.92),rgba(11,10,9,.95));
    text-align:center;
  }
  .m7cg-closing:before{
    content:"✦";
    position:absolute;
    left:20px;top:14px;
    color:rgba(228,180,89,.18);
    font-size:46px;
  }
  .m7cg-closing h2{margin:0;color:#fff7e8;font-size:22px;font-weight:950}
  .m7cg-closing p{max-width:720px;margin:8px auto 0;color:rgba(255,255,255,.62);font-size:12px;line-height:1.65}
  .m7cg-signature{margin-top:14px;color:var(--gold2);font-size:15px;font-weight:950}
  .m7cg-footer{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
    padding:18px 3px 0;
    color:rgba(255,255,255,.38);
    font-size:9px;
    font-weight:700;
  }
  .m7cg-home{
    color:var(--gold2)!important;
    text-decoration:none!important;
    font-weight:900!important;
  }
  .m7cg-loading{
    min-height:70dvh;
    display:grid;place-items:center;
    padding:120px 20px;
    color:rgba(255,255,255,.62);
    text-align:center;
  }
  .m7cg-spinner{
    width:30px;height:30px;margin:0 auto 12px;
    border:3px solid rgba(255,255,255,.12);
    border-top-color:var(--gold);
    border-radius:50%;
    animation:m7cgSpin .8s linear infinite;
  }
  @keyframes m7cgSpin{to{transform:rotate(360deg)}}
  @media(max-width:720px){
    .m7cg-shell{padding:calc(82px + env(safe-area-inset-top)) 11px 38px}
    .m7cg-hero{padding:24px 18px;border-radius:24px}
    .m7cg-ar{text-align:left;font-size:42px;letter-spacing:-.9px}
    .m7cg-en{font-size:19px}
    .m7cg-grid{grid-template-columns:1fr;gap:9px}
    .m7cg-rule{min-height:0;padding:16px;border-radius:19px}
    .m7cg-section-head{align-items:start;flex-direction:column;margin-top:27px}
    .m7cg-closing{padding:22px 17px}
    .m7cg-footer{align-items:flex-start;flex-direction:column}
  }
  @media(prefers-reduced-motion:reduce){#m7cg-root *{animation:none!important;transition:none!important}}
  `;
  document.head.appendChild(s);
}

function root(){
  let el=document.getElementById("m7cg-root");
  if(el)return el;
  el=document.createElement("main");
  el.id="m7cg-root";
  document.body.appendChild(el);
  return el;
}

function renderLoading(){
  root().innerHTML='<div class="m7cg-loading"><div><div class="m7cg-spinner"></div><strong>Loading Community Guidelines…</strong></div></div>';
}

function render(data){
  const d={...DEFAULTS,...(data||{})};
  const rules=(Array.isArray(d.rules)?d.rules:DEFAULTS.rules).filter(x=>x&&x.enabled!==false);
  const updated=formatDate(d.updated_at);
  root().innerHTML=`
    <div class="m7cg-shell">
      <section class="m7cg-hero">
        <div class="m7cg-eyebrow"><i></i>${esc(d.eyebrow)}</div>
        <h1 class="m7cg-ar">${esc(d.title_ar)}</h1>
        <div class="m7cg-en">${esc(d.title_en)}</div>
        <h2 class="m7cg-intro-title">${esc(d.intro_title)}</h2>
        <p class="m7cg-intro">${esc(d.intro_body)}</p>
        <div class="m7cg-chips">
          <span class="m7cg-chip"><b>✓</b> Respect</span>
          <span class="m7cg-chip"><b>✓</b> Safety</span>
          <span class="m7cg-chip"><b>✓</b> Authenticity</span>
          <span class="m7cg-chip"><b>✓</b> Privacy</span>
        </div>
      </section>

      <div class="m7cg-section-head">
        <h2>Using ShoufHon responsibly</h2>
        <p>${rules.length} community guidelines</p>
      </div>

      <section class="m7cg-grid">
        ${rules.map((rule,index)=>`
          <article class="m7cg-rule">
            <span class="m7cg-rule-num">${String(index+1).padStart(2,"0")}</span>
            <div class="m7cg-rule-icon">${esc(rule.icon||"•")}</div>
            <h3>${esc(rule.title||"Guideline")}</h3>
            <p>${esc(rule.text||"")}</p>
          </article>
        `).join("")}
      </section>

      <aside class="m7cg-note">
        <div class="m7cg-note-icon">🚩</div>
        <div><strong>See something that breaks these guidelines?</strong><span>Use ShoufHon’s Report or Block controls where available. Do not share sensitive information publicly or escalate harassment through messages or LIVE.</span></div>
      </aside>

      <section class="m7cg-closing">
        <h2>${esc(d.closing_title)}</h2>
        <p>${esc(d.closing_body)}</p>
        <div class="m7cg-signature">${esc(d.signature)}</div>
      </section>

      <footer class="m7cg-footer">
        <span>${updated?"Last updated "+esc(updated):"ShoufHon Community Guidelines"}</span>
        <a class="m7cg-home" href="https://shoufhon.com/">Back to ShoufHon →</a>
      </footer>
    </div>`;
}

function getClient(){
  return window.Ma7alakAccount?.client||
    window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||
    window.Ma7alakSupabaseBootstrap?.client||
    window.__MA7ALAK_LIVE_FALLBACK_SUPABASE__||
    window.__SHOUFHON_GUIDELINES_PUBLIC_CLIENT__||
    null;
}

async function ensurePublicClient(){
  let existing=getClient();
  if(existing)return existing;

  if(!window.supabase||typeof window.supabase.createClient!=="function"){
    await new Promise((resolve,reject)=>{
      const found=document.querySelector('script[data-m7cg-supabase="1"]');
      if(found){
        found.addEventListener("load",resolve,{once:true});
        found.addEventListener("error",reject,{once:true});
        return;
      }
      const s=document.createElement("script");
      s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      s.async=true;
      s.dataset.m7cgSupabase="1";
      s.onload=resolve;
      s.onerror=()=>reject(new Error("Could not load Supabase."));
      document.head.appendChild(s);
    });
  }

  existing=getClient();
  if(existing)return existing;

  if(window.supabase?.createClient){
    window.__SHOUFHON_GUIDELINES_PUBLIC_CLIENT__=window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY,
      {
        auth:{
          persistSession:false,
          autoRefreshToken:false,
          detectSessionInUrl:false
        }
      }
    );
  }
  return window.__SHOUFHON_GUIDELINES_PUBLIC_CLIENT__||null;
}

async function load(){
  renderLoading();
  const c=await ensurePublicClient();
  if(!c){render(DEFAULTS);return}
  try{
    const r=await c.from("community_guidelines").select("*").eq("id","main").maybeSingle();
    if(r.error)throw r.error;
    if(!r.data){
      root().innerHTML='<div class="m7cg-loading"><div><strong>Community Guidelines are being updated.</strong><div style="margin-top:8px;font-size:11px;color:rgba(255,255,255,.45)">Please check again shortly.</div></div></div>';
      return;
    }
    render(r.data);
  }catch(err){
    console.warn("ShoufHon Community Guidelines:",err);
    render(DEFAULTS);
  }
}

ensureMeta();
injectCss();
document.body.classList.add("m7cg-page");
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",load,{once:true});else load();

addEventListener("pageshow",()=>{if(document.visibilityState!=="hidden")load()});
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")load()});
})();