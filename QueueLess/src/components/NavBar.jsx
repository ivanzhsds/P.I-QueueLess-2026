import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Agendamentos', path: '/agendamentos' },
  { label: 'Serviços', path: '/servicos' },
  { label: 'Histórico', path: '/historico' },
];

function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <header className="nav-bar">
      <div className="nav-brand">QueueLess</div>
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
