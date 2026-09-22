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
    console.error('CLEANUP AUTH ERROR',error)
    return false
  }
  return data===true
}

function unique(values:(string|null|undefined)[]){
  return [...new Set(values.map(v=>String(v||'').trim()).filter(Boolean))]
}

function livePath(value:string|null|undefined){
  const url=String(value||'')
  const marker='/storage/v1/object/public/live-offers/'
  const index=url.indexOf(marker)
  if(index<0)return ''
  try{
    return decodeURIComponent(url.slice(index+marker.length).split('?')[0])
  }catch{
    return ''
  }
}

Deno.serve(async(req)=>{
  if(req.method!=='POST'){
    return Response.json({ok:false,error:'POST required'},{status:405})
  }

  if(!(await authorized(req))){
    return Response.json({ok:false,error:'Unauthorized'},{status:401})
  }

  try{
    const now=new Date().toISOString()

    const {data:storyRows,error:storyError}=await db
      .from('shop_stories')
      .select('id,storage_path')
      .lte('expires_at',now)
      .limit(1000)

    if(storyError)throw storyError

    const storyIds=(storyRows??[]).map((r:any)=>Number(r.id)).filter(Number.isFinite)
    const storyPaths=unique((storyRows??[]).map((r:any)=>r.storage_path))

    if(storyPaths.length){
      const removal=await db.storage.from('shop-stories').remove(storyPaths)
      if(removal.error)throw removal.error
    }

    if(storyIds.length){
      for(const table of [
        'story_like_notifications',
        'story_likes',
        'story_views',
        'ma7alak_owner_notifications'
      ]){
        const result=await db.from(table).delete().in('story_id',storyIds)
        if(result.error)throw result.error
      }

      const result=await db.from('shop_stories').delete().in('id',storyIds)
      if(result.error)throw result.error
    }

    const {data:liveRows,error:liveError}=await db
      .from('shop_live_posts')
      .select('id,media_url,status,ends_at')
      .or(`status.neq.active,ends_at.lte.${now}`)
      .limit(1000)

    if(liveError)throw liveError

    const liveIds=(liveRows??[]).map((r:any)=>Number(r.id)).filter(Number.isFinite)

    let childRows:any[]=[]
    if(liveIds.length){
      const media=await db
        .from('shop_live_post_media')
        .select('post_id,storage_path,media_url')
        .in('post_id',liveIds)

      if(media.error)throw media.error
      childRows=media.data??[]
    }

    const livePaths=unique([
      ...childRows.map((r:any)=>r.storage_path),
      ...childRows.map((r:any)=>livePath(r.media_url)),
      ...(liveRows??[]).map((r:any)=>livePath(r.media_url))
    ])

    if(livePaths.length){
      const removal=await db.storage.from('live-offers').remove(livePaths)
      if(removal.error)throw removal.error
    }

    if(liveIds.length){
      const result=await db.from('shop_live_posts').delete().in('id',liveIds)
      if(result.error)throw result.error
    }

    const orphanResult=await db.rpc('ma7alak_find_orphan_media',{p_limit:500})
    if(orphanResult.error)throw orphanResult.error

    const orphanRows=orphanResult.data??[]
    let orphanFilesDeleted=0

    for(const bucket of ['live-offers','shop-videos']){
      const paths=unique(
        orphanRows
          .filter((r:any)=>String(r.bucket_id||'')===bucket)
          .map((r:any)=>r.path)
      )

      if(paths.length){
        const removal=await db.storage.from(bucket).remove(paths)
        if(removal.error)throw removal.error
        orphanFilesDeleted+=paths.length
      }
    }

    return Response.json({
      ok:true,
      storiesDeleted:storyIds.length,
      storyFilesDeleted:storyPaths.length,
      livePostsDeleted:liveIds.length,
      liveFilesDeleted:livePaths.length,
      orphanFilesDeleted,
      ranAt:new Date().toISOString()
    })
  }catch(error){
    console.error(error)
    return Response.json(
      {ok:false,error:error instanceof Error?error.message:String(error)},
      {status:500}
    )
  }
})
