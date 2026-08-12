# 🏥 Migração QueueLess → Cuida+

## ✅ Transformação Concluída

O projeto **QueueLess** foi totalmente transformado em **Cuida+** - um aplicativo de monitoramento e apoio ao autocuidado para pessoas com hipertensão e/ou diabetes.

---

## 📋 Resumo das Mudanças

### 1. **Identidade Visual**
- ✅ Nome do projeto atualizado para **Cuida+**
- ✅ Subtítulo: *"Seu cuidado, mais simples."*
- ✅ Paleta de cores implementada:
  - Azul principal: `#2563EB`
  - Azul escuro: `#1E3A8A`
  - Verde (sucesso): `#10B981`
  - Vermelho (atenção): `#EF4444`
  - Fundo: `#F8FAFC`

### 2. **Estrutura do Projeto**
```
src/
├── App.jsx                 (Estrutura principal)
├── main.jsx               (Entry point)
├── components/
│   └── NavBar.jsx         (Navegação com menu)
├── context/
│   └── AuthContext.jsx    (Autenticação)
├── pages/
│   ├── Login.jsx          (Login com e-mail/senha)
│   ├── Cadastro.jsx       (Registro + tipo acompanhamento)
│   ├── Home.jsx           (Dashboard com resumo)
│   ├── Pressao.jsx        (Registros de pressão arterial)
│   ├── Glicemia.jsx       (Registros de glicemia)
│   ├── Medicamentos.jsx   (Cadastro de medicamentos)
│   ├── Consultas.jsx      (Agendamento de consultas/exames)
│   ├── Atividades.jsx     (Registro de atividades físicas)
│   ├── Historico.jsx      (Histórico com gráficos)
│   └── Perfil.jsx         (Dados do usuário)
├── routes/
│   ├── AppRoutes.jsx      (Definição de rotas)
│   └── ProtectedRoute.jsx (Proteção de rotas)
├── services/
│   └── supabase.js        (API Supabase com CRUD)
└── styles/
    └── global.css         (Estilos responsivos)
```

### 3. **Funcionalidades Implementadas**

#### 🔐 Autenticação
- ✅ Login com e-mail e senha
- ✅ Cadastro com tipo de acompanhamento
- ✅ Proteção de rotas autenticadas
- ✅ Logout

#### 📊 Dashboard (Home)
- ✅ Card: Última medição de pressão arterial
- ✅ Card: Última medição de glicemia
- ✅ Card: Próximo medicamento
- ✅ Card: Próxima consulta
- ✅ Atalhos rápidos para todas as funcionalidades

#### 💊 Medicamentos
- ✅ Registrar medicamento (nome, horário, frequência)
- ✅ Editar medicamento
- ✅ Excluir medicamento
- ✅ Visualizar lista de medicamentos

#### 📈 Pressão Arterial
- ✅ Registrar medição (sistólica, diastólica, data, horário)
- ✅ Editar medição
- ✅ Excluir medição
- ✅ Visualizar histórico

#### 🩺 Glicemia
- ✅ Registrar medição (valor, momento, data, horário)
- ✅ Tipos de momento: Jejum, Antes da refeição, Depois da refeição, Outro
- ✅ Editar medição
- ✅ Excluir medição
- ✅ Visualizar histórico

#### 📅 Consultas e Exames
- ✅ Registrar consulta (tipo, data, horário, local/profissional)
- ✅ Editar consulta
- ✅ Excluir consulta
- ✅ Visualizar próximas consultas e histórico

#### 🏃 Atividades Físicas
- ✅ Registrar atividade (tipo, duração, data)
- ✅ Tipos: Caminhada, Corrida, Bicicleta, Academia, Outro
- ✅ Editar atividade
- ✅ Excluir atividade
- ✅ Visualizar histórico

#### 📋 Histórico
- ✅ Visualizar histórico de pressão arterial
- ✅ Visualizar histórico de glicemia
- ✅ Visualizar histórico de medicamentos
- ✅ Visualizar histórico de atividades
- ✅ Filtros por período (7, 30, 90 dias)

#### 👤 Perfil
- ✅ Exibir informações do usuário
- ✅ Mostrar tipo de acompanhamento
- ✅ Botão de logout

### 4. **Banco de Dados (Supabase)**

