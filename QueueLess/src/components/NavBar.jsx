import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Início', path: '/' },
  { label: 'Pressão', path: '/pressao' },
  { label: 'Glicemia', path: '/glicemia' },
  { label: 'Medicamentos', path: '/medicamentos' },
  { label: 'Histórico', path: '/historico' },
  { label: 'Consultas', path: '/consultas' },
  { label: 'Atividades', path: '/atividades' },
  { label: 'Perfil', path: '/perfil' },
];

function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <header className="nav-bar">
      <div className="nav-brand">Cuida+</div>
      <nav className="nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
        {user ? (
          <button type="button" className="nav-link nav-button" onClick={signOut}>
            Sair
          </button>
        ) : (
          <NavLink to="/login" className="nav-link">
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
}

export default NavBar;
