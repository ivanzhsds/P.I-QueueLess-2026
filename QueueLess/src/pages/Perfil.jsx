import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
      
      <div className="record-card" style={{ marginTop: '20px' }}>
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

      <div style={{ marginTop: '24px' }}>
        <button className="danger-button" onClick={handleLogout}>Sair da Conta</button>
      </div>
    </section>
  );
}

export default Perfil;
