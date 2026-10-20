import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { sendContactMessage } from '../api';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus('loading');
    setStatusMessage('');

    try {
      const res = await sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        message: message.trim()
      });

      setStatus('success');
      setStatusMessage(res.message || 'Votre message a bien été envoyé ! Nous vous répondrons sous 24h.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setStatusMessage(err.message || 'Erreur lors de l\'envoi de votre message. Veuillez réessayer.');
    }
  };

  return (
    <div className="container section" style={{ minHeight: '70vh' }}>
      <h1 style={{ marginBottom: '1rem', textAlign: 'center' }}>Contactez-nous</h1>
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
        Vous avez une question, une suggestion ou besoin d'aide avec votre commande ? N'hésitez pas à nous contacter, notre équipe se fera un plaisir de vous répondre.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        <div style={{ backgroundColor: 'var(--color-white)', padding: '2rem', borderRadius: '16px' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Nos Coordonnées</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--color-green-tint)', padding: '1rem', borderRadius: '50%', color: 'var(--color-green-dark)' }}>
                <Phone size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Téléphone</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>+225 07 01 92 95 98</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Lundi au Samedi: 8h00 - 18h00</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--color-gold-tint)', padding: '1rem', borderRadius: '50%', color: 'var(--color-gold)' }}>
                <Mail size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Email</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                  <a href="mailto:contact@merveillesmarket.net" style={{ color: 'inherit', textDecoration: 'none' }}>contact@merveillesmarket.net</a>
                </p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  Commandes : <a href="mailto:commandes@merveillesmarket.net" style={{ color: 'var(--color-green-dark)' }}>commandes@merveillesmarket.net</a>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--color-bg-light)', padding: '1rem', borderRadius: '50%', color: 'var(--color-text)' }}>
                <MapPin size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Adresse</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Abidjan, Côte d'Ivoire</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-white)', padding: '2rem', borderRadius: '16px' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Envoyez-nous un message</h2>

          {status === 'success' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '8px', backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', marginBottom: '1.5rem' }}>
              <CheckCircle size={20} />
              <span>{statusMessage}</span>
            </div>
          )}

          {status === 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', marginBottom: '1.5rem' }}>
              <AlertCircle size={20} />
              <span>{statusMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="name" style={{ fontWeight: '500' }}>Votre nom</label>
              <input 
                type="text" 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Jean Dupont"
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-light)', fontSize: '1rem' }} 
                required 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="email" style={{ fontWeight: '500' }}>Votre email</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: jean.dupont@email.com"
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-light)', fontSize: '1rem' }} 
                required 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="message" style={{ fontWeight: '500' }}>Votre message</label>
              <textarea 
                id="message" 
                rows="5" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Écrivez votre message ici..."
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-light)', fontSize: '1rem', fontFamily: 'inherit' }} 
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={status === 'loading'}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', opacity: status === 'loading' ? 0.7 : 1 }}
            >
              <Send size={18} /> {status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

