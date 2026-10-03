import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Início', path: '/', icon: '⌂', matches: ['/'] },
  { label: 'Saúde', path: '/pressao', icon: '♡', matches: ['/pressao', '/glicemia'] },
  { label: 'Missões', path: '/missoes', icon: '☆', matches: ['/missoes'] },
  { label: 'Progresso', path: '/progresso', icon: '⌁', matches: ['/progresso', '/historico'] },
  { label: 'Perfil', path: '/perfil', icon: '○', matches: ['/perfil'] },
];

export default function NavBar() {
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {navItems.map((item) => {
        const isActive = item.matches.includes(pathname);
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={`bottom-nav-link${isActive ? ' is-active' : ''}`}
          >
            <span className="bottom-nav-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
