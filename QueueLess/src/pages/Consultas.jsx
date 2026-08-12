import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchConsultas, createConsulta, updateConsulta, deleteConsulta, isSupabaseConfigured } from '../services/supabase';

function Consultas() {
  const { user } = useAuth();
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ tipo: 'cardiologista', data: '', horario: '', local_profissional: '', observacao: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    async function loadData() {
      const { data, error: fetchError } = await fetchConsultas(user.id);
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setConsultas(data ?? []);
      }
      setLoading(false);
    }

    loadData();
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.tipo || !form.data || !form.horario) {
      setError('Preencha tipo, data e horário.');
      return;
    }

    setError('');
    
    if (editingId) {
      const { error: updateError } = await updateConsulta(editingId, form);
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setConsultas(consultas.map(c => c.id === editingId ? { ...c, ...form } : c));
      setEditingId(null);
    } else {
      const { data: newConsulta, error: createError } = await createConsulta({
        usuario_id: user.id,
        ...form,
      });
      if (createError) {
        setError(createError.message);
        return;
      }
      setConsultas([...consultas, newConsulta]);
    }
    
    setForm({ tipo: 'cardiologista', data: '', horario: '', local_profissional: '', observacao: '' });
    setShowForm(false);
  }

  async function handleDelete(id) {
    const { error: deleteError } = await deleteConsulta(id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setConsultas(consultas.filter(c => c.id !== id));
  }

  function handleEdit(consulta) {
    setForm(consulta);
    setEditingId(consulta.id);
    setShowForm(true);
  }

  return (
    <section className="page-content">
      <div className="section-header">
        <div>
          <h1>Consultas e Exames</h1>
          <p className="page-description">Agende e acompanhe suas consultas.</p>
        </div>
        <button className="primary-button" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ tipo: 'cardiologista', data: '', horario: '', local_profissional: '', observacao: '' }); }}>
          {showForm ? 'Cancelar' : '+ Nova Consulta'}
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
          <label>Tipo
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
              <option value="cardiologista">Cardiologista</option>
              <option value="endocrinologista">Endocrinologista</option>
              <option value="clinico">Clínico Geral</option>
              <option value="pressao">Aferição de Pressão</option>
              <option value="glicemia">Aferição de Glicemia</option>
              <option value="exame">Exame Laboratorial</option>
              <option value="outro">Outro</option>
            </select>
          </label>
          <label>Data
            <input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
          </label>
          <label>Horário
            <input type="time" value={form.horario} onChange={(e) => setForm({ ...form, horario: e.target.value })} />
          </label>
          <label className="form-wide">Local/Profissional
            <input type="text" value={form.local_profissional} onChange={(e) => setForm({ ...form, local_profissional: e.target.value })} placeholder="Opcional" />
          </label>
          <label className="form-wide">Observação
            <input type="text" value={form.observacao} onChange={(e) => setForm({ ...form, observacao: e.target.value })} placeholder="Opcional" />
          </label>
          {error && <p className="error form-wide">{error}</p>}
          <button type="submit" className="primary-button form-wide">{editingId ? 'Atualizar' : 'Agendar'}</button>
        </form>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : consultas.length === 0 ? (
        <p className="empty-state">Nenhuma consulta agendada.</p>
      ) : (
        <div className="record-list">
          {consultas.map((consulta) => (
            <div key={consulta.id} className="record-card">
              <div>
                <strong>{consulta.tipo}</strong>
                <p>{consulta.data} às {consulta.horario}</p>
                {consulta.local_profissional && <p>{consulta.local_profissional}</p>}
                {consulta.observacao && <p>{consulta.observacao}</p>}
              </div>
              <div className="form-actions">
                <button className="secondary-button" onClick={() => handleEdit(consulta)}>Editar</button>
                <button className="danger-button" onClick={() => handleDelete(consulta.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Consultas;
