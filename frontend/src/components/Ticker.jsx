import React, { useState, useEffect } from 'react';
import { Megaphone } from 'lucide-react';
import { fetchSettings } from '../api';
import './Ticker.css';

const Ticker = () => {
  const [text, setText] = useState('');

  useEffect(() => {
    const loadTickerText = async () => {
      try {
        const settings = await fetchSettings();
        if (settings && settings.tickerText) {
          setText(settings.tickerText);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du texte défilant', err);
      }
    };
    loadTickerText();
  }, []);

  if (!text) return null;

  return (
    <div className="ticker-wrapper">
      <div className="ticker-label">
        <Megaphone size={16} />
        <span className="d-none d-md-inline">À la une</span>
      </div>
      <div className="ticker-content-container">
        <div className="ticker-content">
          <span>{text}</span>
          <span aria-hidden="true" className="ticker-separator">•</span>
          <span aria-hidden="true">{text}</span>
          <span aria-hidden="true" className="ticker-separator">•</span>
          <span aria-hidden="true">{text}</span>
          <span aria-hidden="true" className="ticker-separator">•</span>
          <span aria-hidden="true">{text}</span>
        </div>
      </div>
    </div>
  );
};

export default Ticker;
