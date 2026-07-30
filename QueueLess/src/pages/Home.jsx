import { useEffect, useState } from 'react';
import QueueList from '../components/QueueList';
import { fetchQueues, isSupabaseConfigured } from '../services/supabase';

function Home() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    async function loadQueues() {
      const { data, error: fetchError } = await fetchQueues();

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setQueues(data ?? []);
      }
      setLoading(false);
    }

    loadQueues();
  }, []);

  return (
    <section className="page-content">
      <h1>Bem-vindo ao QueueLess</h1>
      <p className="page-description">
        Gerencie agendamentos, serviços e histórico em um único painel.
      </p>

      {!isSupabaseConfigured ? (
        <div className="warning-box">
          <strong>Supabase não configurado.</strong>
          <p>
            Preencha o arquivo <code>.env</code> com <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>.
          </p>
        </div>
      ) : null}

      {loading ? (
        <p>Carregando dados...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <QueueList items={queues} />
      )}
    </section>
  );
}

export default Home;
