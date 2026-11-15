import type {SupabaseClient} from '@supabase/supabase-js';

/**
 * Staging-only repository adapter. NOT wired to the current Pulse UI.
 * Never instantiate with the production Supabase client until the isolated
 * environment has passed cross-account and consent integration tests.
 */
export const PULSE_AREAS=['agent','checkins','goals','agenda_alerts','reminders','wellbeing','cycle'] as const;
export type PulseArea=(typeof PULSE_AREAS)[number];
export const PULSE_PURPOSES=['pulse_storage','wellbeing_storage','cycle_storage','cycle_agent_access'] as const;
export type PulsePurpose=(typeof PULSE_PURPOSES)[number];
export type PulseDocument={area:PulseArea;payload:Record<string,unknown>;updated_at:string};
export type PulseConsent={purpose:PulsePurpose;granted:boolean;updated_at:string};

const purposeFor=(area:PulseArea):PulsePurpose=>area==='cycle'?'cycle_storage':area==='wellbeing'?'wellbeing_storage':'pulse_storage';
const isObject=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const MAX_BYTES=64*1024;
const validPayload=(value:unknown):value is Record<string,unknown>=>{
 if(!isObject(value))return false;
 try{return new TextEncoder().encode(JSON.stringify(value)).length<=MAX_BYTES}catch{return false}
};

export function createPulseStagingRepository(db:SupabaseClient){
 const authenticatedUser=async()=>{
  const {data,error}=await db.auth.getUser();
  if(error||!data.user)throw new Error('Sessão INVICTAS necessária.');
  return data.user.id;
 };
 const consent=async(purpose:PulsePurpose)=>{
  const userId=await authenticatedUser();
  const {data,error}=await db.from('pulse_consents').select('granted').eq('user_id',userId).eq('purpose',purpose).maybeSingle();
  if(error)throw error;
  return data?.granted===true;
 };
 const requireConsent=async(area:PulseArea)=>{
  if(!(await consent(purposeFor(area))))throw new Error('Consentimento específico necessário.');
 };
 return {
  async getConsent(purpose:PulsePurpose){return consent(purpose)},
  async setConsent(purpose:PulsePurpose,granted:boolean){
   const userId=await authenticatedUser();
   const {error}=await db.from('pulse_consents').upsert({user_id:userId,purpose,granted,updated_at:new Date().toISOString()},{onConflict:'user_id,purpose'});
   if(error)throw error;
  },
  async read(area:PulseArea):Promise<PulseDocument|null>{
   await requireConsent(area);
   const userId=await authenticatedUser();
   const {data,error}=await db.from('pulse_documents').select('area,payload,updated_at').eq('user_id',userId).eq('area',area).maybeSingle();
   if(error)throw error;
   if(!data)return null;
   if(!validPayload(data.payload))throw new Error('Formato dos dados Pulse inválido.');
   return {area,payload:data.payload,updated_at:data.updated_at};
  },
  async write(area:PulseArea,payload:Record<string,unknown>){
   if(!validPayload(payload))throw new Error('Dados Pulse inválidos ou demasiado grandes.');
   await requireConsent(area);
   const userId=await authenticatedUser();
   const {error}=await db.from('pulse_documents').upsert({user_id:userId,area,payload,updated_at:new Date().toISOString()},{onConflict:'user_id,area'});
   if(error)throw error;
  },
  async erase(area:PulseArea){
   const userId=await authenticatedUser();
   const {error}=await db.from('pulse_documents').delete().eq('user_id',userId).eq('area',area);
   if(error)throw error;
  },
  async exportOwnData(){
   const userId=await authenticatedUser();
   const {data,error}=await db.from('pulse_documents').select('area,payload,updated_at').eq('user_id',userId);
   if(error)throw error;
   return (data||[]).filter(row=>PULSE_AREAS.includes(row.area as PulseArea)&&validPayload(row.payload));
  },
  async eraseAll(){
   const userId=await authenticatedUser();
   const {error:documentsError}=await db.from('pulse_documents').delete().eq('user_id',userId);
   if(documentsError)throw documentsError;
   const {error:consentsError}=await db.from('pulse_consents').delete().eq('user_id',userId);
   if(consentsError)throw consentsError;
  }
 };
}
