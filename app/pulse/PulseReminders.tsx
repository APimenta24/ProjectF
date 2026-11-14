'use client';
import {useEffect,useState} from 'react';
type Pref={water:boolean;food:boolean};
export default function PulseReminders({userId}:{userId:string}){
 const key='invictas-pulse-reminders-v1-'+userId;
 const [prefs,setPrefs]=useState<Pref>({water:false,food:false}),[status,setStatus]=useState('');
 useEffect(()=>{setPrefs({water:false,food:false});setStatus('');try{const raw=JSON.parse(localStorage.getItem(key)||'null');if(raw&&typeof raw.water==='boolean'&&typeof raw.food==='boolean')setPrefs({water:raw.water,food:raw.food})}catch{setStatus('Não foi possível carregar as preferências de lembretes.')}},[key]);
 const change=(name:keyof Pref,enabled:boolean)=>{const next={...prefs,[name]:enabled};try{if(next.water||next.food)localStorage.setItem(key,JSON.stringify(next));else localStorage.removeItem(key);setPrefs(next);setStatus('Preferências guardadas neste dispositivo.')}catch{setStatus('Não foi possível guardar as preferências.')}};
 return <div className="pulse-reminders"><label><input type="checkbox" checked={prefs.water} onChange={e=>change('water',e.target.checked)}/> Lembrar-me de fazer uma pausa para beber água</label><label><input type="checkbox" checked={prefs.food} onChange={e=>change('food',e.target.checked)}/> Lembrar-me de cuidar da minha rotina alimentar</label>{(prefs.water||prefs.food)&&<p role="status">Lembrete para esta visita: {prefs.water?'faz uma pausa para beber água. ':''}{prefs.food?'Reserva tempo para uma refeição ou lanche, se fizer sentido para ti.':''}</p>}<small>Estes lembretes são mostrados apenas nesta área. Não existem alertas automáticos, horários programados ou notificações do dispositivo nesta versão. Não guardamos preferências de notificações sobre o ciclo.</small>{status&&<p role="status">{status}</p>}</div>;
}
