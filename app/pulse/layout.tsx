import type {ReactNode} from 'react';
import type {Metadata,Viewport} from 'next';
import PulsePwaSetup from './PulsePwaSetup';
export const metadata:Metadata={title:'Pulse | INVICTAS',description:'O teu espaço de atividade, objetivos e bem-estar.',manifest:'/pulse.webmanifest',appleWebApp:{capable:true,title:'Pulse',statusBarStyle:'black-translucent'},icons:{icon:'/pulse-icon.svg',apple:'/pulse-icon.svg'}};
export const viewport:Viewport={themeColor:'#171717'};
export default function PulseLayout({children}:{children:ReactNode}){return <><PulsePwaSetup/>{children}</>}
