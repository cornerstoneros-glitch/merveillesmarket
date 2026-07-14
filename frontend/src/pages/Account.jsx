import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Package, User, Calendar, LogOut } from 'lucide-react';
import { formatPrice } from '../api';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

const Account = () => {
  const { user, token, loading, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error("API Error:", data);
          setOrders([]);
        }
        setLoadingOrders(false);
      })
      .catch(err => {
        console.error("Erreur de récupération des commandes", err);
        setLoadingOrders(false);
      });
    }
  }, [token]);

  if (loading) return <div className="container section" style={{ textAlign: 'center' }}>Chargement...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: '#f59e0b', bg: '#fef3c7', text: 'En attente' },
      PAID: { color: '#3b82f6', bg: '#dbeafe', text: 'Payée' },
      SHIPPED: { color: '#8b5cf6', bg: '#ede9fe', text: 'Expédiée' },
      DELIVERED: { color: '#10b981', bg: '#d1fae5', text: 'Livrée' }
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span style={{ 
        backgroundColor: config.bg, color: config.color, 
        padding: '0.25rem 0.75rem', borderRadius: '9999px', 
        fontSize: '0.85rem', fontWeight: '500' 
      }}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="container section" style={{ minHeight: '70vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Mon Compte Premium</h1>
        <button 
          onClick={logout} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Profile Card */}
        <div style={{ backgroundColor: 'var(--color-white)', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{user.name || 'Client'}</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Membre Premium</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text)' }}>
              <User size={18} style={{ color: 'var(--color-text-muted)' }} />
              <span>{user.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text)' }}>
              <Calendar size={18} style={{ color: 'var(--color-text-muted)' }} />
              <span>Inscrit récemment</span>
            </div>
          </div>
        </div>

        {/* Orders History */}
        <div style={{ backgroundColor: 'var(--color-white)', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Package size={24} style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: '1.5rem' }}>Historique des commandes</h2>
          </div>

          {loadingOrders ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Chargement de vos commandes...</p>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-muted)' }}>
              <Package size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
              <p>Vous n'avez pas encore passé de commande.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map(order => {
                const items = JSON.parse(order.items);
                return (
                  <div key={order.id} style={{ border: '1px solid var(--color-bg-light)', borderRadius: '12px', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--color-bg-light)', paddingBottom: '1rem' }}>
                      <div>
                        <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Commande #{order.id}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                      {items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                          <span>{item.quantity}x {item.name}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '600', fontSize: '1.1rem', paddingTop: '1rem', borderTop: '1px dotted var(--color-bg-light)' }}>
                      <span>Total TTC</span>
                      <span style={{ color: 'var(--color-primary)' }}>{formatPrice(order.total + order.shippingFee)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
