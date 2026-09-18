(function(){
"use strict";
if(window.__M7_HOME_LAYOUT_ADMIN__)return;
if(location.pathname.replace(/\/+$/,"")!=="/admin")return;
window.__M7_HOME_LAYOUT_ADMIN__=1;
const KEY="live_offers_reels";let db=null,row=null;
const sleep=m=>new Promise(r=>setTimeout(r,m));
async function ready(){
 for(let i=0;i<160;i++){db=window.Ma7alakAccount?.client||window.__MA7ALAK_SHARED_SUPABASE_CLIENT__||null;if(db)break;await sleep(250)}
 if(!db&&window.Ma7alakSupabase?.ready){try{db=await window.Ma7alakSupabase.ready()}catch(_){}}
 return db;
}
function mount(){
 if(document.getElementById("m7-home-layout-admin"))return;
 let wrap=document.createElement("section");wrap.id="m7-home-layout-admin";wrap.innerHTML=`
 <style>
 #m7-home-layout-admin{margin:18px auto;width:min(100% - 20px,920px);padding:18px;border:1px solid #e4aa4f55;border-radius:22px;background:linear-gradient(145deg,#17130e,#090909);color:#fff;font-family:Arial,"Segoe UI",sans-serif;box-shadow:0 18px 50px #0008}
 #m7-home-layout-admin *{box-sizing:border-box}.m7hla-head{display:flex;gap:12px;align-items:center}.m7hla-head b{font-size:20px;color:#f1bd70}.m7hla-head small{display:block;margin-top:4px;color:#ffffff8c}.m7hla-live{margin-left:auto;padding:6px 9px;border-radius:99px;background:#36dc8218;color:#36dc82;font-size:10px;font-weight:900}.m7hla-preview{margin:15px 0;padding:15px;border:1px solid #ffffff14;border-radius:16px;background:#ffffff06}.m7hla-pos{font-size:28px;font-weight:950;color:#f4c879}.m7hla-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}.m7hla-actions button,.m7hla-save{min-height:46px;border:1px solid #e4aa4f66;border-radius:13px;background:#e4aa4f12;color:#fff;font-weight:900}.m7hla-save{width:100%;margin-top:10px;background:linear-gradient(135deg,#f0c271,#c98a31);color:#17100a}.m7hla-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.m7hla-row label{display:grid;gap:5px;color:#ffffffa0;font-size:11px}.m7hla-row input{width:100%;padding:11px;border:1px solid #ffffff20;border-radius:10px;background:#080808;color:#fff}.m7hla-toggle{display:flex!important;align-items:center;gap:8px;margin-top:13px;font-size:13px!important}.m7hla-status{min-height:18px;margin-top:9px;color:#36dc82;font-size:11px}
 @media(max-width:600px){.m7hla-row{grid-template-columns:1fr}}
 </style>
 <div class="m7hla-head"><span style="font-size:30px">🏠</span><div><b>Homepage Live Feed Position</b><small>Happening Today + Reels · changes the real homepage</small></div><span class="m7hla-live">LIVE CONTROL</span></div>
 <div class="m7hla-preview">Current homepage slot <div class="m7hla-pos">#<span id="m7hla-num">3</span></div><small>Move the whole block up or down between homepage sections. The page reflows naturally — no overlap.</small></div>
 <div class="m7hla-actions"><button id="m7hla-up" type="button">↑ MOVE UP</button><button id="m7hla-down" type="button">↓ MOVE DOWN</button></div>
 <div class="m7hla-row"><label>Extra top spacing (px)<input id="m7hla-offset" type="number" min="-100" max="300" step="4"></label><label>Maximum width (px)<input id="m7hla-width" type="number" min="320" max="1400" step="10"></label></div>
 <label class="m7hla-toggle"><input id="m7hla-enabled" type="checkbox"> Show Happening Today + Reels on homepage</label>
 <button class="m7hla-save" id="m7hla-save" type="button">SAVE & PUBLISH POSITION</button><div class="m7hla-status" id="m7hla-status"></div>`;
 let dash=document.getElementById("ma-admin-dashboard")||document.getElementById("ma7alak-admin-app")||document.body;dash.appendChild(wrap);
 wrap.querySelector("#m7hla-up").onclick=()=>change(-1);wrap.querySelector("#m7hla-down").onclick=()=>change(1);wrap.querySelector("#m7hla-save").onclick=save;
}
function paint(){if(!row)return;document.getElementById("m7hla-num").textContent=Number(row.position_index??3)+1;document.getElementById("m7hla-offset").value=row.offset_px??0;document.getElementById("m7hla-width").value=row.max_width_px??900;document.getElementById("m7hla-enabled").checked=row.enabled!==false}
function change(n){row.position_index=Math.max(0,Math.min(30,Number(row.position_index??3)+n));paint();save()}
async function save(){
 let st=document.getElementById("m7hla-status");st.textContent="Publishing…";
 row.offset_px=Math.max(-100,Math.min(300,Number(document.getElementById("m7hla-offset").value||0)));
 row.max_width_px=Math.max(320,Math.min(1400,Number(document.getElementById("m7hla-width").value||900)));
 row.enabled=document.getElementById("m7hla-enabled").checked;row.updated_at=new Date().toISOString();
 let r=await db.rpc("ma7alak_admin_update_homepage_layout",{p_key:KEY,p_enabled:row.enabled,p_position_index:row.position_index,p_offset_px:row.offset_px,p_max_width_px:row.max_width_px});
 st.textContent=r.error?("Could not save: "+r.error.message):"✓ Published to the live homepage";if(!r.error)setTimeout(()=>st.textContent="",2600)
}
async function boot(){
 if(!await ready())return;mount();
 let r=await db.from("homepage_layout_settings").select("*").eq("key",KEY).maybeSingle();
 row=r.data||{key:KEY,enabled:true,position_index:3,offset_px:0,max_width_px:900};paint();
}
setTimeout(boot,500);
})();