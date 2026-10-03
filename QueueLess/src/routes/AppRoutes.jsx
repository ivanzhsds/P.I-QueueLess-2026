import { Link, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Atividades from '../pages/Atividades';
import Cadastro from '../pages/Cadastro';
import Consultas from '../pages/Consultas';
import Glicemia from '../pages/Glicemia';
import Historico from '../pages/Historico';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Medicamentos from '../pages/Medicamentos';
import Missoes from '../pages/Missoes';
import Perfil from '../pages/Perfil';
import Planos from '../pages/Planos';
import Pressao from '../pages/Pressao';
import ProtectedRoute from './ProtectedRoute';

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/cadastro';

  if (isAuthPage) return <Outlet />;

  return (
    <div className="app-frame">
      <header className="app-topbar">
        <Link to="/" className="nav-brand" aria-label="Cuida+ início">
          <img src="/cuida-logo.svg" alt="" />
          <span>Cuida<span>+</span></span>
        </Link>
      </header>
      <main className="app-shell">
        <Outlet />
      </main>
      <NavBar />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="/saude" element={<Navigate to="/pressao" replace />} />
          <Route path="/pressao" element={<Pressao />} />
          <Route path="/glicemia" element={<Glicemia />} />
          <Route path="/medicamentos" element={<Medicamentos />} />
          <Route path="/consultas" element={<Consultas />} />
          <Route path="/atividades" element={<Atividades />} />
          <Route path="/missoes" element={<Missoes />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/progresso" element={<Historico />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
