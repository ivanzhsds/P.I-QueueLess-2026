import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAtividades, createAtividade, updateAtividade, deleteAtividade, isSupabaseConfigured } from '../services/supabase';

function Atividades() {
  const { user } = useAuth();
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ tipo: 'caminhada', duracao: '', data: new Date().toISOString().split('T')[0], observacao: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    async function loadData() {
      const { data, error: fetchError } = await fetchAtividades(user.id);
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setAtividades(data ?? []);
      }
      setLoading(false);
    }

    loadData();
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.tipo || !form.duracao || !form.data) {
      setError('Preencha tipo, duração e data.');
      return;
    }

    setError('');
    
    if (editingId) {
      const { error: updateError } = await updateAtividade(editingId, {
        ...form,
        duracao: parseInt(form.duracao),
      });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setAtividades(atividades.map(a => a.id === editingId ? { ...a, ...form } : a));
      setEditingId(null);
    } else {
      const { data: newAtividade, error: createError } = await createAtividade({
        usuario_id: user.id,
        ...form,
        duracao: parseInt(form.duracao),
      });
      if (createError) {
        setError(createError.message);
        return;
      }
      setAtividades([...atividades, newAtividade]);
    }
    
    setForm({ tipo: 'caminhada', duracao: '', data: new Date().toISOString().split('T')[0], observacao: '' });
    setShowForm(false);
  }

  async function handleDelete(id) {
    const { error: deleteError } = await deleteAtividade(id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setAtividades(atividades.filter(a => a.id !== id));
  }

  function handleEdit(atividade) {
    setForm(atividade);
    setEditingId(atividade.id);
    setShowForm(true);
  }

  return (
    <section className="page-content">
      <div className="section-header">
        <div>
          <h1>Atividades Físicas</h1>
          <p className="page-description">Registre suas atividades físicas.</p>
        </div>
        <button className="primary-button" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ tipo: 'caminhada', duracao: '', data: new Date().toISOString().split('T')[0], observacao: '' }); }}>
          {showForm ? 'Cancelar' : '+ Nova Atividade'}
        </button>
      </div>

      {!isSupabaseConfigured && (
        <div className="warning-box">
          <strong>Supabase não configurado.</strong>
          <p>Preencha o arquivo <code>.env</code> com <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>.</p>
        </div>
      )}

      {showForm && (
        <form className="data-form" onSubmit={handleSubmit}>
          <label>Tipo de Atividade
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
              <option value="caminhada">Caminhada</option>
              <option value="corrida">Corrida</option>
              <option value="bicicleta">Bicicleta</option>
              <option value="academia">Academia</option>
              <option value="yoga">Yoga</option>
              <option value="alongamento">Alongamento</option>
              <option value="outro">Outro</option>
            </select>
          </label>
          <label>Duração (minutos)
            <input type="number" value={form.duracao} onChange={(e) => setForm({ ...form, duracao: e.target.value })} />
          </label>
          <label>Data
            <input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
          </label>
          <label className="form-wide">Observação
            <input type="text" value={form.observacao} onChange={(e) => setForm({ ...form, observacao: e.target.value })} placeholder="Opcional" />
          </label>
          {error && <p className="error form-wide">{error}</p>}
          <button type="submit" className="primary-button form-wide">{editingId ? 'Atualizar' : 'Registrar'}</button>
        </form>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : atividades.length === 0 ? (
        <p className="empty-state">Nenhuma atividade registrada.</p>
      ) : (
        <div className="record-list">
          {atividades.map((atividade) => (
            <div key={atividade.id} className="record-card">
              <div>
                <strong>{atividade.tipo}</strong>
                <p>{atividade.duracao} minutos • {atividade.data}</p>
                {atividade.observacao && <p>{atividade.observacao}</p>}
              </div>
              <div className="form-actions">
                <button className="secondary-button" onClick={() => handleEdit(atividade)}>Editar</button>
                <button className="danger-button" onClick={() => handleDelete(atividade.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Atividades;
