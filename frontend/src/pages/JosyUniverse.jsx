import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api';

const JosyUniverse = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data.filter(p => p.universe === 'josy'));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="universe-page" style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh' }}>
      <div className="universe-header" style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/images/josy-bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'var(--color-white)', 
        padding: '4rem 0', 
        textAlign: 'center' 
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/images/josy-logo.png" alt="Josy Market Logo" style={{ width: '150px', height: '150px', objectFit: 'contain', marginBottom: '1rem', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} />
          <h1 style={{ color: 'var(--color-white)', marginBottom: '1rem' }}>Josy Market</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
            Les dernières tendances de la mode et les meilleurs équipements pour votre maison.
          </p>
        </div>
      </div>
      
      <div className="container section">
        {loading ? (
          <p style={{ textAlign: 'center' }}>Chargement des produits...</p>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JosyUniverse;
