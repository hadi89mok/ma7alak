/* =========================================================
   SHOUFHON VIP EFFECTS V1

   Optional visual extension for the existing one-slug profile.
   It never creates a second Story engine, fetches Story rows, or
   changes uploads/likes. It only decorates the existing profile circle
   from per-shop directory_options supplied by Ma7alakProfileShell.
========================================================= */
(function(){
  "use strict";

  if(window.__SHOUFHON_VIP_EFFECTS_V1__)return;
  window.__SHOUFHON_VIP_EFFECTS_V1__=true;

  const STYLE_ID="shoufhon-vip-effects-v1-css";
  const LAYER_CLASS="m7vip-story-fx";
  const ALLOWED_RING=new Set(["aurora","double","neon","segments","pearls","classic"]);
  const ALLOWED_PARTICLES=new Set(["sparkles","stars","petals","bubbles","hearts","dots","none"]);
  const PARTICLE_SYMBOLS={sparkles:"✦",stars:"★",petals:"❋",bubbles:"○",hearts:"♥",dots:"•"};

  let shell=null;
  let wrapper=null;
  let button=null;
  let layer=null;
  let options={};
  let resizeObserver=null;
  let storyObserver=null;
  let intersectionObserver=null;
  let visible=true;
  let bootTimer=0;

  function clamp(value,min,max,fallback){
    const n=Number(value);
    return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback;
  }

  function bool(value,fallback){
    if(value===undefined||value===null||value==="")return fallback;
    if(value===true||String(value).toLowerCase()==="true")return true;
    if(value===false||String(value).toLowerCase()==="false")return false;
    return fallback;
  }

  function hex(value,fallback){
    const v=String(value||"").trim();
    return /^#[0-9a-f]{6}$/i.test(v)?v:fallback;
  }

  function choice(value,allowed,fallback){
    const v=String(value||"").trim().toLowerCase();
    return allowed.has(v)?v:fallback;
  }

  function safeUrl(value){
    const v=String(value||"").trim();
    return /^https:\/\//i.test(v)?v:"";
  }

  function slug(){
    const raw=String(
      shell?.getAttribute("data-shop-slug")||
      window.Ma7alakProfileShell?.slug||
      window.ShoufHonShopContextClient?.slug||
      ""
    ).trim().toLowerCase();
    return raw.replace(/^\/+|\/+$/g,"");
  }

  function cachedOptions(){
    try{
      const direct=window.Ma7alakProfileShell?.getCachedOptions?.();
      if(direct&&typeof direct==="object"&&!Array.isArray(direct))return direct;
    }catch(_){}
    try{
      const s=slug();
      if(!s)return null;
      const parsed=JSON.parse(localStorage.getItem("ma7alak_profile_theme_v1:"+s)||"null");
      return parsed&&typeof parsed==="object"&&!Array.isArray(parsed)?parsed:null;
    }catch(_){return null;}
  }

  function installCss(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement("style");
    style.id=STYLE_ID;
    style.textContent=`
      .${LAYER_CLASS}{
        --m7vip-c1:#f2caed;
        --m7vip-c2:#d9a441;
        --m7vip-c3:#fff;
        --m7vip-particle:#f2caed;
        --m7vip-size:220px;
        --m7vip-width:4px;
        --m7vip-speed:5s;
        --m7vip-particle-speed:4.5s;
        --m7vip-orbit-distance:12px;
        --m7vip-orbit-size:18px;
        position:absolute!important;
        left:50%!important;
        top:50%!important;
        width:var(--m7vip-size)!important;
        height:var(--m7vip-size)!important;
        transform:translate(-50%,-50%) translateZ(0)!important;
        z-index:6!important;
        border-radius:50%!important;
        pointer-events:none!important;
        opacity:0!important;
        visibility:hidden!important;
        transition:opacity .22s ease!important;
        contain:layout style!important;
      }
      .${LAYER_CLASS}[data-active="1"]{opacity:1!important;visibility:visible!important}
      .${LAYER_CLASS}[data-paused="1"] *,
      #ma7alak-profile-shell[data-motion-mode="off"] .${LAYER_CLASS} *{
        animation-play-state:paused!important;
        -webkit-animation-play-state:paused!important;
      }
      .m7vip-ring,.m7vip-ring::before,.m7vip-ring::after{
        position:absolute!important;
        inset:0!important;
        border-radius:50%!important;
        box-sizing:border-box!important;
        pointer-events:none!important;
      }
      .m7vip-ring::before,.m7vip-ring::after{content:""!important}
      .m7vip-ring::before{
        padding:var(--m7vip-width)!important;
        background:conic-gradient(from 0deg,var(--m7vip-c1),var(--m7vip-c3) 14%,var(--m7vip-c2) 32%,transparent 44%,var(--m7vip-c1) 63%,var(--m7vip-c3) 78%,var(--m7vip-c2))!important;
        -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0)!important;
        -webkit-mask-composite:xor!important;
        mask-composite:exclude!important;
        animation:m7vip-spin var(--m7vip-speed) linear infinite!important;
      }
      .${LAYER_CLASS}[data-ring="classic"] .m7vip-ring::before{
        background:none!important;
        border:var(--m7vip-width) solid var(--m7vip-c1)!important;
        -webkit-mask:none!important;mask:none!important;animation:none!important;
      }
      .${LAYER_CLASS}[data-ring="double"] .m7vip-ring::before{
        inset:-3px!important;
        background:none!important;
        border:var(--m7vip-width) solid var(--m7vip-c1)!important;
        -webkit-mask:none!important;mask:none!important;
        box-shadow:inset 0 0 0 2px rgba(0,0,0,.8),inset 0 0 0 4px var(--m7vip-c2),0 0 15px color-mix(in srgb,var(--m7vip-c1) 52%,transparent)!important;
        animation:m7vip-breathe calc(var(--m7vip-speed) * .65) ease-in-out infinite!important;
      }
      .${LAYER_CLASS}[data-ring="neon"] .m7vip-ring::before{
        background:none!important;
        border:var(--m7vip-width) solid var(--m7vip-c1)!important;
        -webkit-mask:none!important;mask:none!important;
        box-shadow:0 0 5px var(--m7vip-c3),0 0 13px var(--m7vip-c1),0 0 27px var(--m7vip-c2),inset 0 0 10px var(--m7vip-c1)!important;
        animation:m7vip-neon calc(var(--m7vip-speed) * .55) ease-in-out infinite!important;
      }
      .${LAYER_CLASS}[data-ring="segments"] .m7vip-ring::before{
        background:repeating-conic-gradient(from 0deg,var(--m7vip-c1) 0 9deg,transparent 9deg 17deg,var(--m7vip-c2) 17deg 24deg,transparent 24deg 34deg)!important;
      }
      .${LAYER_CLASS}[data-ring="pearls"] .m7vip-ring::before{
        padding:0!important;
        background:repeating-conic-gradient(from 0deg,var(--m7vip-c3) 0 3deg,transparent 3deg 14deg)!important;
        -webkit-mask:radial-gradient(farthest-side,transparent calc(100% - var(--m7vip-width) - 2px),#000 calc(100% - var(--m7vip-width)),#000 99%,transparent 100%)!important;
        mask:radial-gradient(farthest-side,transparent calc(100% - var(--m7vip-width) - 2px),#000 calc(100% - var(--m7vip-width)),#000 99%,transparent 100%)!important;
      }
      .m7vip-ring::after{
        inset:-6px!important;
        border:1px solid color-mix(in srgb,var(--m7vip-c1) 32%,transparent)!important;
        box-shadow:0 0 18px color-mix(in srgb,var(--m7vip-c2) 30%,transparent)!important;
        animation:m7vip-breathe calc(var(--m7vip-speed) * .72) ease-in-out infinite!important;
      }
      .m7vip-orbit,.m7vip-particles{position:absolute!important;inset:0!important;border-radius:50%!important;pointer-events:none!important}
      .m7vip-orbit-item{position:absolute!important;inset:0!important;animation:m7vip-orbit var(--m7vip-speed) linear infinite!important;animation-delay:var(--m7vip-delay,0s)!important}
      .${LAYER_CLASS}[data-direction="counter"] .m7vip-orbit-item{animation-direction:reverse!important}
      .m7vip-orbit-icon{
        position:absolute!important;
        left:50%!important;
        top:calc(0px - var(--m7vip-orbit-distance))!important;
        width:var(--m7vip-orbit-size)!important;
        height:var(--m7vip-orbit-size)!important;
        margin-left:calc(var(--m7vip-orbit-size) / -2)!important;
        display:grid!important;
        place-items:center!important;
        color:var(--m7vip-c3)!important;
        font-size:calc(var(--m7vip-orbit-size) * .78)!important;
        line-height:1!important;
        filter:drop-shadow(0 0 5px var(--m7vip-c1))!important;
        animation:m7vip-counter var(--m7vip-speed) linear infinite!important;
      }
      .${LAYER_CLASS}[data-direction="counter"] .m7vip-orbit-icon{animation-direction:reverse!important}
      .m7vip-orbit-icon img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;filter:drop-shadow(0 2px 4px rgba(0,0,0,.55))!important}
      .m7vip-particle{position:absolute!important;left:var(--m7vip-x)!important;top:var(--m7vip-y)!important;color:var(--m7vip-particle)!important;font-size:var(--m7vip-particle-size)!important;line-height:1!important;text-shadow:0 0 8px currentColor!important;opacity:0!important;animation:m7vip-float var(--m7vip-particle-speed) ease-in-out infinite!important;animation-delay:var(--m7vip-delay)!important}
      .${LAYER_CLASS}[data-particle="petals"] .m7vip-particle{transform:rotate(var(--m7vip-turn))}
      .${LAYER_CLASS}[data-quality="light"] .m7vip-particles{display:none!important}
      .${LAYER_CLASS}[data-quality="light"] .m7vip-ring::after{display:none!important}
      @keyframes m7vip-spin{to{transform:rotate(360deg)}}
      @keyframes m7vip-orbit{to{transform:rotate(360deg)}}
      @keyframes m7vip-counter{to{transform:rotate(-360deg)}}
      @keyframes m7vip-breathe{0%,100%{opacity:.48;transform:scale(.992)}50%{opacity:1;transform:scale(1.018)}}
      @keyframes m7vip-neon{0%,100%{opacity:.72;filter:brightness(.9)}50%{opacity:1;filter:brightness(1.28)}}
      @keyframes m7vip-float{0%{opacity:0;transform:translate3d(0,8px,0) scale(.65)}24%{opacity:.95}70%{opacity:.72}100%{opacity:0;transform:translate3d(var(--m7vip-drift),-25px,0) scale(1.12) rotate(24deg)}}
      @media(max-width:700px){
        .${LAYER_CLASS}[data-quality="balanced"] .m7vip-particle:nth-child(n+7){display:none!important}
        .${LAYER_CLASS}[data-quality="balanced"] .m7vip-orbit-item:nth-child(n+7){display:none!important}
      }
      @media(prefers-reduced-motion:reduce){
        #ma7alak-profile-shell:not([data-motion-mode="full"]) .${LAYER_CLASS} *{animation-duration:12s!important}
      }
    `;
    document.head.appendChild(style);
  }

  function locate(){
    shell=document.getElementById("ma7alak-profile-shell");
    wrapper=document.getElementById("ma7alak-story-wrapper");
    button=document.getElementById("ma7alak-story-button");
    return !!(shell&&wrapper&&button);
  }

  function ensureLayer(){
    if(!locate())return false;
    layer=wrapper.querySelector("."+LAYER_CLASS);
    if(!layer){
      layer=document.createElement("div");
      layer.className=LAYER_CLASS;
      layer.setAttribute("aria-hidden","true");
      layer.innerHTML='<div class="m7vip-ring"></div><div class="m7vip-orbit"></div><div class="m7vip-particles"></div>';
      wrapper.appendChild(layer);
    }
    return true;
  }

  function quality(){
    const selected=String(options.vip_mobile_quality||"balanced").toLowerCase();
    const valid=["full","balanced","light"].includes(selected)?selected:"balanced";
    return matchMedia("(max-width:700px)").matches?valid:"full";
  }

  function effectiveCount(raw,max,q){
    let count=Math.round(clamp(raw,0,max,0));
    if(q==="light")count=Math.min(count,3);
    if(q==="balanced")count=Math.min(count,6);
    return count;
  }

  function renderOrbit(q){
    const stage=layer.querySelector(".m7vip-orbit");
    stage.replaceChildren();
    if(!bool(options.vip_orbit_enabled,false))return;
    const count=effectiveCount(options.vip_orbit_count,8,q);
    const symbol=String(options.vip_orbit_symbol||"✦").trim().slice(0,12)||"✦";
    const imageUrl=safeUrl(options.vip_orbit_image_url);
    const speed=clamp(options.vip_ring_speed,1.5,14,5);
    for(let i=0;i<count;i++){
      const item=document.createElement("span");
      item.className="m7vip-orbit-item";
      item.style.setProperty("--m7vip-delay",(-speed*i/Math.max(1,count)).toFixed(3)+"s");
      const icon=document.createElement("span");
      icon.className="m7vip-orbit-icon";
      if(imageUrl){
        const img=document.createElement("img");
        img.src=imageUrl;
        img.alt="";
        img.loading="lazy";
        img.decoding="async";
        icon.appendChild(img);
      }else{
        icon.textContent=symbol;
      }
      item.appendChild(icon);
      stage.appendChild(item);
    }
  }

  function renderParticles(q){
    const stage=layer.querySelector(".m7vip-particles");
    stage.replaceChildren();
    const style=choice(options.vip_particle_style,ALLOWED_PARTICLES,"sparkles");
    if(style==="none"||q==="light")return;
    const count=effectiveCount(options.vip_particle_count,12,q);
    const symbol=PARTICLE_SYMBOLS[style]||"✦";
    const speed=clamp(options.vip_particle_speed,2,12,4.5);
    for(let i=0;i<count;i++){
      const particle=document.createElement("span");
      particle.className="m7vip-particle";
      particle.textContent=symbol;
      const seed=(i*47+19)%101;
      const seed2=(i*71+13)%97;
      particle.style.setProperty("--m7vip-x",(8+seed*.82).toFixed(1)+"%");
      particle.style.setProperty("--m7vip-y",(14+seed2*.70).toFixed(1)+"%");
      particle.style.setProperty("--m7vip-delay",(-speed*((i*37)%100)/100).toFixed(3)+"s");
      particle.style.setProperty("--m7vip-drift",(((i%5)-2)*6)+"px");
      particle.style.setProperty("--m7vip-turn",((i*43)%180)+"deg");
      particle.style.setProperty("--m7vip-particle-size",(7+(i%4)*2)+"px");
      stage.appendChild(particle);
    }
  }

  function syncSize(){
    if(!button||!layer)return;
    const rect=button.getBoundingClientRect();
    const base=Math.max(rect.width,rect.height,120);
    const distance=clamp(options.vip_orbit_distance,2,42,12);
    layer.style.setProperty("--m7vip-size",(base+10)+"px");
    layer.style.setProperty("--m7vip-orbit-distance",distance+"px");
  }

  function syncActive(){
    if(!layer||!wrapper)return;
    const enabled=bool(options.vip_effects_enabled,false);
    const mode=String(options.vip_ring_visibility||"unseen").toLowerCase();
    const hasNew=wrapper.classList.contains("story-has-new");
    const motionOff=String(shell?.dataset?.motionMode||"").toLowerCase()==="off";
    layer.dataset.active=enabled&&(mode==="always"||hasNew)?"1":"0";
    layer.dataset.paused=(!visible||document.hidden||motionOff)?"1":"0";
  }

  function apply(next){
    if(!next||typeof next!=="object"||Array.isArray(next))return;
    options={...options,...next};
    if(!ensureLayer())return;

    const accent=hex(options.story_color||options.card_color,"#d9a441");
    const c1=hex(options.vip_ring_color_1,hex(options.profile_ring_color,accent));
    const c2=hex(options.vip_ring_color_2,accent);
    const c3=hex(options.vip_ring_color_3,"#ffffff");
    const particle=hex(options.vip_particle_color,c1);
    const q=quality();

    layer.dataset.ring=choice(options.vip_ring_style,ALLOWED_RING,"aurora");
    layer.dataset.direction=String(options.vip_orbit_direction||"").toLowerCase()==="counter"?"counter":"clockwise";
    layer.dataset.particle=choice(options.vip_particle_style,ALLOWED_PARTICLES,"sparkles");
    layer.dataset.quality=q;
    layer.style.setProperty("--m7vip-c1",c1);
    layer.style.setProperty("--m7vip-c2",c2);
    layer.style.setProperty("--m7vip-c3",c3);
    layer.style.setProperty("--m7vip-particle",particle);
    layer.style.setProperty("--m7vip-width",clamp(options.vip_ring_width,1,10,4)+"px");
    layer.style.setProperty("--m7vip-speed",clamp(options.vip_ring_speed,1.5,14,5)+"s");
    layer.style.setProperty("--m7vip-particle-speed",clamp(options.vip_particle_speed,2,12,4.5)+"s");
    layer.style.setProperty("--m7vip-orbit-size",clamp(options.vip_orbit_size,8,42,18)+"px");

    renderOrbit(q);
    renderParticles(q);
    syncSize();
    syncActive();
  }

  function receive(event){
    const detail=event?.detail||{};
    const eventSlug=String(detail.shop_slug||detail.shopSlug||"").trim().toLowerCase();
    const current=slug();
    if(eventSlug&&current&&eventSlug!==current)return;
    apply(detail.directory_options);
  }

  function observe(){
    resizeObserver?.disconnect();
    storyObserver?.disconnect();
    intersectionObserver?.disconnect();

    if("ResizeObserver" in window){
      resizeObserver=new ResizeObserver(syncSize);
      resizeObserver.observe(button);
    }
    storyObserver=new MutationObserver(syncActive);
    storyObserver.observe(wrapper,{attributes:true,attributeFilter:["class"]});
    if("IntersectionObserver" in window){
      intersectionObserver=new IntersectionObserver(entries=>{
        visible=!!entries[0]?.isIntersecting;
        syncActive();
      },{rootMargin:"120px 0px"});
      intersectionObserver.observe(wrapper);
    }
  }

  function boot(){
    installCss();
    if(!ensureLayer()){
      if(bootTimer<120){
        bootTimer++;
        setTimeout(boot,50);
      }
      return;
    }
    observe();
    apply(cachedOptions()||{});
  }

  window.addEventListener("ma7alak:profile-design-preview",receive);
  window.addEventListener("ma7alak:profile-design-saved",receive);
  window.addEventListener("ma7alak:profile-draft-preview",receive);
  document.addEventListener("visibilitychange",syncActive);
  window.addEventListener("resize",()=>{syncSize();apply(options);},{passive:true});

  window.ShoufHonVipEffects={apply,refresh:function(){apply(options);}};
  boot();
})();
