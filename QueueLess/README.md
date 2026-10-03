# Cuida+ — aplicativo de acompanhamento de saúde

Aplicativo React + Vite para organizar o acompanhamento de hipertensão e diabetes. A autenticação, o banco de dados e as operações de dados continuam integrados ao Supabase; o CSS foi reorganizado para uma apresentação mobile monocromática.

## Executar

```bash
npm install
npm run dev
```

Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` conforme `.env.example`.

## Telas e rotas

- Login e cadastro: autenticação Supabase.
- Início: resumo carregado dos serviços existentes.
- Saúde: registros de pressão e glicemia.
- Medicamentos e consultas: operações existentes de cadastro, edição e remoção.
- Progresso / Histórico: registros reais e gráficos construídos a partir das medições do usuário.
- Missões: tela disponível, sinaliza que gamificação ainda não existe no backend e direciona à funcionalidade existente de Atividades.
- Atividades: registro de atividades físicas existente, acessível pelo Dashboard.
- Perfil: dados de autenticação e logout.
- Planos: tabela comparativa ilustrativa, sem preços ou contratação conectados ao backend.

A navegação inferior prioriza Início, Saúde, Missões, Progresso e Perfil. Medicamentos, Consultas e Atividades continuam acessíveis pelo Dashboard. A tela Missões não apresenta XP, sequência ou conquistas fictícios; esses recursos dependem de implementação própria.

## Identidade visual

A paleta atual usa preto, branco e cinzas, centralizados em variáveis CSS no `src/styles/global.css` para permitir a futura aplicação das cores da marca.
