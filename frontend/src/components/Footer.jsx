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
          <div className="footer-socials">
            <a href="#" aria-label="Facebook"><Share2 size={20} /></a>
            <a href="#" aria-label="Instagram"><Share2 size={20} /></a>
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
            <li><Link to="/terms">Conditions Générales de Vente</Link></li>
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
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Merveilles Trade Market. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
