'use client';
import PulseAgent from '../PulseAgent';

export type PulseMember = {
 name:string;
 email:string;
 photo:string;
 sports:string[];
 goal:string;
};
export type PulseWorkspaceProps = {
 userId:string;
 member?:PulseMember|null;
 onNavigate?:(section:string)=>void;
};

/**
 * Fronteira da aplicação Pulse.
 * A INVICTAS fornece apenas identidade, perfil e navegação de retorno.
 * O Pulse gere a experiência e o armazenamento local por consentimento.
 * Não cria sessão, não consulta a base de dados e não envia dados sensíveis.
 */
export default function PulseWorkspace({userId,member,onNavigate}:PulseWorkspaceProps){
 return <PulseAgent userId={userId} member={member} onNavigate={onNavigate}/>;
}
