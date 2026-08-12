# Cuida+ - Seu cuidado, mais simples

Bem-vindo ao Cuida+! Um aplicativo para monitoramento e apoio ao autocuidado de pessoas com hipertensão e/ou diabetes.

## 🚀 Início Rápido

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na pasta `QueueLess/`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

Veja `DATABASE_SETUP.md` para instruções completas de configuração do Supabase.

### 2. Instalar Dependências

```bash
cd QueueLess
npm install
```

### 3. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173/`

## 📋 Funcionalidades Principais

### 1. **Autenticação**
- Login e cadastro com email e senha
- Opção de escolher tipo de acompanhamento durante o cadastro:
  - Hipertensão
  - Diabetes
  - Hipertensão e Diabetes

### 2. **Dashboard (Início)**
- Resumo das últimas medições
- Próximos medicamentos e consultas
- Atalhos rápidos para as principais funcionalidades

### 3. **Registros de Saúde**

#### Pressão Arterial
- Registre sistólica e diastólica
- Data, horário e observações
- Editar e excluir registros

#### Glicemia
- Registre o valor de glicemia
- Escolha o momento da medição (jejum, antes/depois da refeição)
- Histórico completo

#### Medicamentos
- Adicione medicamentos e horários
- Frequência de ingestão
- Observações importantes

#### Consultas e Exames
- Agende consultas com diferentes profissionais
- Registre data, horário e local
- Tipos: Cardiologista, Endocrinologista, etc.

#### Atividades Físicas
- Registre atividades realizadas
- Tipo e duração
- Histórico de exercícios

### 4. **Histórico**
- Visualize todos os registros organizados por categoria
- Filtre por período (7, 30 ou 90 dias)
- Acompanhe a evolução do seu cuidado

### 5. **Perfil**
- Visualize seus dados
- Tipo de acompanhamento
- Logout

## 🎨 Design

O Cuida+ foi desenvolvido com uma interface limpa e intuitiva, otimizada para mobile:

- **Cores principais**: Azul (#2563EB) para destaque
- **Fundo claro**: Facilita a leitura (#F8FAFC)
- **Cards arredondados**: Interface moderna
- **Responsivo**: Funciona em celular, tablet e desktop

## 📊 Estrutura de Dados

Todas as informações são armazenadas no Supabase e associadas ao usuário logado. Nenhum dado é compartilhado entre usuários.

### Tabelas:
- `pressoes` - Medições de pressão arterial
- `glicemias` - Medições de glicemia
- `medicamentos` - Medicamentos prescritos
- `consultas` - Consultas e exames agendados
- `atividades` - Atividades físicas realizadas

## ⚠️ Informações Importantes

1. **Este aplicativo NÃO faz diagnóstico médico**
   - É apenas uma ferramenta de organização e registro
   - Sempre consulte um médico para interpretação dos dados

2. **Dados privados**
   - Seus dados são armazenados de forma segura no Supabase
   - Apenas você pode acessar seus registros

3. **Responsivo**
   - O design é otimizado para mobile
   - Funciona bem em tablets e desktops também

## 🛠️ Tecnologias Utilizadas

- **React** - Framework UI
- **Vite** - Build tool
- **React Router** - Navegação
- **Supabase** - Backend e banco de dados
- **CSS** - Estilos personalizados

## 📞 Suporte

Para dúvidas sobre configuração do Supabase ou estrutura do projeto, consulte:
- `DATABASE_SETUP.md` - Guia de configuração do banco de dados
- `README.md` - Instruções gerais do projeto

## 📝 Notas para Desenvolvimento

### Adicionar Novas Páginas

1. Crie o arquivo em `src/pages/NovaPage.jsx`
2. Adicione a rota em `src/routes/AppRoutes.jsx`
3. Atualize o NavBar em `src/components/NavBar.jsx` se necessário
4. Adicione funções de API em `src/services/supabase.js`

### Adicionar Novas Tabelas

1. Crie a tabela no Supabase via SQL
2. Adicione funções CRUD em `src/services/supabase.js`
3. Configure RLS (Row Level Security) para segurança

### Estilos

Os estilos globais estão em `src/styles/global.css`. Classes úteis:
- `.primary-button` - Botão principal
- `.secondary-button` - Botão secundário
- `.danger-button` - Botão de ação perigosa
- `.page-content` - Container da página
- `.record-card` - Card para exibir registros
- `.record-list` - Lista de registros

## ✅ Checklist de Configuração

- [ ] Criar projeto no Supabase
- [ ] Copiar credenciais de API
- [ ] Criar arquivo `.env`
- [ ] Criar tabelas no Supabase (SQL)
- [ ] Configurar RLS
- [ ] Instalar dependências (`npm install`)
- [ ] Iniciar servidor (`npm run dev`)
- [ ] Testar login e cadastro
- [ ] Testar criação de registros

---

**Cuida+** - Seu cuidado, mais simples. 💚
