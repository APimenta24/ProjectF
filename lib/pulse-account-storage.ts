import {supabase} from './supabase';

/** Pulse account persistence. Not connected to UI until account isolation tests pass. */
export const PULSE_AREAS=['agent','checkins','goals','agenda_alerts','reminders','wellbeing','cycle'] as const;
export type PulseArea=typeof PULSE_AREAS[number];
export type PulsePurpose='pulse_storage'|'wellbeing_storage'|'cycle_storage'|'cycle_agent_access';
const MAX_BYTES=64*1024;
function validateArea(area:string):asserts area is PulseArea{
 if(!PULSE_AREAS.includes(area as PulseArea))throw new Error('Área Pulse inválida.');
}
function validatePayload(payload:unknown){
 if(!payload||typeof payload!=='object'||Array.isArray(payload))throw new Error('Formato de registo inválido.');
 const size=new TextEncoder().encode(JSON.stringify(payload)).length;
 if(size>MAX_BYTES)throw new Error('Registo demasiado grande para sincronizar.');
}
async function authenticated(){
 const db=supabase();
 if(!db)throw new Error('A ligação à conta não está disponível.');
 const {data,error}=await db.auth.getUser();
 if(error||!data.user)throw new Error('Inicia sessão na INVICTAS.');
 return {db,userId:data.user.id};
}
export async function setPulseConsent(purpose:PulsePurpose,granted:boolean){
 const {db,userId}=await authenticated();
 const {error}=await db.from('pulse_consents').upsert({user_id:userId,purpose,granted,updated_at:new Date().toISOString()},{onConflict:'user_id,purpose'});
 if(error)throw new Error('Não foi possível guardar a autorização.');
}
export async function getPulseConsent(purpose:PulsePurpose):Promise<boolean>{
 const {db,userId}=await authenticated();
 const {data,error}=await db.from('pulse_consents').select('granted').eq('user_id',userId).eq('purpose',purpose).maybeSingle();
 if(error)throw new Error('Não foi possível consultar a autorização.');
 return data?.granted===true;
}
export async function readPulseDocument(area:PulseArea):Promise<Record<string,unknown>|null>{
 validateArea(area);
 const {db,userId}=await authenticated();
 const {data,error}=await db.from('pulse_documents').select('payload').eq('user_id',userId).eq('area',area).maybeSingle();
 if(error)throw new Error('Não foi possível carregar o registo da conta.');
 return (data?.payload as Record<string,unknown>|undefined)??null;
}
export async function writePulseDocument(area:PulseArea,payload:Record<string,unknown>){
 validateArea(area);validatePayload(payload);
 const {db,userId}=await authenticated();
 const purpose:PulsePurpose=area==='cycle'?'cycle_storage':area==='wellbeing'?'wellbeing_storage':'pulse_storage';
 if(!(await getPulseConsent(purpose)))throw new Error('Autoriza primeiro o armazenamento desta área.');
 const {error}=await db.from('pulse_documents').upsert({user_id:userId,area,payload,updated_at:new Date().toISOString()},{onConflict:'user_id,area'});
 if(error)throw new Error('Não foi possível sincronizar o registo.');
}
export async function deletePulseDocument(area:PulseArea){
 validateArea(area);
 const {db,userId}=await authenticated();
 const {error}=await db.from('pulse_documents').delete().eq('user_id',userId).eq('area',area);
 if(error)throw new Error('Não foi possível apagar o registo.');
}
