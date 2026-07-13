import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '../api';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const isAbbeys = product.universe === 'abbeys';
  
  return (
    <div className={`product-card ${product.universe}`}>
      <Link to={`/product/${product.id}`} className="product-image-link">
        <div className="product-image-container">
          <img src={product.image} alt={product.name} className="product-image" />
          {product.isNew && <span className="product-badge new">Nouveau</span>}
          {product.promo && <span className="product-badge promo">Promo</span>}
        </div>
      </Link>
      
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        
        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button className={`add-to-cart-btn ${isAbbeys ? 'btn-abbeys' : 'btn-josy'}`} aria-label="Ajouter au panier">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