#### Tabelas Necessárias

**usuarios** (gerenciada por Supabase Auth)
```sql
- id (UUID, pk)
- email
- user_metadata.nome
- user_metadata.tipoAcompanhamento
```

**pressoes**
```sql
- id (UUID, pk)
- usuario_id (FK → auth.users)
- sistolica (integer)
- diastolica (integer)
- data (date)
- horario (time)
- observacao (text, nullable)
```

**glicemias**
```sql
- id (UUID, pk)
- usuario_id (FK → auth.users)
- valor (float)
- momento (text) -- 'jejum', 'antes', 'depois', 'outro'
- data (date)
- horario (time)
- observacao (text, nullable)
```

**medicamentos**
```sql
- id (UUID, pk)
- usuario_id (FK → auth.users)
- nome (text)
- horario (time)
- frequencia (text) -- 'diario', 'intermitente', etc
- observacao (text, nullable)
```

**consultas**
```sql
- id (UUID, pk)
- usuario_id (FK → auth.users)
- tipo (text)
- data (date)
- horario (time)
- local_profissional (text)
- observacao (text, nullable)
```

**atividades**
```sql
- id (UUID, pk)
- usuario_id (FK → auth.users)
- tipo (text)
- duracao (integer) -- em minutos
- data (date)
- observacao (text, nullable)
```

### 5. **Tecnologias Mantidas**
- ✅ React 18.2.0
- ✅ React Router 6.17.0
- ✅ Supabase 2.111.0
- ✅ Vite 5.4.1
- ✅ JavaScript/JSX

### 6. **Design & Responsividade**
- ✅ Layout responsivo para mobile, tablet e desktop
- ✅ Priorização de experiência mobile
- ✅ Cards arredondados com border-radius
- ✅ Hierarquia visual clara
- ✅ Botões grandes e fáceis de interagir
- ✅ Navegação intuitiva
- ✅ Ícones simples nos atalhos

### 7. **Arquivos Removidos**
- ❌ `src/components/QueueList.jsx` (componente antigo)
- ❌ `src/pages/Agendamentos.jsx` (página antiga)
- ❌ `src/pages/Servicos.jsx` (página antiga)

---

## 🚀 Como Usar

### Instalação
```bash
cd /workspaces/P.I-QueueLess-2026/QueueLess
npm install
```

### Desenvolvimento
```bash
npm run dev
```
Acesse: `http://localhost:5173`

### Build
```bash
npm run build
```

### Configurar Supabase
1. Criar arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

2. Criar as tabelas no Supabase conforme descrito acima.

3. Configurar RLS (Row Level Security) para proteger dados por usuário.

---

## 📝 Notas Importantes

### ⚠️ Sem Funcionalidades Médicas
- ✅ O aplicativo **não realiza diagnósticos**
- ✅ É apenas uma ferramenta de **organização e acompanhamento**
- ✅ Usa cores (verde/vermelho) apenas como indicadores visuais
- ✅ **Não substitui orientação médica profissional**

### ✅ Mantido do QueueLess
- Estrutura de autenticação
- Sistema de rotas protegidas
- Integração com Supabase
- Padrão de componentes funcional
- Estilos CSS responsive

### 🔧 Facilidades para Projeto Acadêmico
- Código simples e comentado
- Estrutura clara e bem organizada
- Fácil de entender e expandir
- Adequado para alunos 3º ano de Desenvolvimento

---

## ✨ Próximos Passos (Opcional)

1. **Gráficos**: Adicionar biblioteca como Chart.js para visualizar evoluções
2. **Notificações**: Implementar lembretes para medicamentos
3. **Exportação**: Permitir exportar relatórios em PDF
4. **Sincronização**: Configurar offline-first com IndexedDB
5. **PWA**: Transformar em Progressive Web App
6. **Dark Mode**: Adicionar tema escuro

---

## 📞 Suporte

Para dúvidas sobre a estrutura ou funcionalidades, consulte:
- Documentação Supabase: https://supabase.com/docs
- Documentação React Router: https://reactrouter.com/
- Documentação Vite: https://vitejs.dev/

---

**Status**: ✅ Pronto para uso e testes
**Versão**: 0.1.0
**Data**: Agosto 2026
