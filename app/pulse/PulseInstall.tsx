'use client';
import {useEffect,useState} from 'react';

type InstallPromptEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:'accepted'|'dismissed'}>};
export default function PulseInstall(){
 const [promptEvent,setPromptEvent]=useState<InstallPromptEvent|null>(null);
 const [installed,setInstalled]=useState(false);
 const [ios,setIos]=useState(false);
 const [message,setMessage]=useState('');
 useEffect(()=>{
  const standalone=window.matchMedia('(display-mode: standalone)').matches||('standalone' in navigator&&(navigator as Navigator&{standalone?:boolean}).standalone===true);
  setInstalled(standalone);
  setIos(/iPad|iPhone|iPod/.test(navigator.userAgent));
  const onPrompt=(event:Event)=>{event.preventDefault();setPromptEvent(event as InstallPromptEvent)};
  const onInstalled=()=>{setInstalled(true);setPromptEvent(null);setMessage('Pulse instalado neste dispositivo.')};
  window.addEventListener('beforeinstallprompt',onPrompt);
  window.addEventListener('appinstalled',onInstalled);
  return()=>{window.removeEventListener('beforeinstallprompt',onPrompt);window.removeEventListener('appinstalled',onInstalled)};
 },[]);
 const install=async()=>{if(!promptEvent)return;try{await promptEvent.prompt();const choice=await promptEvent.userChoice;setMessage(choice.outcome==='accepted'?'Instalação aceite.':'Podes instalar o Pulse mais tarde.');setPromptEvent(null)}catch{setMessage('Não foi possível iniciar a instalação. Usa o menu do navegador.')}};
 if(installed)return null;
 return <section className="pulse-install-banner" aria-label="Instalar o Pulse"><div><strong>Leva o Pulse contigo</strong><p>Adiciona a aplicação ao ecrã principal. A instalação não ativa notificações nem sincroniza dados entre dispositivos.</p></div>{promptEvent?<button type="button" onClick={install}>Instalar Pulse</button>:<small>{ios?'No Safari, escolhe Partilhar → Adicionar ao ecrã principal.':'Para instalar, procura «Instalar aplicação» ou «Adicionar ao ecrã principal» no menu do navegador, se disponível.'}</small>}{message&&<p role="status">{message}</p>}</section>;
}
