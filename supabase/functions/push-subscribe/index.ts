import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL=Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC_KEY=Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY=Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT=Deno.env.get("VAPID_SUBJECT")||"https://shoufhon.com";

const supabase=createClient(SUPABASE_URL,SERVICE_ROLE_KEY,{
  auth:{autoRefreshToken:false,persistSession:false}
});

webpush.setVapidDetails(VAPID_SUBJECT,VAPID_PUBLIC_KEY,VAPID_PRIVATE_KEY);

const allowedOrigins=new Set([
  "https://shoufhon.com",
  "https://www.shoufhon.com"
]);

function corsHeaders(req:Request){
  const origin=req.headers.get("origin")||"";
  return {
    "Access-Control-Allow-Origin":allowedOrigins.has(origin)?origin:"https://shoufhon.com",
    "Vary":"Origin",
    "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods":"POST, OPTIONS"
  };
}

function json(req:Request,body:unknown,status=200){
  return new Response(JSON.stringify(body),{
    status,
    headers:{...corsHeaders(req),"Content-Type":"application/json"}
  });
}

function validText(value:unknown,max:number){
  const valueText=String(value||"").trim();
  return valueText&&valueText.length<=max?valueText:"";
}

function validVisitor(value:string){
  return /^[A-Za-z0-9._:-]{8,180}$/.test(value);
}

function validPushKey(value:string,max:number){
  return value.length>=8&&value.length<=max&&/^[A-Za-z0-9_-]+$/.test(value);
}

function allowedPushEndpoint(value:string){
  try{
    const url=new URL(value);
    if(url.protocol!=="https:")return false;
    const host=url.hostname.toLowerCase();
    return (
      host==="fcm.googleapis.com" ||
      host==="updates.push.services.mozilla.com" ||
      host==="web.push.apple.com" ||
      host.endsWith(".push.apple.com") ||
      host.endsWith(".notify.windows.com")
    );
  }catch{
    return false;
  }
}

async function authenticatedUserId(req:Request){
  const authHeader=req.headers.get("Authorization")||"";
  if(!authHeader.startsWith("Bearer "))return null;
  const token=authHeader.slice(7).trim();
  if(!token)return null;
  const {data,error}=await supabase.auth.getUser(token);
  if(error||!data?.user?.id)return null;
  return data.user.id;
}

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:corsHeaders(req)});
  if(req.method!=="POST")return json(req,{success:false,error:"Method not allowed"},405);

  try{
    const body=await req.json();
    const action=String(body.action||"subscribe").trim().toLowerCase();
    const userId=await authenticatedUserId(req);
    const visitorId=validText(body.visitor_id,180);
    const endpoint=validText(body.endpoint,4096);

    if(!visitorId||!validVisitor(visitorId)||!endpoint||!allowedPushEndpoint(endpoint)){
      return json(req,{success:false,error:"Invalid push subscription"},400);
    }

    const {data:existing,error:existingError}=await supabase
      .from("push_subscriptions")
      .select("id,visitor_id,user_id,enabled")
      .eq("endpoint",endpoint)
      .maybeSingle();

    if(existingError)throw existingError;

    const ownsExisting=
      !!existing&&(
        String(existing.visitor_id||"")===visitorId ||
        (!!userId&&!!existing.user_id&&String(existing.user_id)===String(userId))
      );

    if(action==="disable"){
      if(!existing)return json(req,{success:true,enabled:false,updated:0});
      if(!ownsExisting)return json(req,{success:false,error:"Subscription ownership mismatch"},403);

      const {error}=await supabase
        .from("push_subscriptions")
        .update({enabled:false,updated_at:new Date().toISOString()})
        .eq("id",existing.id);

      if(error)throw error;
      return json(req,{success:true,enabled:false,updated:1});
    }

    if(action!=="subscribe"){
      return json(req,{success:false,error:"Unsupported action"},400);
    }

    const p256dh=validText(body.p256dh,1024);
    const auth=validText(body.auth,1024);
    const userAgent=validText(body.user_agent,1024);

    if(!p256dh||!auth||!validPushKey(p256dh,1024)||!validPushKey(auth,1024)){
      return json(req,{success:false,error:"Invalid subscription keys"},400);
    }

    if(existing&&!ownsExisting){
      return json(req,{success:false,error:"Subscription ownership mismatch"},409);
    }

    if(!existing){
      const {count,error:countError}=await supabase
        .from("push_subscriptions")
        .select("id",{count:"exact",head:true})
        .eq("visitor_id",visitorId);

      if(countError)throw countError;
      if((count||0)>=8){
        return json(req,{success:false,error:"Too many subscriptions for this browser identity"},429);
      }
    }

    const now=new Date().toISOString();
    let data:any=null;

    if(existing?.id){
      const {data:updated,error}=await supabase
        .from("push_subscriptions")
        .update({
          visitor_id:visitorId,
          p256dh,
          auth,
          user_agent:userAgent||null,
          user_id:userId||existing.user_id||null,
          enabled:true,
          updated_at:now
        })
        .eq("id",existing.id)
        .select("id,enabled,user_id")
        .single();

      if(error)throw error;
      data=updated;
    }else{
      const {data:inserted,error}=await supabase
        .from("push_subscriptions")
        .insert({
          visitor_id:visitorId,
          endpoint,
          p256dh,
          auth,
          user_agent:userAgent||null,
          user_id:userId,
          enabled:true,
          updated_at:now
        })
        .select("id,enabled,user_id")
        .single();

      if(error)throw error;
      data=inserted;
    }

    let testSent=false;

    if(body.send_test===true&&!existing){
      try{
        await webpush.sendNotification(
          {endpoint,keys:{p256dh,auth}},
          JSON.stringify({
            title:"ShoufHon",
            body:"Notifications are on 🔔",
            url:"https://shoufhon.com/",
            icon:"https://shoufhon.com/pwa-icon-192.png",
            type:"push-ready",
            tag:"shoufhon-push-ready"
          }),
          {TTL:300}
        );
        testSent=true;
      }catch(error){
        console.error("WELCOME PUSH FAILED:",error);
      }
    }

    return json(req,{
      success:true,
      enabled:true,
      id:data?.id||null,
      linked_user:!!data?.user_id,
      test_sent:testSent
    });
  }catch(error:any){
    console.error("PUSH SUBSCRIBE ERROR:",error);
    return json(req,{success:false,error:error?.message||String(error)},500);
  }
});
