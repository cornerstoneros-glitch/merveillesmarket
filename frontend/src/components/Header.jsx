import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, Search, User, LogOut } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isAbbeys = location.pathname.includes('/abbeys');
  const isJosy = location.pathname.includes('/josy');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="header">
      <div className="header-top">
        <div className="container header-top-content">
          <span>Naturel pour votre santé, qualité pour votre quotidien</span>
          <div className="header-top-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="https://www.facebook.com/MerveillesAbbey" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              Merveilles Abbey
            </a>
            <a href="https://www.facebook.com/JosyMarket01/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              Josy Market
            </a>
            <Link to="/contact">Aide & Contact</Link>
          </div>
        </div>
      </div>
      
      <div className="header-main container">
        <button className="menu-btn" aria-label="Menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu size={24} />
        </button>
        
        <Link to="/" className="logo-container" onClick={closeMobileMenu}>
          <img src="/images/main-logo.png" alt="Merveilles Trade Market" style={{ height: '60px', width: 'auto' }} />
        </Link>
        
        <form className="search-bar desktop-search" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Rechercher un produit..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" aria-label="Rechercher">
            <Search size={20} />
          </button>
        </form>
        
        <div className="header-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to={user.role === 'ADMIN' ? "/admin" : "/account"} className="action-btn" aria-label="Compte" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)' }} onClick={closeMobileMenu}>
                <User size={24} />
                <span style={{ fontSize: '0.9rem', fontWeight: '500', display: 'none' }} className="d-md-block">Mon Compte</span>
              </Link>
            </div>
          ) : (
            <Link to="/login" className="action-btn" aria-label="Connexion" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)' }} onClick={closeMobileMenu}>
              <User size={24} />
              <span style={{ fontSize: '0.9rem', fontWeight: '500', display: 'none' }} className="d-md-block">Connexion</span>
            </Link>
          )}
          
          <Link to="/cart" className="action-btn cart-btn" aria-label="Panier" onClick={closeMobileMenu}>
            <ShoppingCart size={24} />
            {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
          </Link>
        </div>
      </div>
      
      <nav className="header-nav">
        <div className="container nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link to="/abbeys" className={`nav-universe ${isAbbeys ? 'active abbeys' : ''}`} onClick={closeMobileMenu}>
              Merveilles Abbeys (Santé)
            </Link>
            <Link to="/josy" className={`nav-universe ${isJosy ? 'active josy' : ''}`} onClick={closeMobileMenu}>
              Josy Market (Mode & Maison)
            </Link>
          </div>
          
          <div className="top-menu desktop-menu" style={{ display: 'flex', gap: '1.5rem', fontWeight: '500', fontSize: '0.95rem' }}>
            <Link to="/" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>Accueil</Link>
            <Link to="/abbeys" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>Boutique Santé</Link>
            <Link to="/josy" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>Boutique Maison</Link>
            <Link to="/faq" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>FAQ</Link>
            <Link to="/contact" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <img src="/images/main-logo.png" alt="Merveilles Trade Market" style={{ height: '50px', width: 'auto' }} />
          <button className="close-menu-btn" onClick={closeMobileMenu}>&times;</button>
        </div>
        
        <form className="search-bar mobile-search" onSubmit={handleSearch} style={{ margin: '1rem', display: 'flex' }}>
          <input 
            type="text" 
            placeholder="Rechercher..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" aria-label="Rechercher">
            <Search size={20} />
          </button>
        </form>

        <div className="mobile-nav-links">
          <Link to="/" onClick={closeMobileMenu}>Accueil</Link>
          <Link to="/abbeys" onClick={closeMobileMenu}>Boutique Santé (Abbeys)</Link>
          <Link to="/josy" onClick={closeMobileMenu}>Boutique Maison (Josy)</Link>
          <Link to="/faq" onClick={closeMobileMenu}>FAQ</Link>
          <Link to="/contact" onClick={closeMobileMenu}>Aide & Contact</Link>
          
          <div className="mobile-socials">
            <a href="https://www.facebook.com/MerveillesAbbey" target="_blank" rel="noopener noreferrer">Merveilles Abbey</a>
            <a href="https://www.facebook.com/JosyMarket01/" target="_blank" rel="noopener noreferrer">Josy Market</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
