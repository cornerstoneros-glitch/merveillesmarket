import React, { useState, useEffect } from 'react';
import { X, Mail, ArrowRight } from 'lucide-react';
import { subscribeNewsletter } from '../api';
import './NewsletterPopup.css';

const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Check if the user has already seen or closed the popup
    const hasSeenPopup = localStorage.getItem('newsletter_dismissed');
    
    if (!hasSeenPopup) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('newsletter_dismissed', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    setErrorMessage('');
    
    try {
      await subscribeNewsletter(email);
      setStatus('success');
      localStorage.setItem('newsletter_dismissed', 'true');
      
      // Auto close after 3.5 seconds on success
      setTimeout(() => {
        setIsOpen(false);
      }, 3500);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Une erreur est survenue lors de l\'inscription.');
    }
  };


  if (!isOpen) return null;

  return (
    <div className="newsletter-overlay">
      <div className="newsletter-popup">
        <button className="newsletter-close" onClick={handleClose} aria-label="Fermer">
          <X size={24} />
        </button>
        
        <div className="newsletter-content">
          <div className="newsletter-icon">
            <Mail size={32} />
          </div>
          
          <h2>Rejoignez Merveilles Market !</h2>
          <p>
            Inscrivez-vous à notre newsletter et recevez <strong>10% de réduction</strong> sur votre première commande de produits naturels.
          </p>
          
          {status === 'success' ? (
            <div className="newsletter-success">
              <p>Merci pour votre inscription ! 🎉</p>
              <p className="newsletter-coupon">Votre code : <strong>BIENVENUE10</strong></p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#166534' }}>
                Un email de bienvenue vous a été envoyé depuis contact@merveillesmarket.net
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              {errorMessage && (
                <div style={{ color: '#b91c1c', fontSize: '0.85rem', marginBottom: '0.75rem', width: '100%', textAlign: 'center' }}>
                  {errorMessage}
                </div>
              )}
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Patientez...' : (
                  <>S'inscrire <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          )}
          
          <p className="newsletter-disclaimer">
            Vous pouvez vous désabonner à tout moment. Nous ne spammons jamais.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;
