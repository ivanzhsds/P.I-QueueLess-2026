import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isSupabaseConfigured, sendPasswordReset } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

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
    setMessage('');
    const result = await signIn(form);
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    navigate(location.state?.from || '/', { replace: true });
  }

  async function handlePasswordReset() {
    if (!form.email.trim()) {
      setError('Informe seu e-mail para receber o link de recuperação.');
      setMessage('');
      return;
    }
    setError('');
    setMessage('');
    setResetting(true);
    const { error: resetError } = await sendPasswordReset(form.email);
    setResetting(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setMessage('Se este e-mail estiver cadastrado, você receberá as instruções de recuperação.');
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <img src="/cuida-logo.svg" alt="Cuida+" className="auth-logo" />
        <div className="auth-brand" aria-label="Cuida+">Cuida+</div>

        {!isSupabaseConfigured && <p className="error auth-message" role="status">Supabase não está configurado.</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span className="auth-field-label">Email</span>
            <input
              type="email"
              id="login-email"
              name="email"
              autoComplete="email"
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
              id="login-password"
              name="senha"
              autoComplete="current-password"
              value={form.senha}
              onChange={(event) => setForm({ ...form, senha: event.target.value })}
              className="auth-input"
              placeholder="Senha"
            />
          </label>

          {error && <p className="error auth-message" role="alert">{error}</p>}
          {message && <p className="success auth-message" role="status">{message}</p>}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <button className="forgot-password" type="button" onClick={handlePasswordReset} disabled={loading || resetting}>
          {resetting ? 'Enviando instruções...' : 'Esqueci minha senha'}
        </button>
        <p className="auth-switch">
          Ainda não tem conta? <Link to="/cadastro">Criar Conta</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
