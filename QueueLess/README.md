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
- Missões: XP, níveis, sequência calculada por registros reais, missões diárias/semanais e conquistas desbloqueadas, persistidos no Supabase.
- Atividades: registro de atividades físicas existente, acessível pelo Dashboard.
- Perfil: dados de autenticação e logout.
- Planos: tabela comparativa ilustrativa, sem preços ou contratação conectados ao backend.

A navegação inferior prioriza Início, Saúde, Missões, Progresso e Perfil. Medicamentos, Consultas e Atividades continuam acessíveis pelo Dashboard. A gamificação não cria registros de saúde, limita XP de registros repetidos e só exibe conquistas que foram desbloqueadas.

## Configuração da gamificação

Depois de aplicar a migration-base `supabase/migrations/001_cuidaplus_core.sql`, execute manualmente `supabase/migrations/002_gamification.sql` no SQL Editor do Supabase (ou aplique-a pelo fluxo de migrations escolhido para o projeto). A aplicação não executa migrations automaticamente. A nova migration adiciona tabelas e triggers e mantém as tabelas atuais.

Regras de XP: +10 XP no primeiro registro diário de pressão, +10 XP no primeiro de glicemia e +15 XP na primeira atividade física do dia. As missões concedem +20 XP por acompanhamento diário, +30 XP por três atividades na semana e +25 XP por cinco medições na semana. Conquistas concedem bônus únicos de 15 a 50 XP. Cada 100 XP avançam um nível. Edições/exclusões e registros adicionais da mesma categoria no mesmo dia não concedem XP-base novamente.

## Identidade visual

A paleta atual usa preto, branco e cinzas, centralizados em variáveis CSS no `src/styles/global.css` para permitir a futura aplicação das cores da marca.
