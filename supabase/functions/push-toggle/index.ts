const allowedOrigins=new Set([
  "https://shoufhon.com",
  "https://www.shoufhon.com"
]);

function headers(req:Request){
  const origin=req.headers.get("origin")||"";
  return {
    "Access-Control-Allow-Origin":allowedOrigins.has(origin)?origin:"https://shoufhon.com",
    "Vary":"Origin",
    "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods":"POST, OPTIONS",
    "Content-Type":"application/json"
  };
}

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS"){
    return new Response("ok",{headers:headers(req)});
  }

  return new Response(
    JSON.stringify({
      success:false,
      disabled:true,
      error:"Legacy push-toggle endpoint retired. Use push-subscribe."
    }),
    {status:410,headers:headers(req)}
  );
});
