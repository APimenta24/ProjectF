import './style.css';
import type {ReactNode} from 'react';
export const metadata={title:'INVICTAS | Mulheres no Desporto',description:'INVICTAS: Pulse, conhecimento e comunidade para mulheres no desporto.'};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="pt-PT"><body>{children}</body></html>}
