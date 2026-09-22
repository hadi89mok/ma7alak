import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.57.4'

const db=createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  {auth:{persistSession:false}}
)

async function authorized(req:Request){
  const provided=String(req.headers.get('x-ma7alak-cleanup-key')||'').trim()
  if(!provided)return false
  const {data,error}=await db.rpc('shoufhon_verify_cleanup_key',{p_secret:provided})
  if(error){
    console.error('MEDIA CLEANUP AUTH ERROR',error)
    return false
  }
  return data===true
}

Deno.serve(async(req)=>{
  if(req.method!=='POST'){
    return Response.json({ok:false,error:'POST required'},{status:405})
  }

  if(!(await authorized(req))){
    return Response.json({ok:false,error:'Unauthorized'},{status:401})
  }

  try{
    const {data:rows,error}=await db
      .from('shop_stories')
      .select('id,storage_path')
      .lte('expires_at',new Date().toISOString())
      .limit(1000)

    if(error)throw error

    const paths=(rows??[]).map((r:any)=>r.storage_path).filter(Boolean)

    if(paths.length){
      const r=await db.storage.from('shop-stories').remove(paths)
      if(r.error)throw r.error
    }

    const ids=(rows??[]).map((r:any)=>r.id)

    if(ids.length){
      for(const table of [
        'story_like_notifications',
        'story_likes',
        'story_views',
        'ma7alak_owner_notifications'
      ]){
        const r=await db.from(table).delete().in('story_id',ids)
        if(r.error)throw r.error
      }

      const r=await db.from('shop_stories').delete().in('id',ids)
      if(r.error)throw r.error
    }

    return Response.json({
      ok:true,
      expiredStoriesDeleted:ids.length,
      filesDeleted:paths.length,
      ranAt:new Date().toISOString()
    })
  }catch(e){
    console.error(e)
    return Response.json(
      {ok:false,error:e instanceof Error?e.message:String(e)},
      {status:500}
    )
  }
})
