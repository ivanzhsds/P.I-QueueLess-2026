import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isSupabaseConfigured } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [navigate, user]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.email.trim() || !form.senha) {
      setError('Preencha email e senha.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await signIn(form);
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    navigate(location.state?.from || '/', { replace: true });
  }

  return (
    <section className="page-content">
      <h1>Login</h1>
      <p className="page-description">Acesse o painel do QueueLess.</p>
      {!isSupabaseConfigured && <p className="error">Supabase não está configurado.</p>}
      <form className="data-form" onSubmit={handleSubmit}>
        <label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <label>Senha<input type="password" value={form.senha} onChange={(event) => setForm({ ...form, senha: event.target.value })} /></label>
        {error && <p className="error">{error}</p>}
        <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      </form>
      <p className="form-footer">Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
    </section>
  );
}

export default Login;
