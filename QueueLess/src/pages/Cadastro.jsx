import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Cadastro() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    nome: '', 
    email: '', 
    senha: '', 
    confirmarSenha: '',
    tipoAcompanhamento: 'ambos'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.nome.trim() || !form.email.trim() || !form.senha || !form.confirmarSenha) {
      setError('Preencha nome, email, senha e confirmação de senha.');
      return;
    }
    if (form.senha !== form.confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    const result = await signUp(form);
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    setSuccess('Cadastro realizado. Redirecionando para o login...');
    setTimeout(() => navigate('/login'), 700);
  }

  return (
    <section className="auth-page">
      <div className="auth-card auth-card--register">
        <img src="/cuida-logo.svg" alt="Cuida+" className="auth-logo" />
        <div className="auth-brand" aria-label="Cuida+">Cuida+</div>

        <form className="auth-form auth-form--register" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span className="auth-field-label">Nome</span>
            <input
              value={form.nome}
              onChange={(event) => setForm({ ...form, nome: event.target.value })}
              className="auth-input"
              placeholder="Nome"
            />
          </label>

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

          <label className="auth-field">
            <span className="auth-field-label">Confirmar senha</span>
            <input
              type="password"
              value={form.confirmarSenha}
              onChange={(event) => setForm({ ...form, confirmarSenha: event.target.value })}
              className="auth-input"
              placeholder="Confirmar senha"
            />
          </label>

          <label className="auth-field">
            <span className="auth-field-label">Acompanhamento</span>
            <select
              value={form.tipoAcompanhamento}
              onChange={(event) => setForm({ ...form, tipoAcompanhamento: event.target.value })}
              className="auth-input auth-select"
            >
              <option value="pressao">Hipertensão</option>
              <option value="glicemia">Diabetes</option>
              <option value="ambos">Hipertensão e Diabetes</option>
            </select>
          </label>

          {error && <p className="error auth-message">{error}</p>}
          {success && <p className="success auth-message">{success}</p>}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Criar cadastro'}
          </button>
        </form>

        <p className="auth-switch">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </section>
  );
}

export default Cadastro;
