'use client';
import {useState} from 'react';
type Entry={day:string;energy:number;sleep:number;recovery:number;mood:number;effort?:number;activity?:'treino'|'competicao'|'descanso';sport?:string;duration?:number;note?:string};
type Field='activity'|'effort'|'energy'|'recovery'|'sleep'|'mood';
const labels:Record<Field,string>={activity:'Tipo de atividade e duração',effort:'Esforço percebido',energy:'Energia',recovery:'Recuperação',sleep:'Sono',mood:'Bem-estar emocional'};
const all:Field[]=['activity','effort','energy','recovery','sleep','mood'];
export default function PulseShare({entries}:{entries:Entry[]}){
 const [fields,setFields]=useState<Field[]>(['activity','effort','recovery']);
 const [authorized,setAuthorized]=useState(false);
 const [message,setMessage]=useState('');
 const [period,setPeriod]=useState<7|30>(7);
 const cutoff=new Date();cutoff.setDate(cutoff.getDate()-(period-1));const minDay=cutoff.toLocaleDateString('sv-SE');
 const data=entries.filter(e=>e.day>=minDay).sort((a,b)=>a.day.localeCompare(b.day));
 const create=()=>{if(!authorized||!fields.length||!data.length){setMessage('Seleciona os dados, confirma a autorização e verifica se existem registos.');return}
 const lines=['INVICTAS PULSE · RESUMO DESPORTIVO','Período: últimos '+period+' dias','Registos: '+data.length,'Dados selecionados: '+fields.map(f=>labels[f]).join(', '),'','Registos:'];
 for(const e of data){const parts=[e.day];if(fields.includes('activity'))parts.push('Atividade: '+(e.activity==='treino'?'Treino':e.activity==='competicao'?'Competição':e.activity==='descanso'?'Descanso':'Não indicada')+(e.activity!=='descanso'&&e.duration!==undefined?' · '+e.duration+' min':''));if(fields.includes('effort')&&e.effort!==undefined)parts.push('Esforço: '+e.effort+'/5');for(const f of ['energy','recovery','sleep','mood'] as const)if(fields.includes(f))parts.push(labels[f]+': '+e[f]+'/5');lines.push(parts.join(' | '))}
 lines.push('','Registos pessoais declarados pela atleta; não constituem avaliação médica nem recomendação de treino.','Partilha voluntária, gerada no dispositivo. Quem recebe o ficheiro pode conservá-lo ou reencaminhá-lo.');
 const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='invictas-pulse-relatorio-treinador.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setAuthorized(false);setMessage('Relatório criado no teu dispositivo. Revê o ficheiro antes de o enviares ao treinador.');};
 return <section className="pulse-share" aria-label="Partilha desportiva"><span className="eyebrow">PULSE SHARE · OPCIONAL</span><h3>Partilhar com o meu treinador</h3><p>Escolhe exatamente o que queres incluir num relatório. Nenhum dado é enviado automaticamente. O ciclo menstrual, sintomas e notas pessoais nunca entram neste relatório.</p><label>Período<select value={period} onChange={e=>{setPeriod(Number(e.target.value) as 7|30);setAuthorized(false)}}><option value={7}>Últimos 7 dias</option><option value={30}>Últimos 30 dias</option></select></label><fieldset><legend>Informações a incluir</legend>{all.map(f=><label key={f}><input type="checkbox" checked={fields.includes(f)} onChange={()=>{setFields(v=>v.includes(f)?v.filter(x=>x!==f):[...v,f]);setAuthorized(false)}}/>{labels[f]}</label>)}</fieldset><p>{data.length} registos disponíveis neste período.</p><label className="pulse-share-authorization"><input type="checkbox" checked={authorized} onChange={e=>setAuthorized(e.target.checked)}/><span>Confirmo que escolhi estes dados e quero criar um ficheiro para partilha voluntária. Compreendo que, depois de o enviar, não consigo retirar o acesso ao ficheiro.</span></label><button type="button" disabled={!authorized||!fields.length||!data.length} onClick={create}>Criar relatório para o treinador</button>{message&&<p role="status">{message}</p>}</section>;
}
