# Supabase RLS (Row Level Security) - Cuida+

Este arquivo contém as políticas de RLS que devem ser configuradas no Supabase para garantir a segurança do Cuida+.

## Configuração Geral

1. Para cada tabela (pressoes, glicemias, medicamentos, consultas, atividades):
   - Habilite RLS no painel "Authentication" → "Policies"
   - Adicione as políticas abaixo

## Políticas Recomendadas

### Para a tabela `pressoes`:

**Política 1 - SELECT (Usuário vê seus próprios registros)**
```sql
CREATE POLICY "Users can select their own records"
ON pressoes
FOR SELECT
USING (auth.uid() = usuario_id);
```

**Política 2 - INSERT (Usuário cria seus próprios registros)**
```sql
CREATE POLICY "Users can insert their own records"
ON pressoes
FOR INSERT
WITH CHECK (auth.uid() = usuario_id);
```

**Política 3 - UPDATE (Usuário atualiza seus próprios registros)**
```sql
CREATE POLICY "Users can update their own records"
ON pressoes
FOR UPDATE
USING (auth.uid() = usuario_id)
WITH CHECK (auth.uid() = usuario_id);
```

**Política 4 - DELETE (Usuário deleta seus próprios registros)**
```sql
CREATE POLICY "Users can delete their own records"
ON pressoes
FOR DELETE
USING (auth.uid() = usuario_id);
```

### Para as demais tabelas

Repita as mesmas políticas para:
- `glicemias`
- `medicamentos`
- `consultas`
- `atividades`

Basta substituir "pressoes" pelo nome da tabela.

## Como Aplicar no Supabase

1. Abra seu projeto no Supabase
2. Vá para "SQL Editor"
3. Copie cada comando SQL acima
4. Execute um por um
5. Verifique se há erros

## Verificação

Para verificar se as políticas foram aplicadas corretamente:

1. Vá para "Authentication" → "Policies"
2. Selecione cada tabela
3. Verifique se todas as 4 políticas aparecem

## Testes

Para testar se as políticas funcionam:

1. Faça login com um usuário
2. Tente criar um novo registro
3. Tente editar um registro seu
4. Tente deletar um registro
5. Tente acessar um registro de outro usuário (não deve ser possível)

---

**Nota**: As políticas garantem que cada usuário possa APENAS acessar, criar, editar e deletar seus próprios registros.
