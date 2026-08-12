# 📋 Guia de Funcionalidades - Cuida+

## 🔐 Login (`/login`)

**Campos:**
- E-mail
- Senha

**Funcionalidades:**
- ✅ Validação de entrada
- ✅ Mensagens de erro
- ✅ Link para "Criar conta"
- ✅ Design responsivo

**Fluxo:**
1. Preencha e-mail e senha
2. Clique em "Entrar"
3. Será redirecionado para Home se autenticado
4. Se não tiver conta, clique em "Criar conta"

---

## 📝 Cadastro (`/cadastro`)

**Campos:**
- Nome
- E-mail
- Senha
- Confirmação de senha
- Tipo de acompanhamento (dropdown)

**Tipo de Acompanhamento:**
- Hipertensão
- Diabetes
- Hipertensão e Diabetes

**Funcionalidades:**
- ✅ Validação de campos
- ✅ Confirmação de senha
- ✅ Mensagens de sucesso/erro
- ✅ Redirecionamento automático para Login

**Fluxo:**
1. Preencha todos os campos
2. Selecione tipo de acompanhamento
3. Clique em "Criar cadastro"
4. Será redirecionado para Login
5. Faça login com suas credenciais

---

## 📊 Dashboard / Início (`/`)

**Cards de Resumo (clicáveis):**
- 💓 **Última Pressão** - Sistólica/Diastólica em mmHg
- 🩺 **Última Glicemia** - Valor em mg/dL
- 💊 **Próximo Medicamento** - Nome e horário
- 📅 **Próxima Consulta** - Tipo, data e horário

**Atalhos Rápidos (6 botões):**
- 📊 Registrar Pressão
- 📈 Registrar Glicemia
- 💊 Medicamentos
- 📅 Consultas
- 🏃 Atividades
- 📋 Histórico

**Funcionalidades:**
- ✅ Cards clicáveis redirecionam para a página
- ✅ Exibe "Nenhum registro" se não houver dados
- ✅ Atualiza ao voltar de outras páginas
- ✅ Layout responsivo em grid

---

## 💓 Pressão Arterial (`/pressao`)

**Formulário:**
- **Pressão Sistólica** (número)
- **Pressão Diastólica** (número)
- **Data** (date picker)
- **Horário** (time picker)
- **Observação** (texto opcional)

**Funcionalidades:**
- ✅ Adicionar novo registro
- ✅ Editar registro existente
- ✅ Deletar registro
- ✅ Validação obrigatória: Sistólica, Diastólica, Data, Horário
- ✅ Lista de registros ordenada por data/hora (mais recente primeiro)
- ✅ Botões: Editar, Excluir

**Fluxo CRUD:**

**Create (Criar):**
1. Clique em "+ Novo Registro"
2. Preencha os campos
3. Clique em "Registrar"

**Read (Ler):**
- Todos os registros aparecem na lista abaixo do formulário

**Update (Atualizar):**
1. Clique em "Editar" em um registro
2. Formulário é preenchido com os dados
3. Altere os valores
4. Clique em "Atualizar"

**Delete (Deletar):**
1. Clique em "Excluir" em um registro
2. Registro é removido da lista

---

## 🩺 Glicemia (`/glicemia`)

**Formulário:**
- **Valor** (número em mg/dL)
- **Momento** (dropdown):
  - Em jejum
  - Antes da refeição
  - Depois da refeição
  - Outro
- **Data** (date picker)
- **Horário** (time picker)
- **Observação** (texto opcional)

**Funcionalidades:**
- ✅ Mesmo CRUD que Pressão
- ✅ Validação obrigatória: Valor, Data, Horário
- ✅ Seleção de momento da medição
- ✅ Lista ordenada por data/hora

**Fluxo CRUD:**
- Idêntico ao de Pressão Arterial

---

## 💊 Medicamentos (`/medicamentos`)

**Formulário:**
- **Nome** (texto)
- **Horário** (time picker)
- **Frequência** (dropdown):
  - Diário
  - 2x ao dia
  - 3x ao dia
  - Intermitente
  - Sob demanda
- **Observação** (texto opcional)

**Funcionalidades:**
- ✅ Adicionar medicamento
- ✅ Editar medicamento
- ✅ Deletar medicamento
- ✅ Validação obrigatória: Nome, Horário
- ✅ Lista ordenada por horário (crescente)
- ✅ Botões: Editar, Excluir

**Fluxo CRUD:**
- Idêntico aos anteriores
- Especial: Lista ordenada por horário (útil para ver medicamentos do dia)

---

## 📅 Consultas (`/consultas`)

**Formulário:**
- **Tipo** (dropdown com opções como):
  - Cardiologista
  - Endocrinologista
  - Clínico Geral
  - Nutricionista
  - Outro
- **Data** (date picker)
- **Horário** (time picker)
- **Local/Profissional** (texto)
- **Observação** (texto opcional)

**Funcionalidades:**
- ✅ Adicionar consulta
- ✅ Editar consulta
- ✅ Deletar consulta
- ✅ Validação obrigatória: Tipo, Data, Horário
- ✅ Lista ordenada por data/hora (próximas primeiro)
- ✅ Botões: Editar, Excluir

