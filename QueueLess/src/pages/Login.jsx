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
    <section className="auth-page">
      <div className="auth-card">
        <img src="/cuida-logo.svg" alt="Cuida+" className="auth-logo" />
        <div className="auth-brand" aria-label="Cuida+">Cuida+</div>

        {!isSupabaseConfigured && <p className="error auth-message">Supabase não está configurado.</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span className="auth-field-label">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="auth-input"
              placeholder="Email"
            />
          </label>

          <label className="auth-field">
            <span className="auth-field-label">Senha</span>
            <input
              type="password"
              value={form.senha}
              onChange={(event) => setForm({ ...form, senha: event.target.value })}
              className="auth-input"
              placeholder="Senha"
            />
          </label>

          {error && <p className="error auth-message">{error}</p>}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-switch">
          Ainda não tem conta? <Link to="/cadastro">Criar Conta</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
