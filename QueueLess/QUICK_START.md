# ⚡ QUICK START - Cuida+

## 🚀 Em 3 Passos

### 1. Instalar
```bash
cd QueueLess
npm install
```

### 2. Configurar Supabase
Crie `.env`:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave
```

### 3. Executar
```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

## 📖 Documentos Essenciais

| Documento | Propósito |
|-----------|-----------|
| [README.md](README.md) | Overview do projeto |
| [SETUP_GUIA.md](SETUP_GUIA.md) | Setup completo |
| [CONCLUSAO.md](CONCLUSAO.md) | Resumo executivo |
| [MIGRACAO_CUIDAPLUS.md](MIGRACAO_CUIDAPLUS.md) | Detalhes técnicos |
| [DATABASE_SETUP.md](DATABASE_SETUP.md) | Script SQL |
| [SUPABASE_RLS.md](SUPABASE_RLS.md) | Políticas de segurança |

---

## 🎯 Telas Disponíveis

- 🔐 **/login** - Autenticação
- 📝 **/cadastro** - Registro
- 📊 **/** - Dashboard
- 💓 **/pressao** - Pressão Arterial
- 🩺 **/glicemia** - Glicemia
- 💊 **/medicamentos** - Medicamentos
- 📅 **/consultas** - Consultas
- 🏃 **/atividades** - Atividades
- 📋 **/historico** - Histórico
- 👤 **/perfil** - Perfil

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview (produção local)
npm run preview

# Checagem de dependências
npm audit
```

---

## 📱 Testar Responsividade

No navegador:
1. Abra DevTools (F12)
2. Clique no ícone de responsividade
3. Escolha um dispositivo

---

## 🐛 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| "Supabase não configurado" | Verifique `.env` |
| Erro ao criar conta | Confirme tabelas no Supabase |
| Dados não carregam | Verifique RLS |
| Porta 5173 em uso | Use `npm run dev -- --port 3000` |

---

## 🎨 Cores Cuida+

```css
--primary: #2563EB    /* Azul */
--dark: #1E3A8A       /* Azul escuro */
--success: #10B981    /* Verde */
--danger: #EF4444     /* Vermelho */
```

---

## 📦 Estrutura Mínima

```
src/
├── pages/          # 10 páginas
├── components/     # Componentes
├── routes/         # Rotas
├── services/       # Supabase
├── context/        # Auth
└── styles/         # CSS
```

---

## ✨ Checklist de Uso

- [ ] Instalar dependências
- [ ] Configurar `.env`
- [ ] Criar tabelas Supabase
- [ ] Ativar RLS
- [ ] Testar login
- [ ] Testar cadastro
- [ ] Testar CRUD em cada página
- [ ] Testar responsividade

---

## 🚀 Próximas Etapas

1. Ler [SETUP_GUIA.md](SETUP_GUIA.md) completo
2. Configurar Supabase conforme [DATABASE_SETUP.md](DATABASE_SETUP.md)
3. Testar cada funcionalidade
4. Personalizar se necessário
5. Deploy quando pronto

---

**Versão**: 0.1.0 | **Status**: ✅ Pronto | **Última atualização**: Agosto 2026
