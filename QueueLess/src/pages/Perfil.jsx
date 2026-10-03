import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Perfil() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate('/login');
  }

  return (
    <section className="page-content">
      <h1>Meu Perfil</h1>
      <p className="page-description">Informações da sua conta.</p>
      
      <div className="record-card profile-first-card">
        <div>
          <strong>Nome:</strong>
          <p>{user?.user_metadata?.nome || 'Não preenchido'}</p>
        </div>
      </div>

      <div className="record-card">
        <div>
          <strong>Email:</strong>
          <p>{user?.email}</p>
        </div>
      </div>

      <div className="record-card">
        <div>
          <strong>Tipo de Acompanhamento:</strong>
          <p>{user?.user_metadata?.tipoAcompanhamento === 'ambos' ? 'Hipertensão e Diabetes' : user?.user_metadata?.tipoAcompanhamento === 'pressao' ? 'Hipertensão' : user?.user_metadata?.tipoAcompanhamento === 'glicemia' ? 'Diabetes' : 'Não preenchido'}</p>
        </div>
      </div>

      <Link className="record-card profile-plan-link" to="/planos">
        <div>
          <strong>Comparar planos</strong>
          <p>Ver a tabela comparativa de recursos</p>
        </div>
        <span aria-hidden="true">›</span>
      </Link>

      <div className="profile-actions">
        <button className="danger-button" onClick={handleLogout}>Sair da Conta</button>
      </div>
    </section>
  );
}

export default Perfil;
