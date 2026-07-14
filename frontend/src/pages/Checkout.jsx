import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { formatPrice, createOrder, fetchSettings } from '../api';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestLocation: 'abidjan',
    guestAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [shippingFee, setShippingFee] = useState(1500);

  useEffect(() => {
    // Calcul automatique des frais de livraison
    switch(formData.guestLocation) {
      case 'yopougon':
        setShippingFee(1000);
        break;
      case 'abidjan':
        setShippingFee(1500);
        break;
      case 'hors_abidjan':
        setShippingFee(2000);
        break;
      default:
        setShippingFee(1500);
    }
  }, [formData.guestLocation]);

  if (cartItems.length === 0 && !success) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const locationLabels = {
        yopougon: "Yopougon",
        abidjan: "Abidjan",
        hors_abidjan: "Hors Abidjan / Bingerville / Port-Bouët"
      };
      
      const fullAddress = `[Zone: ${locationLabels[formData.guestLocation]}] ${formData.guestAddress}`;

      const orderData = {
        ...formData,
        guestAddress: fullAddress,
        items: cartItems,
        total: getCartTotal() + shippingFee,
        shippingFee
      };
      
      await createOrder(orderData);
      
      setSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container section" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <CheckCircle size={64} style={{ color: 'var(--color-green)', marginBottom: '2rem' }} />
        <h1 style={{ marginBottom: '1rem', textAlign: 'center' }}>Commande confirmée !</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', textAlign: 'center', maxWidth: '600px' }}>
          Merci pour votre commande. Nous avons bien reçu vos informations et procéderons à l'expédition très prochainement.
        </p>
        <Link to="/" className="btn-primary">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="container section" style={{ minHeight: '60vh' }}>
      <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '2rem', textDecoration: 'none' }}>
        <ArrowLeft size={16} /> Retour au panier
      </Link>
      
      <h1 style={{ marginBottom: '2rem' }}>Finaliser la commande</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem', alignItems: 'start' }}>
        <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Informations de livraison</h2>
          {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '1rem', backgroundColor: '#ffebee', borderRadius: '8px' }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="guestName" style={{ fontWeight: '500' }}>Nom complet</label>
              <input 
                type="text" 
                id="guestName" 
                name="guestName" 
                value={formData.guestName} 
                onChange={handleInputChange} 
                required 
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-light)', fontSize: '1rem' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="guestEmail" style={{ fontWeight: '500' }}>Adresse email</label>
              <input 
                type="email" 
                id="guestEmail" 
                name="guestEmail" 
                value={formData.guestEmail} 
                onChange={handleInputChange} 
                required 
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-light)', fontSize: '1rem' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="guestPhone" style={{ fontWeight: '500' }}>Numéro de téléphone</label>
              <input 
                type="tel" 
                id="guestPhone" 
                name="guestPhone" 
                value={formData.guestPhone} 
                onChange={handleInputChange} 
                required 
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-light)', fontSize: '1rem' }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="guestLocation" style={{ fontWeight: '500' }}>Zone de livraison</label>
              <select 
                id="guestLocation" 
                name="guestLocation" 
                value={formData.guestLocation} 
                onChange={handleInputChange} 
                required 
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-light)', fontSize: '1rem', fontFamily: 'inherit', backgroundColor: 'var(--color-white)' }}
              >
                <option value="yopougon">Yopougon (1 000 FCFA)</option>
                <option value="abidjan">Abidjan - Autres communes (1 500 FCFA)</option>
                <option value="hors_abidjan">Bingerville, Port-Bouët et Hors d'Abidjan (2 000 FCFA)</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="guestAddress" style={{ fontWeight: '500' }}>Adresse détaillée</label>
              <textarea 
                id="guestAddress" 
                name="guestAddress" 
                value={formData.guestAddress} 
                onChange={handleInputChange} 
                required 
                rows="3"
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-light)', fontSize: '1rem', fontFamily: 'inherit' }}
              />
            </div>
            
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-cream)', borderRadius: '8px', marginTop: '1rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Moyen de paiement</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="radio" id="payment-delivery" name="payment" value="delivery" defaultChecked />
                <label htmlFor="payment-delivery">Paiement à la livraison</label>
              </div>
            </div>
            
            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}>
              {loading ? 'Traitement en cours...' : 'Confirmer la commande'}
            </button>
          </form>
        </div>
        
        <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', padding: '2rem', position: 'sticky', top: '100px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Récapitulatif de la commande</h3>
          
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-bg-light)' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{item.name}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Qté: {item.quantity}</div>
                  </div>
                </div>
                <div style={{ fontWeight: '500' }}>
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Sous-total</span>
            <span>{formatPrice(getCartTotal())}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-bg-light)' }}>
            <span>Frais de livraison</span>
            <span style={{ color: shippingFee === 0 ? 'var(--color-green)' : 'inherit' }}>
              {shippingFee === 0 ? 'Gratuit' : formatPrice(shippingFee)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.25rem' }}>
            <span>Total</span>
            <span>{formatPrice(getCartTotal() + shippingFee)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
