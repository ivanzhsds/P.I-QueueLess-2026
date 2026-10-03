import { Link } from 'react-router-dom';

export default function Missoes() {
  return (
    <section className="page-content">
      <div className="section-header">
        <div>
          <span className="eyebrow">CUIDA+</span>
          <h1>Missões</h1>
          <p className="page-description">Gamificação e conquistas.</p>
        </div>
      </div>

      <section className="record-card missions-unavailable">
        <span className="missions-symbol" aria-hidden="true">☆</span>
        <div>
          <h2>Missões ainda não disponíveis</h2>
          <p>
            O projeto ainda não possui níveis, XP, sequência ou conquistas.
            Nenhum progresso fictício será exibido aqui.
          </p>
        </div>
      </section>

      <Link className="primary-button missions-link" to="/atividades">
        Ver atividades físicas
      </Link>
    </section>
  );
}
