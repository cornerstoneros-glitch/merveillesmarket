import React, { useState, useEffect } from 'react';
import { fetchOrders, fetchProducts } from '../../api';
import { ShoppingBag, Package, DollarSign, Activity } from 'lucide-react';

const AdminStats = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [ordersData, productsData] = await Promise.all([
          fetchOrders(token),
          fetchProducts() // Public route for now
        ]);
        setOrders(ordersData);
        setProducts(productsData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [token]);

  if (isLoading) return <div>Chargement des statistiques...</div>;

  const totalRevenue = orders
    .filter(o => o.status !== 'PENDING')
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Vue d'ensemble</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        
        <div style={{ backgroundColor: 'var(--color-white)', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '50%', color: '#16a34a' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Chiffre d'affaires</p>
            <h2 style={{ fontSize: '1.5rem' }}>{totalRevenue.toLocaleString()} FCFA</h2>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-white)', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ backgroundColor: 'var(--color-gold-tint)', padding: '1rem', borderRadius: '50%', color: 'var(--color-gold)' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Total Commandes</p>
            <h2 style={{ fontSize: '1.5rem' }}>{orders.length}</h2>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-white)', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ backgroundColor: '#fff7ed', padding: '1rem', borderRadius: '50%', color: '#ea580c' }}>
            <Activity size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>En attente</p>
            <h2 style={{ fontSize: '1.5rem' }}>{pendingOrders}</h2>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-white)', padding: '1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '50%', color: '#2563eb' }}>
            <Package size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Produits en catalogue</p>
            <h2 style={{ fontSize: '1.5rem' }}>{products.length}</h2>
          </div>
        </div>

      </div>

      <div style={{ backgroundColor: 'var(--color-white)', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Activité récente</h2>
        {orders.slice(0, 5).map(order => (
          <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--color-bg-light)' }}>
            <div>
              <p style={{ fontWeight: '500' }}>Commande #{order.id} - {order.guestName}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div style={{ fontWeight: '600' }}>{order.total.toLocaleString()} FCFA</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStats;
