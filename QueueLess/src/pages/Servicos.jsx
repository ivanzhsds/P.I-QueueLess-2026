import { useEffect, useState } from 'react';
import { finishService, fetchServices } from '../services/supabase';

function Servicos() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');

  async function loadServices() {
    const result = await fetchServices();
    if (result.error) setError(result.error.message);
    else setServices(result.data || []);
  }

  useEffect(() => { loadServices(); }, []);

  async function handleFinish(service) {
    const result = await finishService(service);
    if (result.error) setError(result.error.message);
    else loadServices();
  }

  return (
    <section className="page-content">
      <h1>Serviços</h1>
      <p className="page-description">Serviços em andamento.</p>
      {error && <p className="error">{error}</p>}
      <div className="record-list">{services.length ? services.map((service) => <article className="record-card" key={service.id}><div><strong>{service.cliente}</strong><p>{service.servico} · {service.placa}</p><p>Início: {service.inicio ? new Date(service.inicio).toLocaleString('pt-BR') : 'Não informado'}</p></div><button className="primary-button" onClick={() => handleFinish(service)}>Finalizar</button></article>) : <p className="empty-state">Nenhum serviço em andamento.</p>}</div>
    </section>
  );
}

export default Servicos;
