import React, { useState, useEffect } from 'react';
import { fetchOrders, updateOrderStatus } from '../../api';
import { Package, RefreshCw } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    loadOrders();
  }, [token]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchOrders(token);
      setOrders(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus, token);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      alert("Erreur: " + err.message);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return { bg: '#fff7ed', text: '#c2410c', label: 'En attente' };
      case 'PAID': return { bg: '#f0fdf4', text: '#15803d', label: 'Payée' };
      case 'SHIPPED': return { bg: '#eff6ff', text: '#1d4ed8', label: 'Expédiée' };
      case 'DELIVERED': return { bg: '#fdf4ff', text: '#a21caf', label: 'Livrée' };
      default: return { bg: '#f3f4f6', text: '#374151', label: status };
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Commandes</h1>
        <button onClick={loadOrders} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <RefreshCw size={16} /> Actualiser
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-bg-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Package size={20} /> <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Liste des commandes</h2>
        </div>

        {error && <div style={{ padding: '1rem', color: '#b91c1c', backgroundColor: '#fee2e2' }}>{error}</div>}

        {isLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Chargement...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Aucune commande.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg-light)', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>ID / Date</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Client</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Articles</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Total</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Statut</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const statusColors = getStatusColor(order.status);
                  const items = JSON.parse(order.items || '[]');
                  
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ fontWeight: '500' }}>#{order.id}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ fontWeight: '500' }}>{order.guestName}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{order.guestPhone}</div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem' }}>
                        {items.length} article(s)
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>
                        <div>{order.total.toLocaleString()} FCFA</div>
                        {order.shippingFee > 0 && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>
                            dont livraison: {order.shippingFee.toLocaleString()} FCFA
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ backgroundColor: statusColors.bg, color: statusColors.text, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '500' }}>
                          {statusColors.label}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--color-bg-light)', fontSize: '0.85rem', cursor: 'pointer' }}
                        >
                          <option value="PENDING">En attente</option>
                          <option value="PAID">Payée</option>
                          <option value="SHIPPED">Expédiée</option>
                          <option value="DELIVERED">Livrée</option>
                        </select>
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
  );
};

export default AdminOrders;
