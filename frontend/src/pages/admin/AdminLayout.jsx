import React, { useEffect, useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, LogOut, Settings, Tag, Mail, Menu, X, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, loading, logout } = useContext(AuthContext);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!token || user?.role !== 'ADMIN') {
        navigate('/login');
      }
    }
  }, [token, user, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Tableau de bord' },
    { path: '/admin/orders', icon: <ShoppingCart size={20} />, label: 'Commandes' },
    { path: '/admin/products', icon: <Package size={20} />, label: 'Produits' },
    { path: '/admin/coupons', icon: <Tag size={20} />, label: 'Coupons' },
    { path: '/admin/newsletter', icon: <Mail size={20} />, label: 'Newsletter' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Paramètres' },
  ];

  if (!token) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Mobile Header Bar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0.75rem 1rem', 
        backgroundColor: 'var(--color-green-dark)', 
        color: 'white' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            aria-label="Menu Admin"
          >
            {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span style={{ fontWeight: '700', color: 'var(--color-gold)', fontSize: '1.1rem' }}>Merveilles Admin</span>
        </div>
        <Link to="/" style={{ color: 'var(--color-white)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', opacity: 0.9 }}>
          <ArrowLeft size={16} /> Voir le site
        </Link>
      </div>

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Sidebar */}
        <aside style={{ 
          width: '250px', 
          backgroundColor: 'var(--color-green-dark)', 
          color: 'var(--color-white)', 
          display: 'flex', 
          flexDirection: 'column',
          position: window.innerWidth <= 768 ? 'absolute' : 'relative',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          minHeight: '100%',
          transform: window.innerWidth <= 768 && !mobileNavOpen ? 'translateX(-100%)' : 'none',
          transition: 'transform 0.3s ease'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.25rem', color: 'var(--color-gold)' }}>Centre de gestion</h2>
            <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Boutique & Commandes</p>
          </div>
          
          <nav style={{ flex: 1, padding: '1rem 0' }}>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: '0 0.75rem' }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link 
                      to={item.path}
                      onClick={() => setMobileNavOpen(false)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        padding: '0.65rem 0.85rem', 
                        borderRadius: '8px',
                        color: isActive ? 'var(--color-gold)' : 'var(--color-white)',
                        backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                        transition: 'all 0.2s',
                        opacity: isActive ? 1 : 0.85,
                        fontSize: '0.9rem'
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

          <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-green-dark)', fontWeight: 'bold' }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{user?.name || 'Admin'}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{user?.email}</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.6rem', backgroundColor: 'rgba(255,0,0,0.15)', color: '#fca5a5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}
            >
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </aside>

        {/* Overlay mobile pour fermer le menu au clic extérieur */}
        {mobileNavOpen && (
          <div 
            onClick={() => setMobileNavOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              zIndex: 90
            }}
          />
        )}

        {/* Main Content */}
        <main style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
