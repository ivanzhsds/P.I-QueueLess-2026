-- Migration segura e idempotente para o Cuida+
-- Baseado no código atual e na documentação de setup do projeto.

CREATE TABLE IF NOT EXISTS pressoes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sistolica INTEGER NOT NULL,
  diastolica INTEGER NOT NULL,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS glicemias (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  valor DECIMAL(6,1) NOT NULL,
  momento TEXT NOT NULL,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medicamentos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  horario TIME NOT NULL,
  frequencia TEXT NOT NULL,
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consultas (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  local_profissional TEXT,
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS atividades (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  duracao INTEGER NOT NULL,
  data DATE NOT NULL,
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pressoes_usuario_id ON pressoes (usuario_id);
CREATE INDEX IF NOT EXISTS idx_pressoes_data ON pressoes (data);
CREATE INDEX IF NOT EXISTS idx_glicemias_usuario_id ON glicemias (usuario_id);
CREATE INDEX IF NOT EXISTS idx_glicemias_data ON glicemias (data);
CREATE INDEX IF NOT EXISTS idx_medicamentos_usuario_id ON medicamentos (usuario_id);
CREATE INDEX IF NOT EXISTS idx_consultas_usuario_id ON consultas (usuario_id);
CREATE INDEX IF NOT EXISTS idx_consultas_data ON consultas (data);
CREATE INDEX IF NOT EXISTS idx_atividades_usuario_id ON atividades (usuario_id);
CREATE INDEX IF NOT EXISTS idx_atividades_data ON atividades (data);

ALTER TABLE pressoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE glicemias ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE atividades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ver suas próprias pressões" ON pressoes;
CREATE POLICY "Usuários podem ver suas próprias pressões"
ON pressoes FOR SELECT
USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem inserir suas próprias pressões" ON pressoes;
CREATE POLICY "Usuários podem inserir suas próprias pressões"
ON pressoes FOR INSERT
WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias pressões" ON pressoes;
CREATE POLICY "Usuários podem atualizar suas próprias pressões"
ON pressoes FOR UPDATE
USING (auth.uid() = usuario_id)
WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem deletar suas próprias pressões" ON pressoes;
CREATE POLICY "Usuários podem deletar suas próprias pressões"
ON pressoes FOR DELETE
USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem ver suas próprias glicemias" ON glicemias;
CREATE POLICY "Usuários podem ver suas próprias glicemias"
ON glicemias FOR SELECT
USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem inserir suas próprias glicemias" ON glicemias;
CREATE POLICY "Usuários podem inserir suas próprias glicemias"
ON glicemias FOR INSERT
WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias glicemias" ON glicemias;
CREATE POLICY "Usuários podem atualizar suas próprias glicemias"
ON glicemias FOR UPDATE
USING (auth.uid() = usuario_id)
WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem deletar suas próprias glicemias" ON glicemias;
CREATE POLICY "Usuários podem deletar suas próprias glicemias"
ON glicemias FOR DELETE
USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem ver seus próprios medicamentos" ON medicamentos;
CREATE POLICY "Usuários podem ver seus próprios medicamentos"
ON medicamentos FOR SELECT
USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem inserir seus próprios medicamentos" ON medicamentos;
CREATE POLICY "Usuários podem inserir seus próprios medicamentos"
ON medicamentos FOR INSERT
WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios medicamentos" ON medicamentos;
CREATE POLICY "Usuários podem atualizar seus próprios medicamentos"
ON medicamentos FOR UPDATE
USING (auth.uid() = usuario_id)
WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem deletar seus próprios medicamentos" ON medicamentos;
CREATE POLICY "Usuários podem deletar seus próprios medicamentos"
ON medicamentos FOR DELETE
USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem ver suas próprias consultas" ON consultas;
CREATE POLICY "Usuários podem ver suas próprias consultas"
ON consultas FOR SELECT
USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem inserir suas próprias consultas" ON consultas;
CREATE POLICY "Usuários podem inserir suas próprias consultas"
ON consultas FOR INSERT
WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias consultas" ON consultas;
CREATE POLICY "Usuários podem atualizar suas próprias consultas"
ON consultas FOR UPDATE
USING (auth.uid() = usuario_id)
WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem deletar suas próprias consultas" ON consultas;
CREATE POLICY "Usuários podem deletar suas próprias consultas"
ON consultas FOR DELETE
USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem ver suas próprias atividades" ON atividades;
CREATE POLICY "Usuários podem ver suas próprias atividades"
ON atividades FOR SELECT
USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem inserir suas próprias atividades" ON atividades;
CREATE POLICY "Usuários podem inserir suas próprias atividades"
ON atividades FOR INSERT
WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias atividades" ON atividades;
CREATE POLICY "Usuários podem atualizar suas próprias atividades"
ON atividades FOR UPDATE
USING (auth.uid() = usuario_id)
WITH CHECK (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuários podem deletar suas próprias atividades" ON atividades;
CREATE POLICY "Usuários podem deletar suas próprias atividades"
ON atividades FOR DELETE
USING (auth.uid() = usuario_id);
