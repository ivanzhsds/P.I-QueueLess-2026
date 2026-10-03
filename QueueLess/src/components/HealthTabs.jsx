import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Pressão', path: '/pressao' },
  { label: 'Glicemia', path: '/glicemia' },
  { label: 'Histórico', path: '/progresso' },
];

export default function HealthTabs() {
  const { pathname } = useLocation();

  return (
    <nav className="health-tabs" aria-label="Seções de saúde">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={pathname === tab.path || (tab.path === '/progresso' && pathname === '/historico') ? 'is-active' : ''}
          aria-current={pathname === tab.path || (tab.path === '/progresso' && pathname === '/historico') ? 'page' : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
