'use client';
import {useEffect,useRef,useState} from 'react';
import {deletePulseDocument,getPulseConsent,readPulseDocument,readPulseSnapshot,setPulseConsent,writePulseDocument,writePulseIfUnchanged} from '../../lib/pulse-account-storage';

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
 const [auto,setAuto]=useState(false);
 const [conflicts,setConflicts]=useState<string[]>([]);
 const syncing=useRef(false);
 // Personal notes and check-ins require an explicit manual action, never background sync.
 const automaticAreas=areas.filter(item=>item.area!=='agent'&&item.area!=='checkins');
 const baseline=useRef<Record<string,string>>({});
 const automatic=async()=>{
  if(syncing.current||busy||!navigator.onLine)return;
  syncing.current=true;
  try{
   if(!(await getPulseConsent('pulse_storage')))return;
   const nextConflicts:string[]=[];
   for(const item of automaticAreas){
    const key=item.key+userId;
    const local=localStorage.getItem(key);
    const snapshot=await readPulseSnapshot(item.area);
    const remote=snapshot?.payload??null;
    const remoteValue=remote?JSON.stringify(item.area==='checkins'&&Array.isArray(remote.items)?remote.items:remote):null;
    const previous=baseline.current[item.area];
    if(local===remoteValue){baseline.current[item.area]=local??'';continue}
    if(!local&&remoteValue){
     localStorage.setItem(key,remoteValue);
     baseline.current[item.area]=remoteValue;
     window.dispatchEvent(new Event('invictas-pulse-settings-changed'));
     window.dispatchEvent(new Event('invictas-pulse-goals-changed'));
     continue;
    }
    if(local&&!remote){
     const parsed:unknown=JSON.parse(local);
     const payload=Array.isArray(parsed)?{items:parsed}:parsed;
     if(payload&&typeof payload==='object'&&!Array.isArray(payload)){
      if(await writePulseIfUnchanged(item.area,payload as Record<string,unknown>,null))baseline.current[item.area]=local;
      else nextConflicts.push(item.label);
     }
     continue;
    }
    // Write only if the remote timestamp still matches the version just read.
    if(local&&remoteValue&&previous===remoteValue&&snapshot){
     const parsed:unknown=JSON.parse(local);
     const payload=Array.isArray(parsed)?{items:parsed}:parsed;
     if(payload&&typeof payload==='object'&&!Array.isArray(payload)){
      if(await writePulseIfUnchanged(item.area,payload as Record<string,unknown>,snapshot.updatedAt))baseline.current[item.area]=local;
      else nextConflicts.push(item.label);
     }
     continue;
    }
    if(local&&remoteValue&&previous===local){
     localStorage.setItem(key,remoteValue);
     baseline.current[item.area]=remoteValue;
     window.dispatchEvent(new Event('invictas-pulse-settings-changed'));
     window.dispatchEvent(new Event('invictas-pulse-goals-changed'));
     continue;
    }
    nextConflicts.push(item.label);
   }
   setConflicts(nextConflicts);
   setStatus(nextConflicts.length?'Existem diferenças entre dispositivos. Resolve-as manualmente em Dados da conta.':'Dados da conta verificados.');
  }catch(e){setStatus(e instanceof Error?e.message:'Não foi possível sincronizar. Os dados locais foram preservados.')}
  finally{syncing.current=false}
 };
 useEffect(()=>{
  try{setAuto(localStorage.getItem('invictas-pulse-auto-sync-v1-'+userId)==='yes')}catch{}
 },[userId]);
 useEffect(()=>{
  if(!auto)return;
  void automatic();
  const onFocus=()=>void automatic();
  window.addEventListener('focus',onFocus);
  window.addEventListener('online',onFocus);
  const interval=window.setInterval(()=>{if(document.visibilityState==='visible')void automatic()},30000);
  return()=>{window.removeEventListener('focus',onFocus);window.removeEventListener('online',onFocus);window.clearInterval(interval)};
 // Automatic mode is opt-in; other dependencies are deliberately stable for this account.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[auto,userId]);
 const revoke=async()=>{
  if(busy||syncing.current)return;
  if(!window.confirm('Queres desativar a sincronização da conta? Os dados locais mantêm-se. Podes também apagar os registos da conta antes de revogar a autorização.'))return;
  const removeRemote=window.confirm('Queres apagar também os registos Pulse guardados na conta? Escolhe Cancelar para manter os registos na conta, mas sem acesso enquanto a autorização estiver revogada.');
  setBusy(true);syncing.current=true;
  try{
   const failedDeletes:string[]=[];
   if(removeRemote){
    for(const item of areas){try{await deletePulseDocument(item.area)}catch{failedDeletes.push(item.label)}}
   }
   // Consent must be revoked even if a remote deletion fails.
   await setPulseConsent('pulse_storage',false);
   localStorage.removeItem('invictas-pulse-auto-sync-v1-'+userId);
   baseline.current={};setAuto(false);setConflicts([]);
   setStatus(failedDeletes.length?'Autorização revogada, mas não foi possível apagar estes registos da conta: '+failedDeletes.join(', ')+'. Volta a autorizar a sincronização para repetir a eliminação.':removeRemote?'Sincronização desativada e registos da conta apagados. Os dados deste dispositivo mantêm-se.':'Sincronização desativada. Os dados da conta ficam inacessíveis enquanto a autorização estiver revogada.');
  }catch(e){setStatus(e instanceof Error?e.message:'Não foi possível concluir a revogação.')}
  finally{syncing.current=false;setBusy(false)}
 };
 const changeAuto=(enabled:boolean)=>{
  try{if(enabled)localStorage.setItem('invictas-pulse-auto-sync-v1-'+userId,'yes');else localStorage.removeItem('invictas-pulse-auto-sync-v1-'+userId);baseline.current={};setAuto(enabled);setStatus(enabled?'Sincronização automática ativada. As diferenças existentes exigem confirmação.':'Sincronização automática desativada.')}catch{setStatus('Não foi possível guardar a preferência.')}
 };
 const execute=async(mode:'upload'|'download')=>{
  if(busy||syncing.current)return;
  syncing.current=true;setBusy(true);setStatus('');
  try{
   if(mode==='upload'&&!window.confirm('A cópia manual inclui notas pessoais dos treinos, check-ins e eventuais conversas guardadas no agente. Estes dados serão enviados para a tua conta. Queres continuar?')){setStatus('Operação cancelada.');return;}
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
  finally{syncing.current=false;setBusy(false)}
 };
 return <section className="pulse-account-sync" aria-label="Sincronização Pulse"><button type="button" onClick={()=>setDetails(v=>!v)} aria-expanded={details}>Dados da conta {details?'−':'+'}</button>{details&&<div><p>Guarda ou recupera os teus registos da conta INVICTAS. Podes sincronizar manualmente ou ativar a verificação automática opcional, depois de autorizares o armazenamento na conta. O diário do ciclo e o módulo específico de bem-estar não são sincronizados. A cópia manual pode incluir notas pessoais, check-ins e conversas guardadas no agente. A sincronização automática exclui o agente e os check-ins.</p><label><input type="checkbox" checked={auto} onChange={e=>changeAuto(e.target.checked)}/> Sincronizar automaticamente objetivos, alertas e preferências (sem agente nem check-ins)</label><div className="pulse-account-sync-actions"><button type="button" disabled={busy} onClick={()=>void execute('upload')}>Guardar na conta</button><button type="button" disabled={busy} onClick={()=>void execute('download')}>Recuperar da conta</button><button type="button" disabled={busy} onClick={()=>void revoke()}>Revogar autorização</button></div><small>Se já existirem dados, podes decidir separadamente se os substituis. A verificação automática nunca substitui dois registos diferentes sem confirmação. Se houver conflito, usa as opções manuais; o funcionamento offline continua local.</small>{conflicts.length>0&&<p role="alert">Diferenças por resolver: {conflicts.join(', ')}.</p>}{status&&<p role="status">{status}</p>}</div>}</section>;
}
