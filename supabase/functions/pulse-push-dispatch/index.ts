// Server-only Edge Function. Deploy only after configuring secrets and explicit release approval.
// Invocation: POST with Authorization: Bearer <PULSE_PUSH_CRON_SECRET>.
// Deno-compatible npm:web-push module. No sensitive text is sent to lock screens.
import webpush from 'npm:web-push@3.6.7';
import {createClient} from 'npm:@supabase/supabase-js@2.49.0';

Deno.serve(async (request:Request)=>{
 if(request.method!=='POST')return new Response('Method not allowed',{status:405});
 const cronSecret=Deno.env.get('PULSE_PUSH_CRON_SECRET');
 const publicKey=Deno.env.get('PULSE_VAPID_PUBLIC_KEY');
 const privateKey=Deno.env.get('PULSE_VAPID_PRIVATE_KEY');
 const subject=Deno.env.get('PULSE_VAPID_SUBJECT');
 const url=Deno.env.get('SUPABASE_URL');
 const serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
 if(!cronSecret||cronSecret.length<32||!publicKey||!privateKey||!subject||!url||!serviceKey)return new Response('Service not configured',{status:503});
 if(request.headers.get('authorization')!==`Bearer ${cronSecret}`)return new Response('Unauthorized',{status:401});
 webpush.setVapidDetails(subject,publicKey,privateKey);
 const db=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const now=new Date().toISOString();
 // After a worker crash, mark stale jobs failed rather than risking duplicate delivery.
 const timeout=new Date(Date.now()-15*60_000).toISOString();
 const {error:staleError}=await db.from('pulse_push_jobs').update({status:'failed'}).eq('status','processing').lt('claimed_at',timeout);
 if(staleError)return new Response('Recovery unavailable',{status:503});
 const {data:jobs,error}=await db.from('pulse_push_jobs').select('id,user_id,kind,scheduled_for,attempts').eq('status','pending').lte('scheduled_for',now).lt('attempts',5).order('scheduled_for',{ascending:true}).limit(50);
 if(error)return new Response('Queue unavailable',{status:503});
 let delivered=0,failed=0;
 for(const job of jobs??[]){
  // Optimistic claim: only one worker can change pending -> processing.
  const {data:claimed,error:claimError}=await db.from('pulse_push_jobs').update({status:'processing',claimed_at:new Date().toISOString(),attempts:job.attempts+1}).eq('id',job.id).eq('status','pending').select('id').maybeSingle();
  if(claimError||!claimed)continue;
  try{
   const {data:consent}=await db.from('pulse_consents').select('granted').eq('user_id',job.user_id).eq('purpose','push_notifications').maybeSingle();
   if(consent?.granted!==true){await db.from('pulse_push_jobs').update({status:'cancelled'}).eq('id',job.id);continue}
   const {data:subscriptions,error:subError}=await db.from('pulse_push_subscriptions').select('id,endpoint,p256dh,auth_secret').eq('user_id',job.user_id).eq('enabled',true);
   if(subError)throw subError;
   let deliveryErrors=0;
   for(const sub of subscriptions??[]){
    try{
     await webpush.sendNotification({endpoint:sub.endpoint,keys:{p256dh:sub.p256dh,auth:sub.auth_secret}},JSON.stringify({type:'pulse-reminder'}),{TTL:3600,urgency:'normal'});
     delivered++;
    }catch(e){
     const code=(e as {statusCode?:number}).statusCode;
     if(code===404||code===410)await db.from('pulse_push_subscriptions').delete().eq('id',sub.id);
     else {failed++;deliveryErrors++;}
    }
   }
   // A partial batch must not be retried automatically, or users may get duplicates.
   const finalStatus=deliveryErrors>0?'failed':'sent';
   const {error:finalError}=await db.from('pulse_push_jobs').update({status:finalStatus,sent_at:finalStatus==='sent'?new Date().toISOString():null}).eq('id',job.id).eq('status','processing');
   if(finalError)throw finalError;
  }catch{
   await db.from('pulse_push_jobs').update({status:'failed'}).eq('id',job.id);
   failed++;
  }
 }
 return Response.json({processed:jobs?.length??0,delivered,failed});
});
