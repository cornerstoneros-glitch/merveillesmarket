import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, AlertTriangle } from 'lucide-react';
import { fetchProductById, formatPrice } from '../api';
import { CartContext } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center' });
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProductById(id).then(data => {
      setProduct(data);
      setMainImage(data.image);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  };

  if (loading) {
    return <div className="container section"><p style={{ textAlign: 'center' }}>Chargement...</p></div>;
  }

  if (!product) {
    return <div className="container section"><p style={{ textAlign: 'center' }}>Produit introuvable.</p></div>;
  }

  const isAbbeys = product.universe === 'abbeys';

  return (
    <div className="product-detail-page container section">
      <Link to={isAbbeys ? '/abbeys' : '/josy'} className="back-link">
        <ArrowLeft size={16} /> Retour à l'univers {isAbbeys ? 'Merveilles Abbeys' : 'Josy Market'}
      </Link>
      
      <div className="product-detail-grid">
        <div className="product-gallery">
          <div 
            className="main-image-container" 
            onMouseMove={handleMouseMove}
          >
            <img src={mainImage} alt={product.name} style={zoomStyle} className="zoomable-image" />
          </div>
          
          {product.images && product.images.length > 0 && (
            <div className="thumbnails-container">
              {/* Image principale comme miniature */}
              <div 
                className={`thumbnail ${mainImage === product.image ? 'active' : ''}`}
                onClick={() => setMainImage(product.image)}
              >
                <img src={product.image} alt={product.name} />
              </div>
              
              {/* Images secondaires */}
              {product.images.map((imgUrl, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${mainImage === imgUrl ? 'active' : ''}`}
                  onClick={() => setMainImage(imgUrl)}
                >
                  <img src={imgUrl} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1 className="product-title">{product.name}</h1>
          <p className={`product-price-large ${isAbbeys ? 'text-abbeys' : 'text-josy'}`}>
            {formatPrice(product.price)}
          </p>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          {product.warnings && (
            <div className="product-warning">
              <AlertTriangle size={20} className="warning-icon" />
              <div>
                <strong>Précautions d'usage :</strong>
                <p>{product.warnings}</p>
              </div>
            </div>
          )}
          
          <div className="add-to-cart-section">
            {product.stock > 0 ? (
              <>
                <div style={{ marginBottom: '1rem', fontWeight: '500', color: product.stock < 5 ? '#ea580c' : 'var(--color-text-muted)' }}>
                  {product.stock < 5 ? `Plus que ${product.stock} en stock` : 'En stock'}
                </div>
                <div className="quantity-selector">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                </div>
                <button 
                  className={`btn-primary btn-add-cart ${isAbbeys ? 'btn-abbeys' : 'btn-josy'}`}
                  onClick={() => {
                    addToCart(product, quantity);
                    alert('Produit ajouté au panier !');
                  }}
                >
                  <ShoppingCart size={20} /> Ajouter au panier
                </button>
              </>
            ) : (
              <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontWeight: '600', textAlign: 'center' }}>
                En rupture de stock
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
