'use client';
import PulseAgent from '../PulseAgent';
import PulseAccountSync from './PulseAccountSync';

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
 * O Pulse partilha a sessão INVICTAS. A sincronização manual é opcional;
 * dados sensíveis de ciclo e bem-estar não são enviados por esta interface.
 */
export default function PulseWorkspace({userId,member,onNavigate}:PulseWorkspaceProps){
 return <><PulseAccountSync userId={userId}/><PulseAgent userId={userId} member={member} onNavigate={onNavigate}/></>;
}
