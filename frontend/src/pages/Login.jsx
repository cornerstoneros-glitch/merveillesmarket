import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let data;
      if (isRegister) {
        data = await register(name, email, password);
      } else {
        data = await login(email, password);
      }

      // Check if they were trying to checkout
      const from = location.state?.from?.pathname || '/account';
      
      // If admin, go to admin panel. Otherwise, go to destination (account or checkout)
      if (data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from);
      }

    } catch (err) {
      setError(err.message || 'Erreur lors de l\'authentification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'var(--color-white)', padding: '3rem', borderRadius: '16px', width: '100%', maxWidth: '450px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            type="button"
            onClick={() => setIsRegister(false)}
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              borderBottom: !isRegister ? '2px solid var(--color-primary)' : '2px solid transparent',
              background: 'none',
              fontWeight: !isRegister ? '600' : '400',
              color: !isRegister ? 'var(--color-primary)' : 'var(--color-text-muted)'
            }}
          >
            Connexion
          </button>
          <button 
            type="button"
            onClick={() => setIsRegister(true)}
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              borderBottom: isRegister ? '2px solid var(--color-primary)' : '2px solid transparent',
              background: 'none',
              fontWeight: isRegister ? '600' : '400',
              color: isRegister ? 'var(--color-primary)' : 'var(--color-text-muted)'
            }}
          >
            Inscription
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-green-tint)', color: 'var(--color-green-dark)', marginBottom: '1rem' }}>
            {isRegister ? <User size={32} /> : <Lock size={32} />}
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            {isRegister ? 'Créer un compte' : 'Bon retour !'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            {isRegister ? 'Rejoignez Merveilles Market pour suivre vos commandes.' : 'Veuillez vous connecter à votre compte.'}
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {isRegister && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="name" style={{ fontWeight: '500', fontSize: '0.95rem' }}>Nom complet</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-light)', fontSize: '1rem' }} 
                  placeholder="Jean Dupont"
                  required={isRegister} 
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontWeight: '500', fontSize: '0.95rem' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-light)', fontSize: '1rem' }} 
                placeholder="votre@email.com"
                required 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="password" style={{ fontWeight: '500', fontSize: '0.95rem' }}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-light)', fontSize: '1rem' }} 
                placeholder="••••••••"
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isLoading}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', padding: '1rem', width: '100%' }}
          >
            {isLoading ? 'Patientez...' : (isRegister ? 'S\'inscrire' : 'Se connecter')} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
