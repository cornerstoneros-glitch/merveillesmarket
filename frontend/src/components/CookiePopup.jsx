import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CookiePopup.css';

const CookiePopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted or declined cookies
    const hasConsented = localStorage.getItem('cookie_consent');
    
    if (!hasConsented) {
      // Show immediately or after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-popup">
      <div className="cookie-content">
        <div className="cookie-icon-wrapper">
          <Cookie size={24} className="cookie-icon" />
        </div>
        <div className="cookie-text">
          <p>
            Nous utilisons des cookies pour améliorer votre expérience sur Merveilles Market, analyser notre trafic et vous proposer du contenu adapté.
            <Link to="/cgv" className="cookie-link"> En savoir plus</Link>.
          </p>
        </div>
      </div>
      <div className="cookie-actions">
        <button className="cookie-btn cookie-btn-outline" onClick={handleDecline}>
          Refuser
        </button>
        <button className="cookie-btn cookie-btn-primary" onClick={handleAccept}>
          Accepter
        </button>
        <button className="cookie-close" onClick={handleDecline} aria-label="Fermer">
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default CookiePopup;
