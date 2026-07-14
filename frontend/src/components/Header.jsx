import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, Search, User } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  
  const isAbbeys = location.pathname.includes('/abbeys');
  const isJosy = location.pathname.includes('/josy');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Optional: clear after search
    }
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container header-top-content">
          <span>Naturel pour votre santé, qualité pour votre quotidien</span>
          <div className="header-top-links">
            <Link to="/contact">Aide & Contact</Link>
            <Link to="/about">À propos</Link>
          </div>
        </div>
      </div>
      
      <div className="header-main container">
        <button className="menu-btn" aria-label="Menu">
          <Menu size={24} />
        </button>
        
        <Link to="/" className="logo-container">
          <img src="/images/main-logo.png" alt="Merveilles Trade Market" style={{ height: '60px', width: 'auto' }} />
        </Link>
        
        <form className="search-bar" onSubmit={handleSearch}>
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
          <Link to="/account" className="action-btn" aria-label="Compte">
            <User size={24} />
          </Link>
          <Link to="/cart" className="action-btn cart-btn" aria-label="Panier">
            <ShoppingCart size={24} />
            {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
          </Link>
        </div>
      </div>
      
      <nav className="header-nav">
        <div className="container nav-container">
          <Link to="/abbeys" className={`nav-universe ${isAbbeys ? 'active abbeys' : ''}`}>
            Merveilles Abbeys (Santé)
          </Link>
          <Link to="/josy" className={`nav-universe ${isJosy ? 'active josy' : ''}`}>
            Josy Market (Mode & Maison)
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
