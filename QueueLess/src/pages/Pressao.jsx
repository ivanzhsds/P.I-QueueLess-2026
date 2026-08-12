import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchPressao, createPressao, updatePressao, deletePressao, isSupabaseConfigured } from '../services/supabase';

function Pressao() {
  const { user } = useAuth();
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ sistolica: '', diastolica: '', data: new Date().toISOString().split('T')[0], horario: '', observacao: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    async function loadData() {
      const { data, error: fetchError } = await fetchPressao(user.id);
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
    if (!form.sistolica || !form.diastolica || !form.data || !form.horario) {
      setError('Preencha pressão sistólica, diastólica, data e horário.');
      return;
    }

    setError('');
    
    if (editingId) {
      const { error: updateError } = await updatePressao(editingId, {
        sistolica: parseInt(form.sistolica),
        diastolica: parseInt(form.diastolica),
        data: form.data,
        horario: form.horario,
        observacao: form.observacao,
      });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setRegistros(registros.map(r => r.id === editingId ? { ...r, sistolica: form.sistolica, diastolica: form.diastolica, data: form.data, horario: form.horario, observacao: form.observacao } : r));
      setEditingId(null);
    } else {
      const { data: newRecord, error: createError } = await createPressao({
        usuario_id: user.id,
        sistolica: parseInt(form.sistolica),
        diastolica: parseInt(form.diastolica),
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
    
    setForm({ sistolica: '', diastolica: '', data: new Date().toISOString().split('T')[0], horario: '', observacao: '' });
    setShowForm(false);
  }

  async function handleDelete(id) {
    const { error: deleteError } = await deletePressao(id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setRegistros(registros.filter(r => r.id !== id));
  }

  function handleEdit(record) {
    setForm({
      sistolica: record.sistolica,
      diastolica: record.diastolica,
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
          <h1>Pressão Arterial</h1>
          <p className="page-description">Registre suas medições de pressão arterial.</p>
        </div>
        <button className="primary-button" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ sistolica: '', diastolica: '', data: new Date().toISOString().split('T')[0], horario: '', observacao: '' }); }}>
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
          <label>Pressão Sistólica (mmHg)
            <input type="number" value={form.sistolica} onChange={(e) => setForm({ ...form, sistolica: e.target.value })} />
          </label>
          <label>Pressão Diastólica (mmHg)
            <input type="number" value={form.diastolica} onChange={(e) => setForm({ ...form, diastolica: e.target.value })} />
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
        <p className="empty-state">Nenhum registro de pressão encontrado.</p>
      ) : (
        <div className="record-list">
          {registros.map((record) => (
            <div key={record.id} className="record-card">
              <div>
                <strong>{record.sistolica}/{record.diastolica} mmHg</strong>
                <p>{record.data} às {record.horario}</p>
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

export default Pressao;
