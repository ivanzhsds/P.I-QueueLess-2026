import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createAppointment, deleteAppointment, fetchAppointments, updateAppointment } from '../services/supabase';

const emptyForm = { cliente: '', telefone: '', placa: '', marca: '', data: '', hora: '', servico: '', status: 'agendado' };

function Agendamentos() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  async function loadAppointments() {
    const result = await fetchAppointments(user.id);
    if (result.error) setError(result.error.message);
    else setAppointments(result.data || []);
  }

  useEffect(() => { loadAppointments(); }, [user.id]);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (Object.values(form).some((value) => !String(value).trim())) {
      setError('Preencha todos os campos do agendamento.');
      return;
    }
    setError('');
    const result = editingId
      ? await updateAppointment(editingId, form)
      : await createAppointment({ ...form, usuario_id: user.id });
    if (result.error) setError(result.error.message);
    else { setForm(emptyForm); setEditingId(null); loadAppointments(); }
  }

  function startEditing(appointment) {
    const { id, usuario_id, created_at, ...values } = appointment;
    setForm(values);
    setEditingId(id);
  }

  async function handleDelete(id) {
    if (!window.confirm('Excluir este agendamento?')) return;
    const result = await deleteAppointment(id);
    if (result.error) setError(result.error.message);
    else loadAppointments();
  }

  return (
    <section className="page-content">
      <h1>Agendamentos</h1>
      <p className="page-description">Organize e visualize os atendimentos agendados.</p>
      <form className="data-form appointment-form" onSubmit={handleSubmit}>
        {['cliente', 'telefone', 'placa', 'marca', 'servico'].map((field) => <label key={field}>{field[0].toUpperCase() + field.slice(1)}<input name={field} value={form[field]} onChange={updateField} /></label>)}
        <label>Data<input type="date" name="data" value={form.data} onChange={updateField} /></label>
        <label>Hora<input type="time" name="hora" value={form.hora} onChange={updateField} /></label>
        <label>Status<select name="status" value={form.status} onChange={updateField}><option value="agendado">Agendado</option><option value="confirmado">Confirmado</option><option value="cancelado">Cancelado</option></select></label>
        {error && <p className="error form-wide">{error}</p>}
        <div className="form-actions form-wide"><button className="primary-button" type="submit">{editingId ? 'Salvar edição' : 'Adicionar agendamento'}</button>{editingId && <button type="button" className="secondary-button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancelar</button>}</div>
      </form>
      <div className="record-list">{appointments.length ? appointments.map((appointment) => <article className="record-card" key={appointment.id}><div><strong>{appointment.cliente}</strong><p>{appointment.servico} | {appointment.data} às {appointment.hora}</p><p>{appointment.placa} · {appointment.marca} · {appointment.status}</p></div><div className="form-actions"><button className="secondary-button" onClick={() => startEditing(appointment)}>Editar</button><button className="danger-button" onClick={() => handleDelete(appointment.id)}>Excluir</button></div></article>) : <p className="empty-state">Nenhum agendamento encontrado.</p>}</div>
    </section>
  );
}

export default Agendamentos;
