import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, LogOut, Settings } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('adminToken');
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Tableau de bord' },
    { path: '/admin/orders', icon: <ShoppingCart size={20} />, label: 'Commandes' },
    { path: '/admin/products', icon: <Package size={20} />, label: 'Produits' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Paramètres' },
  ];

  if (!token) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: 'var(--color-green-dark)', color: 'var(--color-white)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.25rem', color: 'var(--color-gold)' }}>Merveilles Admin</h2>
          <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Centre de gestion</p>
        </div>
        
        <nav style={{ flex: 1, padding: '1.5rem 0' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem', 
                      padding: '0.75rem 1rem', 
                      borderRadius: '8px',
                      color: isActive ? 'var(--color-gold)' : 'var(--color-white)',
                      backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                      transition: 'all 0.2s',
                      opacity: isActive ? 1 : 0.8
                    }}
                  >
                    {item.icon}
                    <span style={{ fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-green-dark)', fontWeight: 'bold' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{user.name || 'Admin'}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{user.email}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', backgroundColor: 'rgba(255,0,0,0.1)', color: '#fca5a5', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
