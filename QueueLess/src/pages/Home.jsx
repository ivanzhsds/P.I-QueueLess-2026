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

        if (pressao.data && pressao.data.length > 0) {
          setUltimaPressao(pressao.data[pressao.data.length - 1]);
        }
        if (glicemia.data && glicemia.data.length > 0) {
          setUltimaGlicemia(glicemia.data[glicemia.data.length - 1]);
        }
        if (medicamentos.data && medicamentos.data.length > 0) {
          setProximoMedicamento(medicamentos.data[0]);
        }
        if (consultas.data && consultas.data.length > 0) {
          setProximaConsulta(consultas.data[0]);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  if (loading) return <section className="page-content"><p>Carregando...</p></section>;

  return (
    <section className="page-content">
      <div>
        <h1>Bem-vindo ao Cuida+</h1>
        <p className="page-description">Seu cuidado, mais simples. Aqui está o resumo da sua rotina.</p>
      </div>

      {!isSupabaseConfigured && (
        <div className="warning-box">
          <strong>Supabase não configurado.</strong>
          <p>Preencha o arquivo <code>.env</code> com <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>.</p>
        </div>
      )}

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
            <p className="empty-card-state">Nenhum registro</p>
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
            <p className="empty-card-state">Nenhum registro</p>
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
            <p className="empty-card-state">Nenhum medicamento</p>
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
            <p className="empty-card-state">Nenhuma consulta</p>
          )}
        </div>
      </div>

      <div className="section-spaced">
        <h2>Atalhos Rápidos</h2>
        <div className="queue-list-grid">
          <button className="primary-button shortcut-button" onClick={() => navigate('/pressao')}>
            📊 Registrar Pressão
          </button>
          <button className="primary-button shortcut-button" onClick={() => navigate('/glicemia')}>
            📈 Registrar Glicemia
          </button>
          <button className="primary-button shortcut-button" onClick={() => navigate('/medicamentos')}>
            💊 Medicamentos
          </button>
          <button className="primary-button shortcut-button" onClick={() => navigate('/consultas')}>
            📅 Consultas
          </button>
          <button className="primary-button shortcut-button" onClick={() => navigate('/atividades')}>
            🏃 Atividades
          </button>
          <button className="primary-button shortcut-button" onClick={() => navigate('/historico')}>
            📋 Histórico
          </button>
        </div>
      </div>
    </section>
  );
}
 
export default Home;
