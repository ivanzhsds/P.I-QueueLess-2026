import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchMedicamentos, createMedicamento, updateMedicamento, deleteMedicamento, isSupabaseConfigured } from '../services/supabase';

function Medicamentos() {
  const { user } = useAuth();
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nome: '', horario: '', frequencia: 'diario', observacao: '' });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    async function loadData() {
      const { data, error: fetchError } = await fetchMedicamentos(user.id);
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setMedicamentos(data ?? []);
      }
      setLoading(false);
    }

    loadData();
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nome || !form.horario) {
      setError('Preencha nome e horário do medicamento.');
      return;
    }

    setError('');
    
    if (editingId) {
      const { error: updateError } = await updateMedicamento(editingId, form);
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setMedicamentos(medicamentos.map(m => m.id === editingId ? { ...m, ...form } : m));
      setEditingId(null);
    } else {
      const { data: newMed, error: createError } = await createMedicamento({
        usuario_id: user.id,
        ...form,
      });
      if (createError) {
        setError(createError.message);
        return;
      }
      setMedicamentos([...medicamentos, newMed]);
    }
    
    setForm({ nome: '', horario: '', frequencia: 'diario', observacao: '' });
    setShowForm(false);
  }

  async function handleDelete(id) {
    const { error: deleteError } = await deleteMedicamento(id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setMedicamentos(medicamentos.filter(m => m.id !== id));
  }

  function handleEdit(med) {
    setForm(med);
    setEditingId(med.id);
    setShowForm(true);
  }

  return (
    <section className="page-content">
      <div className="section-header">
        <div>
          <h1>Medicamentos</h1>
          <p className="page-description">Gerencie seus medicamentos e horários.</p>
        </div>
        <button className="primary-button" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ nome: '', horario: '', frequencia: 'diario', observacao: '' }); }}>
          {showForm ? 'Cancelar' : '+ Novo Medicamento'}
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
          <label>Nome do Medicamento
            <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </label>
          <label>Horário
            <input type="time" value={form.horario} onChange={(e) => setForm({ ...form, horario: e.target.value })} />
          </label>
          <label>Frequência
            <select value={form.frequencia} onChange={(e) => setForm({ ...form, frequencia: e.target.value })}>
              <option value="diario">Diário</option>
              <option value="2x">2 vezes ao dia</option>
              <option value="3x">3 vezes ao dia</option>
              <option value="semanal">Semanal</option>
              <option value="conforme">Conforme necessário</option>
            </select>
          </label>
          <label className="form-wide">Observação
            <input type="text" value={form.observacao} onChange={(e) => setForm({ ...form, observacao: e.target.value })} placeholder="Opcional" />
          </label>
          {error && <p className="error form-wide">{error}</p>}
          <button type="submit" className="primary-button form-wide">{editingId ? 'Atualizar' : 'Adicionar'}</button>
        </form>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : medicamentos.length === 0 ? (
        <p className="empty-state">Nenhum medicamento cadastrado.</p>
      ) : (
        <div className="record-list">
          {medicamentos.map((med) => (
            <div key={med.id} className="record-card">
              <div>
                <strong>{med.nome}</strong>
                <p>{med.horario} • {med.frequencia}</p>
                {med.observacao && <p>{med.observacao}</p>}
              </div>
              <div className="form-actions">
                <button className="secondary-button" onClick={() => handleEdit(med)}>Editar</button>
                <button className="danger-button" onClick={() => handleDelete(med.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Medicamentos;
