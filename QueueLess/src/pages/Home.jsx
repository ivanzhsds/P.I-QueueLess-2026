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
        <div className="warning-box" style={{ marginTop: '20px' }}>
          <strong>Supabase não configurado.</strong>
          <p>Preencha o arquivo <code>.env</code> com <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>.</p>
        </div>
      )}

      <div className="queue-list-grid" style={{ marginTop: '24px' }}>
        <div className="queue-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/pressao')}>
          <strong>Última Pressão</strong>
          {ultimaPressao ? (
            <>
              <p style={{ fontSize: '1.5rem', margin: '10px 0 5px', color: '#2563EB', fontWeight: 'bold' }}>
                {ultimaPressao.sistolica}/{ultimaPressao.diastolica} mmHg
              </p>
              <p style={{ fontSize: '0.875rem', color: '#64748B' }}>{ultimaPressao.data}</p>
            </>
          ) : (
            <p style={{ color: '#64748B', marginTop: '10px' }}>Nenhum registro</p>
          )}
        </div>

        <div className="queue-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/glicemia')}>
          <strong>Última Glicemia</strong>
          {ultimaGlicemia ? (
            <>
              <p style={{ fontSize: '1.5rem', margin: '10px 0 5px', color: '#2563EB', fontWeight: 'bold' }}>
                {ultimaGlicemia.valor} mg/dL
              </p>
              <p style={{ fontSize: '0.875rem', color: '#64748B' }}>{ultimaGlicemia.data}</p>
            </>
          ) : (
            <p style={{ color: '#64748B', marginTop: '10px' }}>Nenhum registro</p>
          )}
        </div>

        <div className="queue-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/medicamentos')}>
          <strong>Próximo Medicamento</strong>
          {proximoMedicamento ? (
            <>
              <p style={{ fontSize: '1rem', margin: '10px 0 5px', fontWeight: 'bold' }}>
                {proximoMedicamento.nome}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#64748B' }}>{proximoMedicamento.horario}</p>
            </>
          ) : (
            <p style={{ color: '#64748B', marginTop: '10px' }}>Nenhum medicamento</p>
          )}
        </div>

        <div className="queue-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/consultas')}>
          <strong>Próxima Consulta</strong>
          {proximaConsulta ? (
            <>
              <p style={{ fontSize: '1rem', margin: '10px 0 5px', fontWeight: 'bold' }}>
                {proximaConsulta.tipo}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#64748B' }}>{proximaConsulta.data} às {proximaConsulta.horario}</p>
            </>
          ) : (
            <p style={{ color: '#64748B', marginTop: '10px' }}>Nenhuma consulta</p>
          )}
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h2>Atalhos Rápidos</h2>
        <div className="queue-list-grid">
          <button className="primary-button" style={{ padding: '16px', textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/pressao')}>
            📊 Registrar Pressão
          </button>
          <button className="primary-button" style={{ padding: '16px', textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/glicemia')}>
            📈 Registrar Glicemia
          </button>
          <button className="primary-button" style={{ padding: '16px', textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/medicamentos')}>
            💊 Medicamentos
          </button>
          <button className="primary-button" style={{ padding: '16px', textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/consultas')}>
            📅 Consultas
          </button>
          <button className="primary-button" style={{ padding: '16px', textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/atividades')}>
            🏃 Atividades
          </button>
          <button className="primary-button" style={{ padding: '16px', textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/historico')}>
            📋 Histórico
          </button>
        </div>
      </div>
    </section>
  );
}
 
export default Home;
