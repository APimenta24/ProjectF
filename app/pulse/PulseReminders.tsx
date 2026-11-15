'use client';
import {useEffect,useState} from 'react';
import {getPulseConsent,removePulsePushSubscription,savePulsePushSubscription,schedulePulsePush,setPulseConsent} from '../../lib/pulse-account-storage';
type Pref={water:boolean;food:boolean};
export default function PulseReminders({userId}:{userId:string}){
 const key='invictas-pulse-reminders-v1-'+userId;
 const [prefs,setPrefs]=useState<Pref>({water:false,food:false}),[status,setStatus]=useState('');
 const [permission,setPermission]=useState<'unsupported'|'default'|'granted'|'denied'>('unsupported');
 useEffect(()=>{if('Notification' in window&&'serviceWorker' in navigator)setPermission(Notification.permission)},[]);
 const [pushActive,setPushActive]=useState(false);
 const [reminderAt,setReminderAt]=useState('');
 const scheduleReminder=async()=>{
  if(!pushActive){setStatus('Associa primeiro este dispositivo às notificações push.');return}
  try{await schedulePulsePush('agenda',new Date(reminderAt).toISOString());setStatus('Lembrete colocado na fila. O envio depende da ativação do serviço de servidor.');setReminderAt('')}
  catch(e){setStatus(e instanceof Error?e.message:'Não foi possível agendar.')}
 };
 const subscribePush=async()=>{
  if(!('PushManager' in window)||!('serviceWorker' in navigator)||!('Notification' in window)){setStatus('Este dispositivo não suporta notificações push.');return}
  const key=process.env.NEXT_PUBLIC_PULSE_VAPID_PUBLIC_KEY;
  if(!key){setStatus('O serviço de envio push ainda não está configurado.');return}
  try{
   const permission=Notification.permission==='granted'?'granted':await Notification.requestPermission();
   setPermission(permission);
   if(permission!=='granted')return;
   const registration=await navigator.serviceWorker.getRegistration('/pulse/');
   if(!registration)throw new Error('Instala primeiro o Pulse no dispositivo.');
   const bytes=Uint8Array.from(atob(key.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(key.length/4)*4,'=')),c=>c.charCodeAt(0));
   const subscription=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:bytes});
   await setPulseConsent('push_notifications',true);
   await savePulsePushSubscription(subscription);
   setPushActive(true);setStatus('Dispositivo associado. O envio agendado ficará disponível após ativação do serviço de servidor.');
  }catch(e){setStatus(e instanceof Error?e.message:'Não foi possível ativar o dispositivo.')}
 };
 const unsubscribePush=async()=>{
  try{
   const registration=await navigator.serviceWorker.getRegistration('/pulse/');
   const subscription=await registration?.pushManager.getSubscription();
   if(subscription){await removePulsePushSubscription(subscription.endpoint);await subscription.unsubscribe()}
   await setPulseConsent('push_notifications',false);
   setPushActive(false);setStatus('Subscrição deste dispositivo desativada.');
  }catch{setStatus('Não foi possível desativar a subscrição.')}
 };
 useEffect(()=>{void (async()=>{try{if(!(await getPulseConsent('push_notifications')))return;const registration=await navigator.serviceWorker.getRegistration('/pulse/');setPushActive(!!(await registration?.pushManager.getSubscription()))}catch{}})()},[userId]);
 const enableNotifications=async()=>{if(!('Notification' in window)||!('serviceWorker' in navigator)){setStatus('Este navegador não suporta notificações da aplicação.');return}try{const choice=await Notification.requestPermission();setPermission(choice);setStatus(choice==='granted'?'Permissão do dispositivo ativada. O envio automático de notificações push ainda requer o serviço de subscrições.':choice==='denied'?'As notificações foram bloqueadas nas definições do navegador.':'Permissão não concedida. Podes continuar a usar o Pulse normalmente.')}catch{setStatus('Não foi possível solicitar a permissão de notificações.')}};
 const testNotification=async()=>{if(permission!=='granted')return;try{const registration=await navigator.serviceWorker.getRegistration('/pulse/');if(!registration){setStatus('A instalação de notificações ainda não está pronta. Reabre o Pulse e tenta novamente.');return}await registration.showNotification('INVICTAS Pulse',{body:'Notificação de teste. Os teus dados continuam privados.',icon:'/pulse-icon.svg',tag:'pulse-test',data:{url:'/pulse/prototipo'}});setStatus('Notificação de teste enviada para este dispositivo.')}catch{setStatus('Não foi possível apresentar a notificação de teste.')}};
 useEffect(()=>{setPrefs({water:false,food:false});setStatus('');try{const raw=JSON.parse(localStorage.getItem(key)||'null');if(raw&&typeof raw.water==='boolean'&&typeof raw.food==='boolean')setPrefs({water:raw.water,food:raw.food})}catch{setStatus('Não foi possível carregar as preferências de lembretes.')}},[key]);
 useEffect(()=>{
  if(!prefs.water&&!prefs.food)return;
  const remind=async()=>{
   if(document.visibilityState!=='visible'||!('Notification' in window)||Notification.permission!=='granted')return;
   const hour=new Date().getHours();
   // Respect a default quiet period; these are in-app reminders, not background push.
   if(hour<9||hour>=21)return;
   const slot=new Date().toLocaleDateString('sv-SE')+'-'+hour;
   const marker='invictas-pulse-reminder-shown-'+userId;
   try{
    if(sessionStorage.getItem(marker)===slot)return;
    const registration=await navigator.serviceWorker.getRegistration('/pulse/');
    if(!registration)return;
    const body=prefs.water&&prefs.food?'Uma pausa para cuidares de ti.':prefs.water?'Uma pausa para beberes água, se precisares.':'Uma pausa para cuidares da tua alimentação.';
    await registration.showNotification('INVICTAS Pulse',{body,icon:'/pulse-icon.svg',tag:'pulse-gentle-reminder',data:{url:'/pulse/prototipo'}});
    sessionStorage.setItem(marker,slot);
   }catch{/* No notification is safer than interrupting the app. */}
  };
  const timer=window.setInterval(()=>void remind(),60*60*1000);
  return()=>window.clearInterval(timer);
 },[prefs.water,prefs.food,userId]);
 const change=(name:keyof Pref,enabled:boolean)=>{const next={...prefs,[name]:enabled};try{if(next.water||next.food)localStorage.setItem(key,JSON.stringify(next));else localStorage.removeItem(key);setPrefs(next);setStatus('Preferências guardadas neste dispositivo.')}catch{setStatus('Não foi possível guardar as preferências.')}};
 return <div className="pulse-reminders"><label><input type="checkbox" checked={prefs.water} onChange={e=>change('water',e.target.checked)}/> Lembrar-me de fazer uma pausa para beber água</label><label><input type="checkbox" checked={prefs.food} onChange={e=>change('food',e.target.checked)}/> Lembrar-me de cuidar da minha rotina alimentar</label>{(prefs.water||prefs.food)&&<p role="status">Lembrete para esta visita: {prefs.water?'faz uma pausa para beber água. ':''}{prefs.food?'Reserva tempo para uma refeição ou lanche, se fizer sentido para ti.':''}</p>}<div className="pulse-notification-permission"><strong>Notificações do dispositivo</strong><p>Ativa apenas se quiseres receber avisos do Pulse. A permissão é independente dos registos pessoais e pode ser revogada nas definições do dispositivo.</p>{permission==='unsupported'?<small>Notificações indisponíveis neste navegador.</small>:permission==='denied'?<small>Permissão bloqueada. Altera-a nas definições do navegador ou da aplicação.</small>:permission==='default'?<button type="button" onClick={enableNotifications}>Autorizar notificações</button>:<><small>Permissão concedida neste dispositivo.</small> <button type="button" onClick={testNotification}>Testar notificação</button></>}</div><div className="pulse-account-sync-actions">{pushActive?<button type="button" onClick={()=>void unsubscribePush()}>Desativar push neste dispositivo</button>:<button type="button" onClick={()=>void subscribePush()}>Associar dispositivo a push</button>}</div><div className="pulse-notification-permission"><label>Data e hora de lembrete de teste <input type="datetime-local" value={reminderAt} onChange={e=>setReminderAt(e.target.value)}/></label> <button type="button" disabled={!reminderAt||!pushActive} onClick={()=>void scheduleReminder()}>Agendar lembrete</button></div><small>Com o Pulse aberto, os lembretes opcionais podem surgir no dispositivo entre as 09h e as 21h, no máximo uma vez por hora. Não são notificações push em segundo plano: os envios automáticos com a aplicação fechada dependem de um backend e ainda não estão ativos. Não guardamos preferências de notificações sobre o ciclo.</small>{status&&<p role="status">{status}</p>}</div>;
}
