import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api';
import { Search } from 'lucide-react';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    setLoading(true);
    fetchProducts().then(data => {
      if (query) {
        const lowerQuery = query.toLowerCase();
        const filtered = data.filter(p => 
          p.name.toLowerCase().includes(lowerQuery) || 
          p.description.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery)
        );
        setProducts(filtered);
      } else {
        setProducts(data);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [query]);

  return (
    <div className="container section" style={{ minHeight: '60vh' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Search size={32} style={{ color: 'var(--color-primary)' }} />
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Résultats de recherche</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            {query ? `Pour "${query}"` : 'Tous les produits'} - {products.length} résultat{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem' }}>Recherche en cours...</p>
      ) : products.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--color-white)', borderRadius: '16px' }}>
          <h2 style={{ marginBottom: '1rem' }}>Aucun produit trouvé</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Nous n'avons trouvé aucun résultat pour "{query}". Essayez avec d'autres mots-clés ou vérifiez l'orthographe.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
