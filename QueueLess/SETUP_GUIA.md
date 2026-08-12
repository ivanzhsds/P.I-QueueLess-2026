# 🚀 Guia de Setup - Cuida+

## Visão Geral
**Cuida+** é um aplicativo de monitoramento e apoio ao autocuidado para pessoas com hipertensão e/ou diabetes. Ele funciona como uma ferramenta de organização, registro e acompanhamento da rotina de cuidados.

---

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- Conta Supabase (gratuita)
- Navegador moderno

---

## 1️⃣ Instalação Inicial

```bash
cd /workspaces/P.I-QueueLess-2026/QueueLess
npm install
```

---

## 2️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Como encontrar suas credenciais Supabase:
1. Acesse [supabase.com](https://supabase.com)
2. Acesse seu projeto
3. Vá para **Settings** → **API**
4. Copie:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` → `VITE_SUPABASE_PUBLISHABLE_KEY`

---

## 3️⃣ Configurar Supabase

### Criar Tabelas no Supabase

Acesse o **SQL Editor** do Supabase e execute:

```sql
-- Tabela: pressoes
CREATE TABLE pressoes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  usuario_id uuid NOT NULL REFERENCES auth.users(id),
  sistolica integer NOT NULL,
  diastolica integer NOT NULL,
  data date NOT NULL,
  horario time NOT NULL,
  observacao text,
  created_at timestamp DEFAULT now()
);

-- Tabela: glicemias
CREATE TABLE glicemias (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  usuario_id uuid NOT NULL REFERENCES auth.users(id),
  valor float NOT NULL,
  momento text NOT NULL,
  data date NOT NULL,
  horario time NOT NULL,
  observacao text,
  created_at timestamp DEFAULT now()
);

-- Tabela: medicamentos
CREATE TABLE medicamentos (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  usuario_id uuid NOT NULL REFERENCES auth.users(id),
  nome text NOT NULL,
  horario time NOT NULL,
  frequencia text NOT NULL,
  observacao text,
  created_at timestamp DEFAULT now()
);

-- Tabela: consultas
CREATE TABLE consultas (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  usuario_id uuid NOT NULL REFERENCES auth.users(id),
  tipo text NOT NULL,
  data date NOT NULL,
  horario time NOT NULL,
  local_profissional text,
  observacao text,
  created_at timestamp DEFAULT now()
);

-- Tabela: atividades
CREATE TABLE atividades (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  usuario_id uuid NOT NULL REFERENCES auth.users(id),
  tipo text NOT NULL,
  duracao integer NOT NULL,
  data date NOT NULL,
  observacao text,
  created_at timestamp DEFAULT now()
);
```

### Ativar RLS (Row Level Security)

Para cada tabela, execute:

```sql
-- Pressões
ALTER TABLE pressoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem ver suas próprias pressões"
ON pressoes FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Usuários podem inserir suas próprias pressões"
ON pressoes FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Usuários podem atualizar suas próprias pressões"
ON pressoes FOR UPDATE USING (auth.uid() = usuario_id);
CREATE POLICY "Usuários podem deletar suas próprias pressões"
ON pressoes FOR DELETE USING (auth.uid() = usuario_id);

-- Glicemias
ALTER TABLE glicemias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem ver suas próprias glicemias"
ON glicemias FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Usuários podem inserir suas próprias glicemias"
ON glicemias FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Usuários podem atualizar suas próprias glicemias"
ON glicemias FOR UPDATE USING (auth.uid() = usuario_id);
CREATE POLICY "Usuários podem deletar suas próprias glicemias"
ON glicemias FOR DELETE USING (auth.uid() = usuario_id);

-- Medicamentos
ALTER TABLE medicamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem ver seus próprios medicamentos"
ON medicamentos FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Usuários podem inserir seus próprios medicamentos"
ON medicamentos FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Usuários podem atualizar seus próprios medicamentos"
ON medicamentos FOR UPDATE USING (auth.uid() = usuario_id);
CREATE POLICY "Usuários podem deletar seus próprios medicamentos"
ON medicamentos FOR DELETE USING (auth.uid() = usuario_id);

-- Consultas
ALTER TABLE consultas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem ver suas próprias consultas"
ON consultas FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Usuários podem inserir suas próprias consultas"
ON consultas FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Usuários podem atualizar suas próprias consultas"
ON consultas FOR UPDATE USING (auth.uid() = usuario_id);
CREATE POLICY "Usuários podem deletar suas próprias consultas"
ON consultas FOR DELETE USING (auth.uid() = usuario_id);

