import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async()=>{
  return Response.json(
    {ok:false,disabled:true},
    {status:410}
  )
})
