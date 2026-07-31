import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Cadastro() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmarSenha: '' });
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
    <section className="page-content">
      <h1>Cadastro</h1>
      <p className="page-description">Crie sua conta para gerenciar os atendimentos.</p>
      <form className="data-form" onSubmit={handleSubmit}>
        <label>Nome<input value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} /></label>
        <label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <label>Senha<input type="password" value={form.senha} onChange={(event) => setForm({ ...form, senha: event.target.value })} /></label>
        <label>Confirmar senha<input type="password" value={form.confirmarSenha} onChange={(event) => setForm({ ...form, confirmarSenha: event.target.value })} /></label>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Criar cadastro'}</button>
      </form>
      <p className="form-footer">Já tem conta? <Link to="/login">Entrar</Link></p>
    </section>
  );
}

export default Cadastro;
