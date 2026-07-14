import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    '/images/hero_slide_1_1783954786282.png',
    '/images/hero_slide_2_1783954794807.png',
    '/images/hero_slide_3_1783954804039.png'
  ];

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const abbeysProducts = products.filter(p => p.universe === 'abbeys').slice(0, 3);
  const josyProducts = products.filter(p => p.universe === 'josy').slice(0, 3);
  
  // Nouveautés ou produits en promo pour la section "En Vedette"
  const featuredProducts = products.filter(p => p.isNew || p.promo).slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide})` }}
            />
          ))}
          <div className="hero-overlay"></div>
        </div>
        <div className="container hero-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content">
            <h1>Naturel pour votre santé,<br />qualité pour votre quotidien</h1>
            <p>Découvrez nos deux univers pensés pour vous.</p>
          </div>
          <div className="hero-split">
            <Link to="/abbeys" className="hero-card abbeys-card">
              <div className="hero-card-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src="/images/abbeys-logo.png" alt="Merveilles Abbeys" style={{ width: '80px', height: '80px', marginBottom: '1rem', borderRadius: '50%' }} />
                <h2>Merveilles Abbeys</h2>
                <p>Santé & Bien-être naturel</p>
                <span className="btn-secondary">Découvrir <ArrowRight size={16} /></span>
              </div>
            </Link>
            <Link to="/josy" className="hero-card josy-card">
              <div className="hero-card-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src="/images/josy-logo.png" alt="Josy Market" style={{ width: '80px', height: '80px', marginBottom: '1rem', borderRadius: '50%' }} />
                <h2>Josy Market</h2>
                <p>Mode & Électroménager</p>
                <span className="btn-primary">Découvrir <ArrowRight size={16} /></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Avantages Banner */}
      <section className="features-banner">
        <div className="container features-grid">
          <div className="feature-item">
            <Truck size={32} className="feature-icon" />
            <div>
              <h3>Livraison Rapide</h3>
              <p>Partout dans la région</p>
            </div>
          </div>
          <div className="feature-item">
            <ShieldCheck size={32} className="feature-icon" />
            <div>
              <h3>Paiement Sécurisé</h3>
              <p>100% garanti et fiable</p>
            </div>
          </div>
          <div className="feature-item">
            <Clock size={32} className="feature-icon" />
            <div>
              <h3>Service Client</h3>
              <p>À votre écoute 7j/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section (Nouveautés & Promos) */}
      {featuredProducts.length > 0 && (
        <section className="section featured-section">
          <div className="container">
            <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '3rem' }}>
              <div>
                <span className="section-subtitle" style={{ color: 'var(--color-primary)' }}>Découvrez nos</span>
                <h2>Nouveautés & Offres Spéciales</h2>
              </div>
            </div>
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Abbeys Section */}
      <section className="section universe-section abbeys-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Naturel & Authentique</span>
              <h2>Sélection Merveilles Abbeys</h2>
            </div>
            <Link to="/abbeys" className="see-all-link">Voir tout <ArrowRight size={16} /></Link>
          </div>
          {loading ? (
            <p>Chargement des produits...</p>
          ) : (
            <div className="products-grid">
              {abbeysProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Josy Section */}
      <section className="section universe-section josy-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Tendance & Pratique</span>
              <h2>Sélection Josy Market</h2>
            </div>
            <Link to="/josy" className="see-all-link">Voir tout <ArrowRight size={16} /></Link>
          </div>
          {loading ? (
            <p>Chargement des produits...</p>
          ) : (
            <div className="products-grid">
              {josyProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
