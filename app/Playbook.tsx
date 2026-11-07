'use client';
import {useState} from 'react';

type Guide={id:string;audience:'Atleta'|'Treinador(a)'|'Profissional';title:string;context:string;steps:string[];question:string};
const guides:Guide[]=[
{id:'competir',audience:'Atleta',title:'Antes da competição',context:'Preparar decisões, não procurar uma prestação perfeita.',steps:['Escolhe duas ações que controlas, independentemente do resultado.','Prepara uma rotina breve para recuperar a atenção depois de um erro.','Depois da competição, escreve uma aprendizagem e uma ação para o treino seguinte.'],question:'Qual é a minha próxima ação concreta?'},
{id:'recuperar',audience:'Atleta',title:'A minha semana de recuperação',context:'Olhar para o descanso, as exigências e o contexto pessoal.',steps:['Identifica os dias de maior exigência desportiva e pessoal.','Reserva uma oportunidade realista de descanso ou recuperação.','Se a fadiga persistir ou surgirem sintomas preocupantes, procura avaliação profissional.'],question:'Que pequena mudança está ao meu alcance?'},
{id:'feedback',audience:'Treinador(a)',title:'Feedback que ajuda a evoluir',context:'Menos instruções, mais compreensão e autonomia.',steps:['Escolhe um comportamento observável em vez de avaliar a pessoa.','Pergunta à atleta o que viu ou decidiu antes de corrigir.','Dá uma indicação breve e verifica se houve oportunidade de a experimentar.'],question:'O que é que a atleta compreendeu?'},
{id:'sessao',audience:'Treinador(a)',title:'Uma sessão com intenção',context:'Transformar um objetivo de aprendizagem em tarefa.',steps:['Define uma decisão ou comportamento que queres desenvolver.','Cria uma tarefa com escolhas reais, adaptada à idade e experiência.','No final, pergunta o que foi aprendido e o que mudar na próxima sessão.'],question:'A tarefa criou oportunidades de decidir?'},
{id:'escuta',audience:'Profissional',title:'Escutar antes de orientar',context:'Uma conversa útil respeita os limites da tua competência.',steps:['Pergunta qual é a principal dificuldade que a pessoa quer resolver.','Distingue observações de interpretações e evita diagnósticos precipitados.','Define uma ação ou encaminhamento apropriado com consentimento.'],question:'A pessoa sai com um próximo passo claro?'}
];
export default function Playbook(){
 const [audience,setAudience]=useState<'Todos'|Guide['audience']>('Todos');
 const [selected,setSelected]=useState('competir');
 const [done,setDone]=useState<string[]>([]);
 const available=guides.filter(g=>audience==='Todos'||g.audience===audience);
 const guide=available.find(g=>g.id===selected)||available[0];
 const toggle=(i:number)=>{const key=guide.id+':'+i;setDone(v=>v.includes(key)?v.filter(x=>x!==key):[...v,key])};
 const copy=async()=>{const txt=['INVICTAS PLAYBOOK',guide.title,guide.context,...guide.steps.map((s,i)=>(i+1)+'. '+s),'Pergunta final: '+guide.question].join('\n');try{await navigator.clipboard.writeText(txt)}catch{window.prompt('Copia o teu guia:',txt)}};
 return <section className="inv-playbook" aria-label="Invictas Playbook">
 <div className="inv-tools-header"><span className="eyebrow">INVICTAS PLAYBOOK · GRATUITO</span><h2>Uma ideia. Uma ação. Uma evolução.</h2><p>Guias curtos para levares para o treino, a competição ou a tua prática profissional. Sem subscrições.</p></div>
 <div className="inv-playbook-filters" aria-label="Escolher público">{(['Todos','Atleta','Treinador(a)','Profissional'] as const).map(a=><button key={a} type="button" aria-pressed={audience===a} onClick={()=>setAudience(a)}>{a}</button>)}</div>
 <div className="inv-playbook-layout"><div className="inv-playbook-list">{available.map(g=><button key={g.id} type="button" className={guide.id===g.id?'selected':''} aria-pressed={guide.id===g.id} onClick={()=>setSelected(g.id)}><small>{g.audience}</small><strong>{g.title}</strong></button>)}</div>
 <div className="inv-playbook-detail"><span className="eyebrow">{guide.audience} · GUIA PRÁTICO</span><h3>{guide.title}</h3><p>{guide.context}</p><ol>{guide.steps.map((step,i)=><li key={i}><label><input type="checkbox" checked={done.includes(guide.id+':'+i)} onChange={()=>toggle(i)}/><span>{step}</span></label></li>)}</ol><p><strong>Para refletir:</strong> {guide.question}</p><button type="button" onClick={copy}>Copiar o meu guia ↗</button><small>As seleções não são enviadas nem guardadas. Este conteúdo é educativo e não substitui aconselhamento individual de profissionais habilitados.</small></div></div>
 </section>;
}
