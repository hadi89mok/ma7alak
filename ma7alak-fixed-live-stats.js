(function(){
"use strict";

if(window.self!==window.top)return;
if(window.__MA7ALAK_FIXED_LIVE_STATS__)return;

var path=(location.pathname||"/").replace(/\/+$/,"")||"/";
var allowed=["/","/add-shop-","/shwf-almhlat-"];
if(allowed.indexOf(path)===-1)return;

window.__MA7ALAK_FIXED_LIVE_STATS__=1;

var style=document.createElement("style");
style.id="ma7alak-fixed-live-stats-css";
style.textContent=`
#ma7alak-live-stats{
  position:fixed!important;
  left:50%!important;
  bottom:max(8px,env(safe-area-inset-bottom))!important;
  transform:translateX(-50%)!important;
  z-index:2147483000!important;
  width:calc(100% - 16px)!important;
  max-width:520px!important;
  margin:0!important;
  padding:0 8px!important;
  box-sizing:border-box!important;
  font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif!important;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  text-rendering:optimizeLegibility;
  pointer-events:none;
}
#ma7alak-live-stats .ma7alak-live-panel{
  position:relative;
  display:flex;
  align-items:center;
  justify-content:space-between;
  width:100%;
  background:
    radial-gradient(circle at 50% 0%,rgba(224,153,62,.20),transparent 55%),
    linear-gradient(180deg,rgba(73,42,20,.96),rgba(35,21,13,.96));
  border:1px solid rgba(224,153,62,.42);
  border-radius:14px;
  padding:9px 10px;
  box-sizing:border-box;
  box-shadow:0 8px 24px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.05);
  backdrop-filter:blur(7px);
  -webkit-backdrop-filter:blur(7px);
  overflow:hidden;
  pointer-events:auto;
}
#ma7alak-live-stats .ma7alak-live-panel::before{
  content:"";
  position:absolute;
  top:-1px;
  left:22%;
  right:22%;
  height:2px;
  background:linear-gradient(90deg,transparent,#ff9800,transparent);
  border-radius:0 0 5px 5px;
}
#ma7alak-live-stats .ma7alak-live-item{
  flex:1;min-width:0;display:flex;align-items:center;justify-content:center;
  gap:7px;padding:2px 6px;box-sizing:border-box;
}
#ma7alak-live-stats .ma7alak-live-text{min-width:0;text-align:left}
#ma7alak-live-stats .ma7alak-live-divider{
  width:1px;height:30px;flex:0 0 1px;
  background:linear-gradient(180deg,transparent,rgba(255,165,0,.22),transparent);
}
#ma7alak-live-stats .ma7alak-live-icon{
  flex:0 0 auto;font-size:18px;line-height:1;
  filter:drop-shadow(0 1px 1px rgba(0,0,0,.22));
}
#ma7alak-live-stats .ma7alak-live-number{
  font-size:20px;font-weight:800;line-height:1;color:#fff;letter-spacing:0;
  text-shadow:0 1px 2px rgba(0,0,0,.34);
}
#ma7alak-live-stats .ma7alak-live-label{
  margin-top:3px;font-size:10px;font-weight:650;line-height:1.15;
  color:rgba(255,255,255,.92);letter-spacing:.05px;white-space:nowrap;
  text-shadow:0 1px 1px rgba(0,0,0,.28);
}
html.m7-reel-open #ma7alak-live-stats,
body.m7-reel-open #ma7alak-live-stats{display:none!important}
@media(max-width:500px){
  #ma7alak-live-stats{max-width:410px;width:calc(100% - 32px)!important;padding:0 4px!important}
  #ma7alak-live-stats .ma7alak-live-panel{padding:8px 7px;border-radius:12px;backdrop-filter:none;-webkit-backdrop-filter:none}
  #ma7alak-live-stats .ma7alak-live-item{gap:5px;padding:2px 4px}
  #ma7alak-live-stats .ma7alak-live-icon{font-size:16px}
  #ma7alak-live-stats .ma7alak-live-number{font-size:18px}
  #ma7alak-live-stats .ma7alak-live-label{font-size:9.2px;font-weight:650}
  #ma7alak-live-stats .ma7alak-live-divider{height:27px}
}
@media(max-width:360px){
  #ma7alak-live-stats .ma7alak-live-panel{padding:7px 5px}
  #ma7alak-live-stats .ma7alak-live-item{gap:4px;padding:1px 3px}
  #ma7alak-live-stats .ma7alak-live-icon{font-size:15px}
  #ma7alak-live-stats .ma7alak-live-number{font-size:17px}
  #ma7alak-live-stats .ma7alak-live-label{font-size:8.6px;font-weight:650}
  #ma7alak-live-stats .ma7alak-live-divider{height:25px}
}
`;
document.head.appendChild(style);

var root=document.createElement("div");
root.id="ma7alak-live-stats";
root.innerHTML=`
<div class="ma7alak-live-panel">
  <div class="ma7alak-live-item">
    <div class="ma7alak-live-icon">👥</div>
    <div class="ma7alak-live-text">
      <div class="ma7alak-live-number" id="ma7alak-web-online">0</div>
      <div class="ma7alak-live-label">visitors online</div>
    </div>
  </div>
  <div class="ma7alak-live-divider"></div>
  <div class="ma7alak-live-item">
    <div class="ma7alak-live-icon">🏪</div>
    <div class="ma7alak-live-text">
      <div class="ma7alak-live-number" id="ma7alak-shop-online">0</div>
      <div class="ma7alak-live-label">viewing shops</div>
    </div>
  </div>
  <div class="ma7alak-live-divider"></div>
  <div class="ma7alak-live-item">
    <div class="ma7alak-live-icon">👁️</div>
    <div class="ma7alak-live-text">
      <div class="ma7alak-live-number" id="ma7alak-web-total">0</div>
      <div class="ma7alak-live-label">total visits</div>
    </div>
  </div>
</div>`;
document.body.appendChild(root);

function numberValue(value){
  var n=Number(value||0);
  return Number.isFinite(n)?n:0;
}
function setNumber(id,value){
  var el=document.getElementById(id);
  if(!el)return;
  el.textContent=String(numberValue(value));
}
function applyStats(data){
  if(!data||data.type!=="MA7ALAK_LIVE_STATS"||!data.website)return;
  setNumber("ma7alak-web-online",data.website.online);
  setNumber("ma7alak-shop-online",data.website.shopsOnline);
  setNumber("ma7alak-web-total",data.website.total);
}
window.addEventListener("message",function(event){applyStats(event.data)});

try{
  window.postMessage({type:"MA7ALAK_STATS_EMBED_READY"},"*");
}catch(error){}

})();