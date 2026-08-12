import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchGlicemia, createGlicemia, updateGlicemia, deleteGlicemia, isSupabaseConfigured } from '../services/supabase';

function Glicemia() {
  const { user } = useAuth();
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ valor: '', momento: 'jejum', data: new Date().toISOString().split('T')[0], horario: '', observacao: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    async function loadData() {
      const { data, error: fetchError } = await fetchGlicemia(user.id);
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setRegistros(data ?? []);
      }
      setLoading(false);
    }

    loadData();
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.valor || !form.data || !form.horario) {
      setError('Preencha valor, data e horário.');
      return;
    }

    setError('');
    
    if (editingId) {
      const { error: updateError } = await updateGlicemia(editingId, {
        valor: parseFloat(form.valor),
        momento: form.momento,
        data: form.data,
        horario: form.horario,
        observacao: form.observacao,
      });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setRegistros(registros.map(r => r.id === editingId ? { ...r, ...form } : r));
      setEditingId(null);
    } else {
      const { data: newRecord, error: createError } = await createGlicemia({
        usuario_id: user.id,
        valor: parseFloat(form.valor),
        momento: form.momento,
        data: form.data,
        horario: form.horario,
        observacao: form.observacao,
      });
      if (createError) {
        setError(createError.message);
        return;
      }
      setRegistros([...registros, newRecord]);
    }
    
    setForm({ valor: '', momento: 'jejum', data: new Date().toISOString().split('T')[0], horario: '', observacao: '' });
    setShowForm(false);
  }

  async function handleDelete(id) {
    const { error: deleteError } = await deleteGlicemia(id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setRegistros(registros.filter(r => r.id !== id));
  }

  function handleEdit(record) {
    setForm({
      valor: record.valor,
      momento: record.momento,
      data: record.data,
      horario: record.horario,
      observacao: record.observacao || '',
    });
    setEditingId(record.id);
    setShowForm(true);
  }

  return (
    <section className="page-content">
      <div className="section-header">
        <div>
          <h1>Glicemia</h1>
          <p className="page-description">Registre seus níveis de glicemia.</p>
        </div>
        <button className="primary-button" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ valor: '', momento: 'jejum', data: new Date().toISOString().split('T')[0], horario: '', observacao: '' }); }}>
          {showForm ? 'Cancelar' : '+ Novo Registro'}
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
          <label>Glicemia (mg/dL)
            <input type="number" step="0.1" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} />
          </label>
          <label>Momento da Medição
            <select value={form.momento} onChange={(e) => setForm({ ...form, momento: e.target.value })}>
              <option value="jejum">Em jejum</option>
              <option value="antes">Antes da refeição</option>
              <option value="depois">Depois da refeição</option>
              <option value="outro">Outro</option>
            </select>
          </label>
          <label>Data
            <input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
          </label>
          <label>Horário
            <input type="time" value={form.horario} onChange={(e) => setForm({ ...form, horario: e.target.value })} />
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
      ) : registros.length === 0 ? (
        <p className="empty-state">Nenhum registro de glicemia encontrado.</p>
      ) : (
        <div className="record-list">
          {registros.map((record) => (
            <div key={record.id} className="record-card">
              <div>
                <strong>{record.valor} mg/dL</strong>
                <p>{record.momento} • {record.data} às {record.horario}</p>
                {record.observacao && <p>{record.observacao}</p>}
              </div>
              <div className="form-actions">
                <button className="secondary-button" onClick={() => handleEdit(record)}>Editar</button>
                <button className="danger-button" onClick={() => handleDelete(record.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Glicemia;