**Fluxo CRUD:**
- Idêntico aos anteriores
- Especial: Útil para acompanhar agenda

---

## 🏃 Atividades Físicas (`/atividades`)

**Formulário:**
- **Tipo** (dropdown com opções):
  - Caminhada
  - Corrida
  - Bicicleta
  - Academia
  - Outro
- **Duração** (número em minutos)
- **Data** (date picker)
- **Observação** (texto opcional)

**Funcionalidades:**
- ✅ Adicionar atividade
- ✅ Editar atividade
- ✅ Deletar atividade
- ✅ Validação obrigatória: Tipo, Duração, Data
- ✅ Lista ordenada por data (mais recente primeiro)
- ✅ Botões: Editar, Excluir

**Fluxo CRUD:**
- Idêntico aos anteriores

---

## 📋 Histórico (`/historico`)

**Filtro:**
- **Período** (dropdown):
  - 7 dias
  - 30 dias
  - 90 dias

**Seções Exibidas:**

### 1. **Histórico de Pressão Arterial**
- Mostra: Sistólica/Diastólica, Data, Horário, Observação
- Filtro: Aplicado ao período selecionado

### 2. **Histórico de Glicemia**
- Mostra: Valor, Momento, Data, Horário, Observação
- Filtro: Aplicado ao período selecionado

### 3. **Histórico de Medicamentos**
- Mostra: Nome, Horário, Frequência
- Filtro: Aplicado ao período selecionado

### 4. **Histórico de Atividades**
- Mostra: Tipo, Duração, Data, Observação
- Filtro: Aplicado ao período selecionado

**Funcionalidades:**
- ✅ Filtrar por período
- ✅ Mostrar/ocultar seções vazias
- ✅ Ordenação cronológica
- ✅ Sem edição ou deleção (apenas visualização)

**Fluxo de Uso:**
1. Acesse Histórico
2. Selecione período (7, 30 ou 90 dias)
3. Visualize registros filtrados
4. Clique nos atalhos para editar/deletar específicos

---

## 👤 Perfil (`/perfil`)

**Informações Exibidas:**
- **Nome:** Nome do usuário (de user_metadata.nome)
- **Email:** E-mail da conta
- **Tipo de Acompanhamento:**
  - Hipertensão
  - Diabetes
  - Hipertensão e Diabetes

**Funcionalidades:**
- ✅ Visualizar informações
- ✅ Sair da conta (logout)
- ✅ Design responsivo

**Fluxo de Uso:**
1. Clique em "Perfil" na barra de navegação
2. Visualize suas informações
3. Clique em "Sair da Conta" para logout
4. Será redirecionado para Login

---

## 🧭 Navegação Geral

**Barra de Navegação (Topo):**
- Logo "Cuida+" (clicável → vai para Home)
- Links para todas as 8 páginas
- Botão "Sair" quando autenticado
- Link "Login" quando não autenticado

**Acesso a Rotas:**
- Públicas: `/login`, `/cadastro`
- Protegidas (requer autenticação): Todas as outras
- Redirecionamento automático para `/login` se não autenticado

---

## 📱 Responsividade

**Comportamentos por Tamanho:**

**Mobile (< 640px):**
- ✅ Padding reduzido
- ✅ Menu compacto
- ✅ Formulários em coluna única
- ✅ Cards em coluna única
- ✅ Botões full-width

**Tablet (640px - 1024px):**
- ✅ Layout intermediário
- ✅ Grid 2 colunas para cards
- ✅ Menu horizontal

**Desktop (> 1024px):**
- ✅ Layout completo
- ✅ Grid 3-4 colunas
- ✅ Menu horizontal expandido

---

## 🔄 Fluxo Completo de Uso

### Primeira Vez:
1. Acesse `/cadastro`
2. Preencha dados e tipo de acompanhamento
3. Clique em "Criar cadastro"
4. Será redirecionado para `/login`
5. Faça login
6. Será redirecionado para Home

### Diariamente:
1. Login em `/login`
2. Acesse Dashboard em `/`
3. Use atalhos para:
   - Registrar pressão/glicemia
   - Verificar medicamentos
   - Ver próximas consultas
   - Registrar atividades
4. Acesse `/historico` para acompanhar evolução
5. Acesse `/perfil` e clique "Sair da Conta" para logout

---

## ✅ Checklist de Testes

- [ ] Login com usuário inválido (erro)
- [ ] Login com credenciais corretas (sucesso)
- [ ] Cadastro com senhas diferentes (erro)
- [ ] Cadastro com e-mail existente (erro)
- [ ] Cadastro com dados válidos (sucesso)
- [ ] Criar registro de pressão (sucesso)
- [ ] Editar registro de pressão (sucesso)
- [ ] Deletar registro de pressão (sucesso)
- [ ] Repetir para glicemia, medicamentos, consultas, atividades
- [ ] Verificar histórico com filtros
- [ ] Verificar responsividade em mobile
- [ ] Verificar responsividade em tablet
- [ ] Verificar responsividade em desktop
- [ ] Logout funciona (redireção para login)

---

**Versão**: 0.1.0 | **Status**: ✅ Completo | **Data**: Agosto 2026
