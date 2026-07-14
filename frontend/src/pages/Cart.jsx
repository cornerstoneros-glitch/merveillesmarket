import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { formatPrice, fetchSettings } from '../api';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    const getSettings = async () => {
      try {
        const settings = await fetchSettings();
        if (settings && settings.shippingFee) {
          setShippingFee(parseFloat(settings.shippingFee));
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    getSettings();
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="container section" style={{ minHeight: '60vh' }}>
        <h1 style={{ marginBottom: '2rem' }}>Mon Panier</h1>
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--color-white)', borderRadius: '16px' }}>
          <ShoppingCart size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Votre panier est vide</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Découvrez nos produits et commencez vos achats !
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/abbeys" className="btn-secondary">
              Explorer Merveilles Abbeys
            </Link>
            <Link to="/josy" className="btn-primary">
              Explorer Josy Market
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section" style={{ minHeight: '60vh' }}>
      <h1 style={{ marginBottom: '2rem' }}>Mon Panier</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', padding: '2rem' }}>
          {cartItems.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-bg-light)' }}>
              <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{item.name}</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{item.category}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--color-bg-light)', borderRadius: '8px', padding: '0.25rem' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '0.25rem 0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>-</button>
                    <span>{item.quantity}</span>
                    <button disabled={item.quantity >= item.stock} onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '0.25rem 0.5rem', background: 'none', border: 'none', cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer', opacity: item.quantity >= item.stock ? 0.5 : 1 }}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Trash2 size={16} /> Supprimer
                  </button>
                </div>
              </div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', padding: '2rem', position: 'sticky', top: '100px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Résumé de la commande</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Sous-total</span>
            <span>{formatPrice(getCartTotal())}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-bg-light)' }}>
            <span>Frais de livraison</span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Calculés à l'étape suivante
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: '700', fontSize: '1.25rem' }}>
            <span>Total estimé</span>
            <span>{formatPrice(getCartTotal())}</span>
          </div>
          <button 
            onClick={() => navigate('/checkout')} 
            className="btn-primary" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
          >
            Procéder au paiement <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
