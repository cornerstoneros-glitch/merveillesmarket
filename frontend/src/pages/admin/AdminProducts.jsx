import React, { useState, useEffect } from 'react';
import { fetchProducts, deleteProduct } from '../../api';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import ProductForm from './ProductForm';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const token = localStorage.getItem('adminToken');

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      try {
        await deleteProduct(id, token);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleFormClose = (needsRefresh) => {
    setIsFormOpen(false);
    if (needsRefresh) {
      loadProducts();
    }
  };

  if (isFormOpen) {
    return <ProductForm product={editingProduct} onClose={handleFormClose} token={token} />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Catalogue Produits</h1>
        <button onClick={handleAddNew} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
          <Plus size={18} /> Ajouter un produit
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        {isLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Chargement...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg-light)', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Produit</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Univers</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Prix</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Tags</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                    <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                      <span style={{ fontWeight: '500' }}>{product.name}</span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ backgroundColor: product.universe === 'abbeys' ? '#dcfce7' : '#fef9c3', color: product.universe === 'abbeys' ? '#166534' : '#854d0e', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                        {product.universe}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>
                      {product.price.toLocaleString()} FCFA
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {product.isNew && <span style={{ marginRight: '0.5rem', color: '#2563eb', fontSize: '0.85rem' }}>Nouveau</span>}
                      {product.promo && <span style={{ color: '#ea580c', fontSize: '0.85rem' }}>Promo</span>}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <button onClick={() => handleEdit(product)} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', marginRight: '1rem' }} title="Modifier">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Supprimer">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
