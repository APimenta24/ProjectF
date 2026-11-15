'use client';
import {useState} from 'react';
import {getPulseConsent,readPulseDocument,setPulseConsent,writePulseDocument} from '../../lib/pulse-account-storage';

const areas=[
 {area:'agent' as const,key:'invictas-pulse-agent-v2-',label:'Agenda e atividade'},
 {area:'checkins' as const,key:'invictas-pulse-phase1-v2-',label:'Check-ins'},
 {area:'goals' as const,key:'invictas-pulse-phase2-v2-',label:'Objetivos e conquistas'},
 {area:'agenda_alerts' as const,key:'invictas-pulse-agenda-alerts-v1-',label:'Alertas da agenda'},
 {area:'reminders' as const,key:'invictas-pulse-reminders-v1-',label:'Preferências de lembretes'}
];
export default function PulseAccountSync({userId}:{userId:string}){
 const [busy,setBusy]=useState(false),[status,setStatus]=useState('');
 const [details,setDetails]=useState(false);
 const execute=async(mode:'upload'|'download')=>{
  if(busy)return;
  setBusy(true);setStatus('');
  try{
   if(!(await getPulseConsent('pulse_storage'))){
    if(mode==='download')throw new Error('Autoriza primeiro a sincronização.');
    if(!window.confirm('Queres guardar na tua conta INVICTAS os registos Pulse deste dispositivo? Podes revogar esta autorização mais tarde.')){setStatus('Operação cancelada.');return;}
    await setPulseConsent('pulse_storage',true);
   }
   let count=0,skipped=0;
   for(const item of areas){
    const key=item.key+userId;
    if(mode==='upload'){
     const raw=localStorage.getItem(key);
     if(!raw){skipped++;continue}
     const parsed:unknown=JSON.parse(raw);
     const payload=Array.isArray(parsed)?{items:parsed}:parsed;
     if(!payload||typeof payload!=='object'||Array.isArray(payload)){skipped++;continue}
     // Do not overwrite account data without an explicit per-area decision.
     const existing=await readPulseDocument(item.area);
     if(existing&&!window.confirm('Já existem dados na conta para «'+item.label+'». Substituir pelos dados deste dispositivo?')){skipped++;continue}
     await writePulseDocument(item.area,payload as Record<string,unknown>);
     count++;
    }else{
     const remote=await readPulseDocument(item.area);
     if(!remote){skipped++;continue}
     const existing=localStorage.getItem(key);
     if(existing&&!window.confirm('Já existem dados neste dispositivo para «'+item.label+'». Substituir pelos dados da conta?')){skipped++;continue}
     const value=item.area==='checkins'&&Array.isArray(remote.items)?remote.items:remote;
     localStorage.setItem(key,JSON.stringify(value));
     count++;
    }
   }
   if(mode==='download'&&count){window.dispatchEvent(new Event('invictas-pulse-settings-changed'));window.dispatchEvent(new Event('invictas-pulse-goals-changed'))}
   setStatus(mode==='upload'?count+' área(s) guardada(s) na conta; '+skipped+' ignorada(s).':count+' área(s) recuperada(s); '+skipped+' ignorada(s). Reabre o Pulse se algum registo não atualizar.');
  }catch(e){setStatus(e instanceof Error?e.message:'Não foi possível concluir a operação. Nenhum dado local foi apagado.')}
  finally{setBusy(false)}
 };
 return <section className="pulse-account-sync" aria-label="Sincronização Pulse"><button type="button" onClick={()=>setDetails(v=>!v)} aria-expanded={details}>Dados da conta {details?'−':'+'}</button>{details&&<div><p>Guarda ou recupera os teus registos da conta INVICTAS. Nesta fase, a sincronização é manual e exige autorização. O ciclo e os dados de bem-estar não são enviados por esta função.</p><div className="pulse-account-sync-actions"><button type="button" disabled={busy} onClick={()=>void execute('upload')}>Guardar na conta</button><button type="button" disabled={busy} onClick={()=>void execute('download')}>Recuperar da conta</button></div><small>Se já existirem dados, podes decidir separadamente se os substituis. A sincronização automática e a resolução de conflitos ficam para uma etapa posterior.</small>{status&&<p role="status">{status}</p>}</div>}</section>;
}
