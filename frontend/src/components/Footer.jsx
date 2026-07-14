import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Share2 } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-col">
          <div className="footer-logo" style={{ marginBottom: '1rem' }}>
            <img src="/images/main-logo.png" alt="Merveilles Trade Market" style={{ height: '80px', width: 'auto' }} />
          </div>
          <p className="footer-desc">
            Naturel pour votre santé, qualité pour votre quotidien.
          </p>
          <div className="footer-socials" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href="https://www.facebook.com/MerveillesAbbey" target="_blank" rel="noopener noreferrer" aria-label="Facebook Merveilles Abbey">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              Merveilles Abbey
            </a>
            <a href="https://www.facebook.com/JosyMarket01/" target="_blank" rel="noopener noreferrer" aria-label="Facebook Josy Market">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              Josy Market
            </a>
          </div>
        </div>
        
        <div className="footer-col">
          <h4>Univers</h4>
          <ul>
            <li><Link to="/abbeys">Merveilles Abbeys</Link></li>
            <li><Link to="/josy">Josy Market</Link></li>
            <li><Link to="/promos">Nouveautés & Promos</Link></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4>Service Client</h4>
          <ul>
            <li><Link to="/contact">Contactez-nous</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/shipping">Livraison & Retours</Link></li>
            <li><Link to="/cgv">Conditions Générales de Vente</Link></li>
          </ul>
        </div>
        
        <div className="footer-col contact-col">
          <h4>Contact</h4>
          <ul>
            <li><Phone size={16} /> +225 07 01 92 95 98</li>
            <li><Mail size={16} /> contact@merveillestrademarket.com</li>
            <li><MapPin size={16} /> Abidjan, Côte d'Ivoire</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.85rem' }}>
            <Link to="/cgu" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>CGU</Link>
            <Link to="/cgv" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>CGV</Link>
            <Link to="/mentions-legales" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Mentions Légales</Link>
            <Link to="/confidentialite" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Confidentialité</Link>
            <Link to="/cookies" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Cookies</Link>
          </div>
          <p style={{ margin: 0, opacity: 0.6 }}>&copy; {new Date().getFullYear()} Merveilles Trade Market. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
