import './style.css';
import type {ReactNode} from 'react';
export const metadata={title:'Projeto F | Mulheres no Desporto',description:'Comunidade, conhecimento e histórias de mulheres que vivem o desporto.'};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="pt-PT"><body>{children}</body></html>}
