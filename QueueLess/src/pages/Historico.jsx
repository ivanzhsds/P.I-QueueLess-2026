import { useEffect, useState } from 'react';
import { deleteAllHistory, deleteHistoryItem, fetchHistory } from '../services/supabase';

function Historico() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  async function loadHistory() {
    const result = await fetchHistory();
    if (result.error) setError(result.error.message);
    else setHistory(result.data || []);
  }

  useEffect(() => { loadHistory(); }, []);

  async function removeItem(id) {
    const result = await deleteHistoryItem(id);
    if (result.error) setError(result.error.message);
    else loadHistory();
  }

  async function removeAll() {
    if (!history.length || !window.confirm('Apagar todo o histórico?')) return;
    const result = await deleteAllHistory();
    if (result.error) setError(result.error.message);
    else loadHistory();
  }

  return (
    <section className="page-content">
      <h1>Histórico</h1>
      <div className="section-header"><p className="page-description">Serviços finalizados.</p><button className="danger-button" onClick={removeAll} disabled={!history.length}>Apagar todos</button></div>
      {error && <p className="error">{error}</p>}
      <div className="record-list">{history.length ? history.map((item) => <article className="record-card" key={item.id}><div><strong>{item.cliente}</strong><p>{item.servico} · {item.placa}</p><p>Finalizado em: {item.finalizado_em ? new Date(item.finalizado_em).toLocaleString('pt-BR') : 'Não informado'}</p></div><button className="danger-button" onClick={() => removeItem(item.id)}>Apagar</button></article>) : <p className="empty-state">Nenhum serviço finalizado.</p>}</div>
    </section>
  );
}

export default Historico;
