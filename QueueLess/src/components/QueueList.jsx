function QueueList({ items = [] }) {
  return (
    <section className="page-content">
      <div className="section-header">
        <div>
          <h2>Filas recentes</h2>
          <p>Visualize as últimas entradas da fila.</p>
        </div>
      </div>
      {items.length > 0 ? (
        <div className="queue-list-grid">
          {items.map((item) => (
            <article key={item.id ?? item.name ?? item.service} className="queue-card">
              <strong>{item.cliente ?? item.name ?? item.service ?? 'Sem identificação'}</strong>
              {item.servico && <p>Serviço: {item.servico}</p>}
              {item.data && <p>{item.data}{item.hora ? ` às ${item.hora}` : ''}</p>}
              {item.status && <p>Status: {item.status}</p>}
              {item.description && <p>{item.description}</p>}
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-state">Nenhuma fila disponível no momento.</p>
      )}
    </section>
  );
}

export default QueueList;
