/* MA7ALAK CHAT RECOVERY
   Safe companion for ma7alak-chat.js.
   Prevents the Messages panel from remaining on Loading forever and retries
   the correct viewer/owner inbox after auth has finished initializing.
*/
(function(){
"use strict";
if(window.__MA7ALAK_CHAT_RECOVERY__)return;
window.__MA7ALAK_CHAT_RECOVERY__=true;

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let watching=false;

function body(){return document.querySelector("#m7-chat-body");}
function isLoading(){const b=body();return !!b && !!b.querySelector(".m7-loading");}
function showError(message){const b=body();if(!b||!isLoading())return;b.innerHTML='<div class="m7-error">Could not finish loading Messages.<br><small>'+String(message||"Please close Messages and try again.").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))+'</small></div>';}

async function authState(){
  try{
    if(window.Ma7alakOwnerAuth){
      await Promise.race([window.Ma7alakOwnerAuth.ready(),sleep(5000)]);
      if(window.Ma7alakOwnerAuth.owner&&window.Ma7alakOwnerAuth.user)return "owner";
    }
  }catch(_){}
  try{
    if(window.Ma7alakAccount){
      await Promise.race([window.Ma7alakAccount.ready(),sleep(5000)]);
      if(window.Ma7alakAccount.user)return "viewer";
    }
  }catch(_){}
  return "none";
}

async function recover(){
  if(watching)return;
  watching=true;
  try{
    await sleep(2500);
    if(!isLoading())return;
    const mode=await authState();
    if(!isLoading())return;
    if(!window.Ma7alakChat){showError("Chat system is not ready.");return;}

    /* Retry once after all auth bridges have settled. */
    if(mode==="owner"&&typeof window.Ma7alakChat.openOwnerInbox==="function"){
      window.Ma7alakChat.close();
      await sleep(100);
      window.Ma7alakChat.openOwnerInbox();
    }else if(mode==="viewer"&&typeof window.Ma7alakChat.openViewerInbox==="function"){
      window.Ma7alakChat.close();
      await sleep(100);
      window.Ma7alakChat.openViewerInbox();
    }else{
      showError("Your account session is not ready. Close Messages, sign in again, then reopen it.");
      return;
    }

    await sleep(10000);
    if(isLoading()) showError("The conversation request timed out. This is usually a database policy/RPC issue rather than the chat window itself.");
  }finally{
    watching=false;
  }
}

/* Catch every Messages open path without changing existing buttons/UI. */
addEventListener("ma7alak:open-messages",()=>setTimeout(recover,0));
addEventListener("ma7alak:open-owner-messages",()=>setTimeout(recover,0));
addEventListener("ma7alak:open-chat",()=>setTimeout(recover,0));
document.addEventListener("click",e=>{
  if(e.target.closest("#m7-header-messages,#m7-owner-messages,.ma7alak-message-btn,[data-ma7alak-message]"))setTimeout(recover,0);
},true);

/* Also catch panels opened directly through Ma7alakChat methods. */
const observer=new MutationObserver(()=>{if(isLoading())setTimeout(recover,0);});
function boot(){observer.observe(document.documentElement,{childList:true,subtree:true});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();