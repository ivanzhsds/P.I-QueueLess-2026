import { useEffect, useState } from 'react';
import { fetchPressao, fetchGlicemia, fetchMedicamentos, fetchAtividades, isSupabaseConfigured } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

function Historico() {
  const { user } = useAuth();
  const [pressoes, setPressoes] = useState([]);
  const [glicemias, setGlicemias] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('7'); // 7, 30, 90 dias

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const [p, g, m, a] = await Promise.all([
          fetchPressao(user.id),
          fetchGlicemia(user.id),
          fetchMedicamentos(user.id),
          fetchAtividades(user.id),
        ]);

        if (p.data) setPressoes(p.data);
        if (g.data) setGlicemias(g.data);
        if (m.data) setMedicamentos(m.data);
        if (a.data) setAtividades(a.data);
      } catch (err) {
        setError('Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  function filtrarPorPeriodo(registros, dias) {
    const agora = new Date();
    const dataLimite = new Date(agora.getTime() - dias * 24 * 60 * 60 * 1000);
    return registros.filter(r => new Date(r.data) >= dataLimite);
  }

  const pressoesFiltradas = filtrarPorPeriodo(pressoes, parseInt(filtro));
  const glicemiasFiltradas = filtrarPorPeriodo(glicemias, parseInt(filtro));
  const medicamentosFiltrados = filtrarPorPeriodo(medicamentos, parseInt(filtro));
  const atividadesFiltradas = filtrarPorPeriodo(atividades, parseInt(filtro));

  if (loading) return <section className="page-content"><p>Carregando...</p></section>;

  return (
    <section className="page-content">
      <div className="section-header">
        <div>
          <h1>Histórico</h1>
          <p className="page-description">Acompanhe seu histórico de registros.</p>
        </div>
        <label>Filtrar por:
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)} style={{ padding: '8px', marginTop: '8px' }}>
            <option value="7">7 dias</option>
            <option value="30">30 dias</option>
            <option value="90">90 dias</option>
          </select>
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      {!isSupabaseConfigured && (
        <div className="warning-box" style={{ marginTop: '20px' }}>
          <strong>Supabase não configurado.</strong>
          <p>Preencha o arquivo <code>.env</code> com <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>.</p>
        </div>
      )}

      {pressoesFiltradas.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h2>Pressão Arterial</h2>
          <div className="record-list">
            {pressoesFiltradas.map((record) => (
              <div key={record.id} className="record-card">
                <div>
                  <strong>{record.sistolica}/{record.diastolica} mmHg</strong>
                  <p>{record.data} às {record.horario}</p>
                  {record.observacao && <p>{record.observacao}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {glicemiasFiltradas.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h2>Glicemia</h2>
          <div className="record-list">
            {glicemiasFiltradas.map((record) => (
              <div key={record.id} className="record-card">
                <div>
                  <strong>{record.valor} mg/dL</strong>
                  <p>{record.momento} • {record.data} às {record.horario}</p>
                  {record.observacao && <p>{record.observacao}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {atividadesFiltradas.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h2>Atividades Físicas</h2>
          <div className="record-list">
            {atividadesFiltradas.map((record) => (
              <div key={record.id} className="record-card">
                <div>
                  <strong>{record.tipo}</strong>
                  <p>{record.duracao} minutos • {record.data}</p>
                  {record.observacao && <p>{record.observacao}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {medicamentosFiltrados.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h2>Medicamentos</h2>
          <div className="record-list">
            {medicamentosFiltrados.map((record) => (
              <div key={record.id} className="record-card">
                <div>
                  <strong>{record.nome}</strong>
                  <p>{record.horario} • {record.frequencia}</p>
                  {record.observacao && <p>{record.observacao}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pressoesFiltradas.length === 0 && glicemiasFiltradas.length === 0 && atividadesFiltradas.length === 0 && medicamentosFiltrados.length === 0 && (
        <p className="empty-state" style={{ marginTop: '24px' }}>Nenhum registro no período selecionado.</p>
      )}
    </section>
  );
}

export default Historico;
