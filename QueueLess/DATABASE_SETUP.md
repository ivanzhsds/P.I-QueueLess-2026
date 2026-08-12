# Configuração do Banco de Dados - Cuida+

Este documento descreve as tabelas e a estrutura necessária para o Cuida+ no Supabase.

## Tabelas Necessárias

### 1. usuarios (criada automaticamente pelo Supabase Auth)

A tabela de usuários é gerenciada automaticamente pelo Supabase Auth, porém você pode adicionar metadados:
- `id` (uuid, PK) - do Supabase Auth
- `nome` (text) - armazenado em user_metadata
- `tipo_acompanhamento` (text) - 'pressao', 'glicemia' ou 'ambos'
- `email` (text) - do Supabase Auth
- `created_at` (timestamp) - automático

### 2. pressoes

Tabela para armazenar medições de pressão arterial.

```sql
CREATE TABLE pressoes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sistolica INTEGER NOT NULL,
  diastolica INTEGER NOT NULL,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  observacao TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pressoes_usuario_id ON pressoes(usuario_id);
CREATE INDEX idx_pressoes_data ON pressoes(data);
```

### 3. glicemias

Tabela para armazenar medições de glicemia.

```sql
CREATE TABLE glicemias (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  valor DECIMAL(6,1) NOT NULL,
  momento TEXT NOT NULL, -- 'jejum', 'antes', 'depois', 'outro'
  data DATE NOT NULL,
  horario TIME NOT NULL,
  observacao TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_glicemias_usuario_id ON glicemias(usuario_id);
CREATE INDEX idx_glicemias_data ON glicemias(data);
```

### 4. medicamentos

Tabela para armazenar medicamentos e horários.

```sql
CREATE TABLE medicamentos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  horario TIME NOT NULL,
  frequencia TEXT NOT NULL, -- 'diario', '2x', '3x', 'semanal', 'conforme'
  observacao TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_medicamentos_usuario_id ON medicamentos(usuario_id);
```

### 5. consultas

Tabela para armazenar consultas e exames agendados.

```sql
CREATE TABLE consultas (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL, -- 'cardiologista', 'endocrinologista', 'clinico', 'pressao', 'glicemia', 'exame', 'outro'
  data DATE NOT NULL,
  horario TIME NOT NULL,
  local_profissional TEXT,
  observacao TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_consultas_usuario_id ON consultas(usuario_id);
CREATE INDEX idx_consultas_data ON consultas(data);
```

### 6. atividades

Tabela para armazenar atividades físicas.

```sql
CREATE TABLE atividades (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL, -- 'caminhada', 'corrida', 'bicicleta', 'academia', 'yoga', 'alongamento', 'outro'
  duracao INTEGER NOT NULL, -- em minutos
  data DATE NOT NULL,
  observacao TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_atividades_usuario_id ON atividades(usuario_id);
CREATE INDEX idx_atividades_data ON atividades(data);
```

## Passos para Configurar o Supabase

1. **Criar um projeto no Supabase** em https://supabase.com
2. **Copiar credenciais**:
   - Abra "Settings" → "API"
   - Copie `Project URL` para `VITE_SUPABASE_URL`
   - Copie `anon public` key para `VITE_SUPABASE_PUBLISHABLE_KEY`

3. **Criar o arquivo `.env`** na raiz do projeto `QueueLess/`:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

4. **Criar as tabelas no Supabase**:
   - Abra o editor SQL no Supabase
   - Copie e cole os comandos SQL acima para cada tabela
   - Execute cada comando

5. **Configurar RLS (Row Level Security)** para segurança:
   - Para cada tabela, habilite RLS
   - Adicione política: `SELECT` e `UPDATE` onde `usuario_id = auth.uid()`
   - Adicione política: `INSERT` onde `usuario_id = auth.uid()`
   - Adicione política: `DELETE` onde `usuario_id = auth.uid()`

## Reiniciar o servidor

Após criar o arquivo `.env`, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Notas Importantes

- O Supabase Auth gerencia automaticamente a tabela `auth.users`
- Os metadados do usuário (nome, tipo_acompanhamento) são armazenados em `user_metadata` da tabela auth.users
- Todas as tabelas têm foreign keys para garantir integridade referencial
- Índices foram criados para otimizar queries comuns
