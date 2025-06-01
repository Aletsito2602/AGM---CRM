import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/cuentas');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError(
        error.code === 'auth/invalid-credential' 
          ? 'Credenciales inválidas. Por favor, verifica tu email y contraseña.'
          : 'Error al iniciar sesión. Por favor, intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={loginBoxStyle}>
        <h1 style={titleStyle}>AGM CRM</h1>
        <h2 style={subtitleStyle}>Iniciar Sesión</h2>
        
        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Estilos
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#1a1a1a',
  padding: '20px'
};

const loginBoxStyle = {
  backgroundColor: '#2c2c2c',
  padding: '40px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '400px'
};

const titleStyle = {
  color: '#17a2b8',
  textAlign: 'center',
  marginBottom: '10px',
  fontSize: '2em'
};

const subtitleStyle = {
  color: '#b0c4de',
  textAlign: 'center',
  marginBottom: '30px',
  fontSize: '1.5em'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const labelStyle = {
  color: '#b0c4de',
  fontSize: '0.9em'
};

const inputStyle = {
  padding: '12px',
  borderRadius: '5px',
  border: '1px solid #444',
  backgroundColor: '#383838',
  color: '#fff',
  fontSize: '1em',
  width: '100%',
  boxSizing: 'border-box'
};

const buttonStyle = {
  padding: '12px',
  backgroundColor: '#17a2b8',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '1em',
  fontWeight: 'bold',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: '#138496'
  }
};

const errorStyle = {
  backgroundColor: '#dc3545',
  color: 'white',
  padding: '10px',
  borderRadius: '5px',
  marginBottom: '20px',
  textAlign: 'center'
};

export default Login; 