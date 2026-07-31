# QueueLess

Projeto único React + Vite para gerenciamento de filas e agendamentos.

## Estrutura

- `public/` - arquivos estáticos.
- `src/` - aplicação React.
- `database/`, `docs/`, `design/` - mantidos como pastas auxiliares.

## Execução

```bash
cd QueueLess
npm install
npm run dev
```

O arquivo `.env` deve ficar dentro de `QueueLess/`. Depois de criar ou alterar
esse arquivo, reinicie o servidor do Vite para que as variáveis sejam carregadas.

## Supabase

Copie `.env.example` para `.env` e substitua os valores pelas credenciais do
projeto Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=seu-valor-publishable-key
```

Projetos antigos podem usar `VITE_SUPABASE_ANON_KEY` no lugar de
`VITE_SUPABASE_PUBLISHABLE_KEY`.
