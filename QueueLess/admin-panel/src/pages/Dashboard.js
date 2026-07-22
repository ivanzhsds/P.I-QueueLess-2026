import React, { useEffect, useState } from 'react';
import QueueList from '../components/QueueList';
import { fetchQueues } from '../services/api';
import theme from '../styles/theme';

function Dashboard() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQueues() {
      const data = await fetchQueues();
      setQueues(data);
      setLoading(false);
    }

    loadQueues();
  }, []);

  return (
    <div
      style={{
        fontFamily: theme.fontFamily,
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        minHeight: '100vh',
        padding: theme.spacing.large,
      }}
    >
      <header style={{ marginBottom: theme.spacing.large }}>
        <h1 style={{ color: theme.colors.primary }}>QueueLess Admin</h1>
        <p>Gerencie filas, acompanhe atendimentos e visualize o status das unidades.</p>
      </header>

      {loading ? <p>Carregando informações da fila...</p> : <QueueList items={queues} />}
    </div>
  );
}

export default Dashboard;