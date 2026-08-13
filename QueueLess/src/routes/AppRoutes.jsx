import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import Pressao from '../pages/Pressao';
import Glicemia from '../pages/Glicemia';
import Medicamentos from '../pages/Medicamentos';
import Consultas from '../pages/Consultas';
import Atividades from '../pages/Atividades';
import Historico from '../pages/Historico';
import Perfil from '../pages/Perfil';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/cadastro';

  return (
    <>
      {!isAuthPage && <NavBar />}
      <main className={isAuthPage ? 'app-shell auth-shell' : 'app-shell'}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/pressao" element={<Pressao />} />
            <Route path="/glicemia" element={<Glicemia />} />
            <Route path="/medicamentos" element={<Medicamentos />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/atividades" element={<Atividades />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}
