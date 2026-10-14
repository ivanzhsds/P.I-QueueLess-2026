import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPressao, fetchGlicemia, fetchMedicamentos, fetchConsultas, isSupabaseConfigured } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ultimaPressao, setUltimaPressao] = useState(null);
  const [ultimaGlicemia, setUltimaGlicemia] = useState(null);
  const [proximoMedicamento, setProximoMedicamento] = useState(null);
  const [proximaConsulta, setProximaConsulta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function handleCardKeyDown(event, path) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navigate(path);
    }
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const [pressao, glicemia, medicamentos, consultas] = await Promise.all([
          fetchPressao(user.id),
          fetchGlicemia(user.id),
          fetchMedicamentos(user.id),
          fetchConsultas(user.id),
        ]);

        const failedRequest = [pressao, glicemia, medicamentos, consultas].find((result) => result.error);
        if (failedRequest) {
          setError(failedRequest.error.message);
          return;
        }

        if (pressao.data && pressao.data.length > 0) {
          setUltimaPressao(pressao.data[0]);
        }
        if (glicemia.data && glicemia.data.length > 0) {
          setUltimaGlicemia(glicemia.data[0]);
        }
        if (medicamentos.data && medicamentos.data.length > 0) {
          setProximoMedicamento(medicamentos.data[0]);
        }
        const hoje = new Date().toISOString().split('T')[0];
        const proxima = consultas.data?.find((consulta) => consulta.data >= hoje);
        if (proxima) {
          setProximaConsulta(proxima);
        }
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  if (loading) return <section className="page-content"><p>Carregando...</p></section>;

  return (
    <section className="page-content">
      <div className="dashboard-welcome">
        <div>
          <span className="eyebrow">SEU RESUMO DE SAÚDE</span>
          <h1>Olá, {user?.user_metadata?.nome?.split(' ')[0] || 'bem-vindo'}!</h1>
          <p className="page-description">Como você está se sentindo hoje?</p>
        </div>
        <button className="icon-button" type="button" aria-label="Ver perfil" onClick={() => navigate('/perfil')}>○</button>
      </div>

      <h2 className="section-heading">Resumo da sua saúde</h2>

      {!isSupabaseConfigured && (
        <div className="warning-box">
          <strong>Supabase não configurado.</strong>
          <p>Preencha o arquivo <code>.env</code> com <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>.</p>
        </div>
      )}

      {error && <p className="error" role="alert">{error}</p>}

      <div className="queue-list-grid">
        <div className="queue-card clickable-card" role="button" tabIndex="0" onClick={() => navigate('/pressao')} onKeyDown={(event) => handleCardKeyDown(event, '/pressao')}>
          <strong>Última Pressão</strong>
          {ultimaPressao ? (
            <>
              <p className="metric-value">
                {ultimaPressao.sistolica}/{ultimaPressao.diastolica} mmHg
              </p>
              <p className="metric-label">{ultimaPressao.data}</p>
            </>
          ) : (
            !error && <p className="empty-card-state">Nenhum registro</p>
          )}
        </div>

        <div className="queue-card clickable-card" role="button" tabIndex="0" onClick={() => navigate('/glicemia')} onKeyDown={(event) => handleCardKeyDown(event, '/glicemia')}>
          <strong>Última Glicemia</strong>
          {ultimaGlicemia ? (
            <>
              <p className="metric-value">
                {ultimaGlicemia.valor} mg/dL
              </p>
              <p className="metric-label">{ultimaGlicemia.data}</p>
            </>
          ) : (
            !error && <p className="empty-card-state">Nenhum registro</p>
          )}
        </div>

        <div className="queue-card clickable-card" role="button" tabIndex="0" onClick={() => navigate('/medicamentos')} onKeyDown={(event) => handleCardKeyDown(event, '/medicamentos')}>
          <strong>Próximo Medicamento</strong>
          {proximoMedicamento ? (
            <>
              <p className="metric-value metric-value--compact">
                {proximoMedicamento.nome}
              </p>
              <p className="metric-label">{proximoMedicamento.horario}</p>
            </>
          ) : (
            !error && <p className="empty-card-state">Nenhum medicamento</p>
          )}
        </div>

        <div className="queue-card clickable-card" role="button" tabIndex="0" onClick={() => navigate('/consultas')} onKeyDown={(event) => handleCardKeyDown(event, '/consultas')}>
          <strong>Próxima Consulta</strong>
          {proximaConsulta ? (
            <>
              <p className="metric-value metric-value--compact">
                {proximaConsulta.tipo}
              </p>
              <p className="metric-label">{proximaConsulta.data} às {proximaConsulta.horario}</p>
            </>
          ) : (
            !error && <p className="empty-card-state">Nenhuma consulta</p>
          )}
        </div>
      </div>

      <div className="section-spaced">
        <div className="section-heading-row">
          <h2 className="section-heading">Sua rotina</h2>
          <button className="text-button" type="button" onClick={() => navigate('/atividades')}>Atividades</button>
        </div>
        <div className="queue-list-grid">
          <button className="primary-button shortcut-button" onClick={() => navigate('/pressao')}>
            Registrar pressão
          </button>
          <button className="primary-button shortcut-button" onClick={() => navigate('/glicemia')}>
            Registrar glicemia
          </button>
          <button className="primary-button shortcut-button" onClick={() => navigate('/medicamentos')}>
            Medicamentos
          </button>
          <button className="primary-button shortcut-button" onClick={() => navigate('/consultas')}>
            Consultas
          </button>
          <button className="primary-button shortcut-button" onClick={() => navigate('/historico')}>
            Progresso e histórico
          </button>
        </div>
      </div>
    </section>
  );
}
 
export default Home;
