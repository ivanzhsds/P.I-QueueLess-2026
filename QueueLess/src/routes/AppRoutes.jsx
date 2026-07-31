import { Routes, Route } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Agendamentos from '../pages/Agendamentos';
import Servicos from '../pages/Servicos';
import Historico from '../pages/Historico';
import Cadastro from '../pages/Cadastro';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <>
      <NavBar />
      <main className="app-shell">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/agendamentos" element={<Agendamentos />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/historico" element={<Historico />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}
