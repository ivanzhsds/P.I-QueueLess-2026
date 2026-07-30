import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Agendamentos', path: '/agendamentos' },
  { label: 'Serviços', path: '/servicos' },
  { label: 'Histórico', path: '/historico' },
  { label: 'Cadastro', path: '/cadastro' },
  { label: 'Login', path: '/login' },
];

function NavBar() {
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
      </nav>
    </header>
  );
}

export default NavBar;
