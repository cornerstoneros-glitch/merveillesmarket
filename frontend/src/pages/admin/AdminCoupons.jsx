import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchCoupons, createCoupon, deleteCoupon, formatPrice } from '../../api';
import { Tag, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';

const AdminCoupons = () => {
  const { token } = useContext(AuthContext);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('');
  const [usageLimit, setUsageLimit] = useState('');

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await fetchCoupons(token);
      setCoupons(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des bons de réduction');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadCoupons();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || !discountValue) return;

    try {
      await createCoupon({
        code,
        discountType,
        discountValue,
        usageLimit: usageLimit ? parseInt(usageLimit) : null
      }, token);
      
      // Reset form
      setCode('');
      setDiscountValue('');
      setUsageLimit('');
      
      // Reload
      loadCoupons();
    } catch (err) {
      setError(err.message || 'Erreur lors de la création');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce code promo ?')) {
      try {
        await deleteCoupon(id, token);
        loadCoupons();
      } catch (err) {
        setError(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  if (loading && coupons.length === 0) return <div>Chargement des bons de réduction...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Tag size={28} style={{ color: 'var(--color-primary)' }} />
          Bons de Réduction
        </h1>
      </div>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Formulaire de création */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} /> Créer un code
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Code Promo (ex: PROMO10)</label>
              <input 
                type="text" 
                value={code} 
                onChange={(e) => setCode(e.target.value.toUpperCase())} 
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-bg-light)', borderRadius: '8px', textTransform: 'uppercase' }}
                placeholder="BENVENUE2026"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Type de réduction</label>
              <select 
                value={discountType} 
                onChange={(e) => setDiscountType(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-bg-light)', borderRadius: '8px' }}
              >
                <option value="PERCENTAGE">Pourcentage (%)</option>
                <option value="FIXED">Montant Fixe (FCFA)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                Valeur de la réduction {discountType === 'PERCENTAGE' ? '(%)' : '(FCFA)'}
              </label>
              <input 
                type="number" 
                min="1" 
                max={discountType === 'PERCENTAGE' ? "100" : undefined}
                value={discountValue} 
                onChange={(e) => setDiscountValue(e.target.value)} 
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-bg-light)', borderRadius: '8px' }}
                placeholder={discountType === 'PERCENTAGE' ? "10" : "2000"}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Limite d'utilisations (optionnel)</label>
              <input 
                type="number" 
                min="1" 
                value={usageLimit} 
                onChange={(e) => setUsageLimit(e.target.value)} 
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-bg-light)', borderRadius: '8px' }}
                placeholder="Laissez vide pour illimité"
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '0.75rem' }}>
              Ajouter le code promo
            </button>
          </form>
        </div>

        {/* Liste des codes */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Codes actifs et expirés</h2>
          
          {coupons.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem 0' }}>Aucun code promo créé pour le moment.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-bg-light)', textAlign: 'left' }}>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Code</th>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Réduction</th>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Utilisations</th>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Statut</th>
                    <th style={{ padding: '1rem 0.5rem', color: 'var(--color-text-muted)', fontWeight: '500', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => {
                    const isExhausted = coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit;
                    return (
                      <tr key={coupon.id} style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                        <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>{coupon.code}</td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <span style={{ backgroundColor: 'var(--color-green-tint)', color: 'var(--color-green-dark)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600' }}>
                            {coupon.discountType === 'PERCENTAGE' ? `-${coupon.discountValue}%` : `-${formatPrice(coupon.discountValue)}`}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.5rem', fontSize: '0.9rem' }}>
                          {coupon.usageCount} / {coupon.usageLimit || '∞'}
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          {coupon.isActive && !isExhausted ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.85rem', fontWeight: '500' }}>
                              <CheckCircle size={14} /> Actif
                            </span>
                          ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#b91c1c', fontSize: '0.85rem', fontWeight: '500' }}>
                              <XCircle size={14} /> {isExhausted ? 'Épuisé' : 'Inactif'}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                          <button 
                            onClick={() => handleDelete(coupon.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminCoupons;
