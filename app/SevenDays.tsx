'use client';
import {useEffect,useState} from 'react';
type Role='Atleta'|'Treinador(a)'|'Profissional';
const plans:Record<Role,string[]>={
 'Atleta':['Escolhe um objetivo de processo para o próximo treino.','Identifica uma coisa que correu bem, mesmo num dia difícil.','Experimenta uma rotina curta para recuperar a atenção após um erro.','Reserva um momento realista de recuperação.','Faz uma pergunta útil a alguém que te acompanha no desporto.','Regista uma decisão que melhoraste esta semana.','Revê o percurso e escolhe uma ação para continuar.'],
 'Treinador(a)':['Define uma decisão que queres desenvolver nas atletas.','Faz uma pergunta antes de dar uma correção.','Experimenta uma instrução curta e observável.','Inclui uma escolha real numa tarefa de treino.','Escuta a perceção de uma atleta sobre uma situação.','Regista um momento em que deste autonomia.','Escolhe uma melhoria concreta para a próxima semana.'],
 'Profissional':['Identifica uma necessidade frequente das pessoas que acompanhas.','Escuta uma dificuldade sem antecipar uma solução.','Partilha um recurso fiável e adequado ao contexto.','Revê os limites da tua intervenção profissional.','Formula uma pergunta que promova autonomia.','Identifica uma oportunidade de colaboração responsável.','Escolhe uma ação útil para a próxima semana.']
};
const KEY='invictas-seven-days-v1';
export default function SevenDays(){
 const [role,setRole]=useState<Role>('Atleta'),[done,setDone]=useState<number[]>([]),[loaded,setLoaded]=useState(false);
 useEffect(()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'null');if(v&&Object.prototype.hasOwnProperty.call(plans,v.role)){setRole(v.role);setDone(Array.isArray(v.done)?v.done.filter((n:unknown)=>Number.isInteger(n)&&Number(n)>=0&&Number(n)<7):[])}}catch{}setLoaded(true)},[]);
 const persist=(r:Role,d:number[])=>{setRole(r);setDone(d);try{localStorage.setItem(KEY,JSON.stringify({role:r,done:d}))}catch{}};
 if(!loaded)return null;
 return <section className="inv-seven-days" aria-label="Invictas 7 dias"><span className="eyebrow">INVICTAS · DESAFIO GRATUITO</span><h2>7 dias. 7 pequenas ações.</h2><p>Um ponto de partida simples para evoluíres na tua prática desportiva, ao teu ritmo. Sem ranking, comparação ou conta obrigatória.</p><label>Escolhe o teu percurso <select value={role} onChange={e=>persist(e.target.value as Role,[])}>{Object.keys(plans).map(r=><option key={r}>{r}</option>)}</select></label><p><strong>{done.length} de 7</strong> ações assinaladas</p><ol>{plans[role].map((step,i)=><li key={i}><label><input type="checkbox" checked={done.includes(i)} onChange={()=>persist(role,done.includes(i)?done.filter(n=>n!==i):[...done,i])}/><span><strong>Dia {i+1}.</strong> {step}</span></label></li>)}</ol><button type="button" onClick={()=>persist(role,[])}>Recomeçar o desafio</button><small>O progresso fica apenas neste navegador. Podes realizar as ações nos dias que fizerem sentido para ti.</small></section>;
}
