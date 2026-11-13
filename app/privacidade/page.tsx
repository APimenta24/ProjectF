export const metadata = {
  title: 'Política de Privacidade e Cookies | INVICTAS',
  description: 'Como a INVICTAS trata dados pessoais, utiliza armazenamento local e protege a privacidade do Pulse.'
};

export default function Privacidade() {
  return <main className="inv-legal-page">
    <a href="/">← Voltar à INVICTAS</a>
    <p className="eyebrow">INVICTAS · PRIVACIDADE</p>
    <h1>Política de Privacidade e Cookies</h1>
    <p><strong>Versão de trabalho · 12 de novembro de 2026.</strong> Este texto descreve o funcionamento conhecido da INVICTAS nesta fase de desenvolvimento. Antes da abertura pública, serão confirmados o contacto de privacidade, os prazos de conservação, a lista de prestadores de serviços e os restantes elementos identificados no final desta página.</p>

    <h2>1. Quem é responsável pelos dados?</h2>
    <p>O responsável pelo tratamento é <strong>André Filipe Mendes Pimenta</strong>, enquanto promotor individual do projeto INVICTAS. O endereço de contacto dedicado ao exercício de direitos e às questões de privacidade será disponibilizado antes do lançamento público. Até existir esse canal, esta versão não deve ser considerada um aviso de privacidade definitivo.</p>

    <h2>2. Que informações tratamos?</h2>
    <ul>
      <li><strong>Conta e autenticação:</strong> endereço de email, identificador da conta, dados necessários ao início de sessão e recuperação de acesso.</li>
      <li><strong>Perfil e preferências:</strong> nome, modalidades, interesses, objetivos e, quando fornecidos, data de nascimento e género.</li>
      <li><strong>Participação na plataforma:</strong> publicações, histórias, propostas editoriais e oportunidades submetidas, decisões de moderação e notificações relacionadas.</li>
      <li><strong>Utilização do serviço:</strong> dados técnicos estritamente necessários à operação, segurança e manutenção, sujeitos às práticas dos prestadores de infraestrutura.</li>
      <li><strong>Estatísticas opcionais:</strong> eventos de navegação, categoria de origem de tráfego e identificador aleatório do navegador, apenas após consentimento.</li>
      <li><strong>Pulse:</strong> treinos, planos, check-ins, conversas guardadas e dados opcionais do ciclo menstrual, hidratação e nutrição, de acordo com os controlos de cada módulo. Na implementação atual, estes registos são guardados localmente no navegador e não são sincronizados com a base de dados INVICTAS.</li>
    </ul>

    <h2>3. Para que fins e com que fundamento?</h2>
    <ul>
      <li><strong>Disponibilizar a conta e as funcionalidades pedidas:</strong> execução das condições de utilização do serviço, quando aplicável.</li>
      <li><strong>Gerir conteúdos, pedidos e moderação:</strong> execução do serviço e interesse legítimo na segurança e integridade da comunidade, sujeito a avaliação e aos direitos das titulares.</li>
      <li><strong>Proteger a plataforma e cumprir obrigações legais:</strong> interesses legítimos de segurança e cumprimento de obrigações legais concretamente aplicáveis.</li>
      <li><strong>Medir a utilização através de analytics opcionais:</strong> consentimento prévio, que pode ser retirado a qualquer momento.</li>
      <li><strong>Guardar dados privados do Pulse no dispositivo:</strong> escolha expressa da utilizadora nos controlos do Pulse. Dados sobre saúde ou ciclo menstrual merecem proteção reforçada; antes do lançamento, é necessária validação específica da condição de tratamento aplicável ao abrigo do artigo 9.º do RGPD.</li>
    </ul>
    <p>Não utilizamos os dados privados do Pulse para publicidade personalizada na implementação atual. Qualquer futura monetização, aplicação autónoma ou integração com terceiros exigirá uma avaliação de privacidade e informação atualizada antes da respetiva ativação.</p>

    <h2>4. O que é público e o que é privado?</h2>
    <p>Conteúdos aprovados para publicação podem ficar visíveis a outras pessoas, conforme a funcionalidade. Submissões pendentes e notificações pessoais devem permanecer sujeitas a controlos de acesso. Não publiques informações de saúde, contactos privados ou dados de terceiros em conteúdos públicos. A autorização para submeter uma história não substitui a autorização específica da pessoa retratada para a publicação final do testemunho e das imagens.</p>

    <h2>5. Pulse: dados sensíveis e armazenamento local</h2>
    <p>Os registos do Pulse são guardados localmente no navegador, associados ao identificador da conta neste dispositivo. <strong>Os novos registos opcionais do ciclo, hidratação e nutrição não exigem palavra-passe adicional, mas também não têm encriptação própria.</strong> Quem tiver acesso ao dispositivo ou ao armazenamento do navegador poderá consultar esses dados. A utilizadora decide separadamente se quer ativar cada registo.</p>
    <p>Os cofres cifrados criados numa versão anterior foram preservados, mas os respetivos dados não são importados automaticamente para a nova experiência. A recuperação desses dados antigos poderá exigir a frase-passe utilizada na altura. A remoção dos novos registos não apaga automaticamente esses cofres anteriores.</p>
    <p>Os restantes registos do Pulse — treinos, planos, check-ins, objetivos e conversas guardadas — também não têm encriptação própria. Não existe sincronização entre dispositivos. A limpeza do navegador pode eliminar definitivamente os dados. Os registos do ciclo não são partilhados com o agente. Os lembretes opcionais de bem-estar são apresentados apenas dentro da aplicação, sem notificações externas nesta fase.</p>
    <p>O assistente Pulse disponibiliza informação geral de apoio desportivo e não substitui profissionais de saúde, diagnósticos ou acompanhamento clínico. A opção de IA local, quando suportada pelo navegador, deve ser distinguida de qualquer futuro serviço externo de IA.</p>

    <h2>6. Cookies, sessão e estatísticas</h2>
    <p>A autenticação e algumas preferências utilizam mecanismos de armazenamento necessários ao funcionamento da plataforma. Os analytics são opcionais: apenas após a aceitação é criado um identificador aleatório no navegador para registar visitas, visualizações de histórias e cliques. A origem do tráfego pode ser classificada em categorias gerais. O identificador não contém diretamente o nome ou o email, mas continua a ser tratado como um dado potencialmente pessoal.</p>
    <p>Podes aceitar, recusar ou alterar esta escolha através de <strong>«Gerir cookies»</strong>, no rodapé da aplicação. A recusa não impede a utilização das funcionalidades essenciais. Ao retirar o consentimento, a plataforma deixa de enviar novos eventos e tenta apagar os registos associados ao identificador e ao segredo guardados no navegador. Se o apagamento falhar, apresenta um aviso e conserva os identificadores necessários para repetir o pedido. A eficácia deste fluxo será confirmada nos testes pré-lançamento.</p>
    <p>Os dados do Pulse não integram os eventos de analytics previstos na implementação atual.</p>

    <h2>7. Com quem podem ser partilhados os dados?</h2>
    <p>A INVICTAS utiliza <strong>Supabase</strong> para serviços de autenticação e base de dados e <strong>Vercel</strong> para alojamento da aplicação. Estes fornecedores podem tratar dados técnicos e operacionais necessários à prestação dos seus serviços. A lista de entidades, localizações de tratamento, eventuais subcontratantes e mecanismos de transferência internacional será confirmada antes do lançamento. Conteúdos publicados são partilhados com o público a que se destinam; dados privados do Pulse não são enviados para esses serviços pela implementação atual do módulo.</p>

    <h2>8. Durante quanto tempo conservamos os dados?</h2>
    <p>Os dados de conta e conteúdos associados são conservados enquanto forem necessários para a prestação do serviço, sem prejuízo de obrigações legais, pedidos de apagamento e períodos técnicos de retenção. Os prazos específicos por categoria, incluindo cópias de segurança, registos de segurança e analytics, ainda têm de ser confirmados e publicados antes do lançamento.</p>
    <p>Os registos locais do Pulse permanecem no dispositivo até serem apagados pela utilizadora, pelo navegador ou pelos controlos da aplicação. A desinstalação ou utilização de outro dispositivo não garante a eliminação de cópias exportadas anteriormente.</p>

    <h2>9. Quais são os teus direitos?</h2>
    <p>Nos termos do RGPD, e dentro dos respetivos pressupostos legais, podes pedir acesso, retificação, apagamento, limitação do tratamento e portabilidade dos dados, opor-te a determinados tratamentos e retirar consentimentos sem afetar a licitude do tratamento anterior. Poderás também apresentar reclamação à <a href="https://www.cnpd.pt/" target="_blank" rel="noopener noreferrer">Comissão Nacional de Proteção de Dados (CNPD)</a>.</p>
    <p>O canal de contacto e o procedimento de resposta a pedidos serão disponibilizados antes da abertura pública. Para os dados guardados exclusivamente no Pulse, estão previstos controlos locais de exportação e eliminação.</p>

    <h2>10. Segurança e menores</h2>
    <p>A plataforma utiliza mecanismos de autenticação, regras de acesso e moderação, mas nenhum sistema oferece segurança absoluta. Não recomendamos a utilização do Pulse em dispositivos partilhados para registar informações sensíveis. O registo de conta na versão atual da INVICTAS destina-se a maiores de 18 anos; esta regra e a sua aplicação serão verificadas antes do lançamento.</p>

    <h2>11. Alterações a esta política</h2>
    <p>Esta política poderá ser atualizada quando o funcionamento da plataforma, os prestadores de serviços ou as obrigações legais se alterarem. Alterações relevantes serão comunicadas de forma adequada antes de entrarem em vigor, quando necessário.</p>

    <h2>Elementos pendentes antes do lançamento público</h2>
    <p><strong>Esta versão ainda não está pronta para publicação como política definitiva.</strong> Falta confirmar e inserir: contacto funcional de privacidade; inventário completo de fornecedores e transferências; prazos concretos de retenção e backups; procedimento de resposta a pedidos e incidentes; fundamento e condição do artigo 9.º para dados sensíveis; eventual avaliação de impacto; documentação da autorização de imagem/testemunhos; e revisão jurídica final.</p>
    <p><a href="/">Regressar à página inicial</a></p>
  </main>;
}
