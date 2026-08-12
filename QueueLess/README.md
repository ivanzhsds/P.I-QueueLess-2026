# 🏥 Cuida+ - Seu cuidado, mais simples.

Aplicativo para **monitoramento e apoio ao autocuidado** de pessoas com hipertensão e/ou diabetes.

> ⚠️ **Importante**: Este é um aplicativo de **organização e registro**, não realiza diagnósticos médicos.

---

## 📋 Funcionalidades

- ✅ **Autenticação** - Login e cadastro seguro
- ✅ **Dashboard** - Resumo da sua rotina de cuidados
- ✅ **Pressão Arterial** - Registre suas medições
- ✅ **Glicemia** - Acompanhe seus níveis
- ✅ **Medicamentos** - Organize seus medicamentos
- ✅ **Consultas** - Agende consultas e exames
- ✅ **Atividades** - Registre atividades físicas
- ✅ **Histórico** - Visualize evolução com filtros por período
- ✅ **Perfil** - Gerencie suas informações

---

## 🚀 Início Rápido

```bash
cd QueueLess
npm install
npm run dev
```

Acesse: `http://localhost:5173`

---

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie arquivo `.env` em `QueueLess/`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

### 2. Banco de Dados

Configure o Supabase conforme documentado em `SETUP_GUIA.md`.

---

## 📁 Estrutura

```
QueueLess/
├── src/
│   ├── pages/           # Páginas da aplicação
│   ├── components/      # Componentes reutilizáveis
│   ├── routes/          # Definição de rotas
│   ├── services/        # Integração Supabase
│   ├── context/         # Context API (auth)
│   └── styles/          # Estilos CSS
├── public/              # Arquivos estáticos
└── index.html           # HTML raiz
```

---

## 📖 Documentação

- **[SETUP_GUIA.md](SETUP_GUIA.md)** - Guia completo de setup
- **[MIGRACAO_CUIDAPLUS.md](MIGRACAO_CUIDAPLUS.md)** - Detalhes da transformação
- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Setup do banco de dados
- **[SUPABASE_RLS.md](SUPABASE_RLS.md)** - Políticas de segurança

---

## 🛠️ Tecnologias

- **React** 18.2.0
- **React Router** 6.17.0
- **Supabase** 2.111.0
- **Vite** 5.4.1

---

## 📱 Responsividade

Otimizado para:
- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

---

## 🔒 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) em todas as tabelas
- Dados isolados por usuário
- Senhas criptografadas

---

## 📝 Notas

- **Sem funcionalidades médicas**: Apenas organização e registro
- **Acompanhamento profissional**: Não substitui orientação médica
- **Indicadores visuais**: Cores usadas apenas para melhor experiência

---

## 🎓 Projeto Acadêmico

Adequado para alunos de **3º ano de Desenvolvimento de Sistemas**.

Código limpo, estruturado e fácil de entender/expandir.

---

**Versão**: 0.1.0  
**Status**: ✅ Pronto para uso
