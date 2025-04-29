import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import '../assets/loginPage.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    const card = document.getElementById('signup-card');
    requestAnimationFrame(() => card.classList.add('fade-in'));
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
  
    // Validações no frontend
    if (name.length < 2 || name.length > 50) {
      setNameError('O nome deve ter entre 2 e 50 caracteres');
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Email inválido');
      return;
    }
  
    if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
  
    if (password !== confirmpassword) {
      setConfirmPasswordError('As senhas não coincidem');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password , confirmpassword }),
        credentials: 'include',  // Certifica-se de que os cookies sejam enviados
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        switch (data.field) {
          case 'name':
            setNameError(data.message);
            break;
          case 'email':
            setEmailError(data.message);
            break;
          case 'password':
            setPasswordError(data.message);
            break;
          default:
            setEmailError(data.message || 'Erro ao cadastrar');
        }
        return;
      }
  
      // Não precisa armazenar o token, ele já está nos cookies
      login({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
  
      document.getElementById('signup-card').classList.add('fade-out');
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      setEmailError('Erro ao conectar ao servidor');
    }
  };

  const navigateToLogin = () => {
    document.getElementById('signup-card').classList.add('fade-out');
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  return (
    <div className="login-page-container">
      <div id="signup-card" className="login-card">
        <h2 className="login-title">Criar Conta</h2>
        <p className="login-subtitle">Junte-se à nossa plataforma de cursos!</p>
        <form className="login-form" onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={nameError ? 'error' : ''}
              required
            />
            {nameError && <p className="error-text">{nameError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={emailError ? 'error' : ''}
              required
            />
            {emailError && <p className="error-text">{emailError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={passwordError ? 'error' : ''}
              required
            />
            {passwordError && <p className="error-text">{passwordError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="********"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={confirmPasswordError ? 'error' : ''}
              required
            />
            {confirmPasswordError && <p className="error-text">{confirmPasswordError}</p>}
          </div>
          <button type="submit" className="login-button">Cadastrar</button>
        </form>
        <div className="signup-link">
          Já tem uma conta?
          <button onClick={navigateToLogin}>Entrar</button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;