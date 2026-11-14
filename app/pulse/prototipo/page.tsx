'use client';
import {useEffect,useState} from 'react';
import type {Session} from '@supabase/supabase-js';
import {supabase} from '../../../lib/supabase';
import PulseWorkspace from '../PulseWorkspace';

/**
 * Pré-visualização FUNCIONAL do Pulse, com a sessão real da INVICTAS.
 * Sem sessão, o acesso é bloqueado. Os dados continuam sob consentimento
 * e as mesmas chaves locais usadas no Pulse integrado.
 */
export default function PulsePrototype(){
 const [session,setSession]=useState<Session|null>(null);
 const [loading,setLoading]=useState(true);
 useEffect(()=>{
  let alive=true;
  const db=supabase();
  if(!db){setLoading(false);return}
  db.auth.getSession().then(({data})=>{if(alive){setSession(data.session);setLoading(false)}}).catch(()=>{if(alive)setLoading(false)});
  const {data:{subscription}}=db.auth.onAuthStateChange((_event,next)=>{if(alive){setSession(next);setLoading(false)}});
  return()=>{alive=false;subscription.unsubscribe()};
 },[]);
 if(loading)return <main className="pulse-preview-gate"><p>A preparar o Pulse…</p></main>;
 if(!session)return <main className="pulse-preview-gate"><div className="pulse-preview-gate-card"><span className="eyebrow">INVICTAS / PULSE</span><h1>O teu Pulse, com os teus dados.</h1><p>Esta pré-visualização utiliza as funcionalidades reais do Pulse. Para proteger os teus registos, inicia sessão na INVICTAS e volta a abrir este endereço.</p><a href="/">Entrar na INVICTAS →</a></div></main>;
 const name=String(session.user.user_metadata?.display_name||session.user.user_metadata?.full_name||'').slice(0,100);
 return <main className="pulse-preview-real"><div className="pulse-preview-top"><span>INVICTAS <strong>/ PULSE</strong></span><span>PRÉ-VISUALIZAÇÃO FUNCIONAL</span><a href="/">Voltar à INVICTAS ↗</a></div><PulseWorkspace userId={session.user.id} member={{name,email:session.user.email||'',photo:'',sports:[],goal:''}} onNavigate={(section)=>{if(section==='Perfil')window.location.assign('/')}}/><p className="pulse-preview-disclaimer">Esta versão usa a tua sessão INVICTAS e o mesmo armazenamento local do Pulse integrado neste navegador. Os registos são reais e dependem do teu consentimento.</p></main>;
}