-- Atividades
ALTER TABLE atividades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários podem ver suas próprias atividades"
ON atividades FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Usuários podem inserir suas próprias atividades"
ON atividades FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Usuários podem atualizar suas próprias atividades"
ON atividades FOR UPDATE USING (auth.uid() = usuario_id);
CREATE POLICY "Usuários podem deletar suas próprias atividades"
ON atividades FOR DELETE USING (auth.uid() = usuario_id);
```

---

## 4️⃣ Executar Projeto Localmente

### Modo Desenvolvimento
```bash
npm run dev
```

Acesse: `http://localhost:5173`

### Build para Produção
```bash
npm run build
npm run preview
```

---

## 📖 Fluxo de Uso

### 1. **Primeira Vez - Cadastro**
- Clique em "Criar conta"
- Preencha: Nome, E-mail, Senha
- Selecione tipo de acompanhamento:
  - Hipertensão
  - Diabetes
  - Hipertensão e Diabetes
- Confirme senha
- Clique em "Criar cadastro"

### 2. **Login**
- Acesse: http://localhost:5173/login
- Preencha e-mail e senha
- Clique em "Entrar"

### 3. **Dashboard (Início)**
- Visualize resumo da sua rotina
- Veja últimos registros
- Acesse atalhos rápidos

### 4. **Registrar Medições**
- **Pressão**: Clique em "Pressão" ou no atalho
- **Glicemia**: Clique em "Glicemia" ou no atalho
- Preencha os dados
- Clique em "Registrar"

### 5. **Gerenciar Medicamentos**
- Clique em "Medicamentos"
- Adicione medicamento com:
  - Nome
  - Horário
  - Frequência
  - Observação (opcional)

### 6. **Agendar Consultas**
- Clique em "Consultas"
- Preencha:
  - Tipo (cardiologista, endocrinologista, etc)
  - Data
  - Horário
  - Local/Profissional
  - Observação (opcional)

### 7. **Registrar Atividades**
- Clique em "Atividades"
- Adicione:
  - Tipo (caminhada, corrida, etc)
  - Duração em minutos
  - Data
  - Observação

### 8. **Visualizar Histórico**
- Clique em "Histórico"
- Escolha período: 7, 30 ou 90 dias
- Visualize todos os registros

---

## 🎨 Personalização

### Cores
Edite `src/styles/global.css`:
```css
:root {
  --primary: #2563EB;        /* Azul */
  --dark: #1E3A8A;           /* Azul escuro */
  --success: #10B981;        /* Verde */
  --danger: #EF4444;         /* Vermelho */
  --surface: #ffffff;        /* Fundo dos cards */
  --muted: #64748B;          /* Texto secundário */
}
```

### Rotas
Edite `src/routes/AppRoutes.jsx` para adicionar novas páginas.

---

## 🐛 Troubleshooting

### Erro: "Supabase não está configurado"
- Verifique se o arquivo `.env` existe
- Confirme as variáveis: `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`
- Reinicie o servidor (`npm run dev`)

### Erro: "Não consegue criar conta"
- Verifique se as tabelas foram criadas no Supabase
- Confirme se o RLS está ativado corretamente
- Teste a conexão no Supabase SQL Editor

### Dados não aparecem após criar conta
- Verifique se o RLS permite INSERT para a tabela
- Confirme se o usuário está autenticado
- Recarregue a página

---

## 📱 Responsividade

O aplicativo funciona em:
- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

Teste no navegador:
1. Abra as DevTools (F12)
2. Clique no ícone de responsividade
3. Selecione dispositivo

---

## 🔒 Segurança

- ✅ Autenticação via Supabase Auth
- ✅ RLS protege dados por usuário
- ✅ Senhas criptografadas
- ✅ Sem armazenamento de dados sensíveis no navegador

---

## 📚 Estrutura de Pastas

```
src/
├── App.jsx                 # Componente raiz
├── main.jsx               # Entry point
├── components/            # Componentes reutilizáveis
├── pages/                 # Páginas da aplicação
├── routes/                # Definição de rotas
├── services/              # Integração com Supabase
├── context/               # Context API (autenticação)
└── styles/                # Estilos CSS
```

---

## 🚀 Deploy

### Opção 1: Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Opção 2: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Opção 3: GitHub Pages
```bash
npm run build
# Faça upload da pasta 'dist'
```

---

## 📞 Suporte

- Documentação: `MIGRACAO_CUIDAPLUS.md`
- Guia Supabase: `SUPABASE_RLS.md`
- Setup Banco: `DATABASE_SETUP.md`

---

**Status**: ✅ Pronto para desenvolvimento
**Versão**: 0.1.0
**Última atualização**: Agosto 2026

