import React, { useState } from 'react';
import { createProduct, updateProduct } from '../../api';
import { ArrowLeft, Save } from 'lucide-react';

const ProductForm = ({ product, onClose, token }) => {
  const isEditing = !!product;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    category: product?.category || 'Soin',
    universe: product?.universe || 'abbeys',
    image: product?.image || '/images/products/placeholder.png',
    description: product?.description || '',
    warnings: product?.warnings || '',
    isNew: product?.isNew || false,
    promo: product?.promo || false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await updateProduct(product.id, formData, token);
      } else {
        await createProduct(formData, token);
      }
      onClose(true); // true to indicate refresh needed
    } catch (err) {
      alert("Erreur lors de l'enregistrement : " + err.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => onClose(false)} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <ArrowLeft size={16} /> Retour
        </button>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>
          {isEditing ? 'Modifier le produit' : 'Ajouter un produit'}
        </h1>
      </div>

      <div style={{ backgroundColor: 'var(--color-white)', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
            <label style={{ fontWeight: '500' }}>Nom du produit</label>
            <input name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '500' }}>Prix (FCFA)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '500' }}>Univers</label>
            <select name="universe" value={formData.universe} onChange={handleChange} style={inputStyle}>
              <option value="abbeys">Merveilles Abbeys</option>
              <option value="josy">Josy Market</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '500' }}>Catégorie</label>
            <input name="category" value={formData.category} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '500' }}>Lien de l'image (URL)</label>
            <input name="image" value={formData.image} onChange={handleChange} placeholder="/images/products/votre-image.png" style={inputStyle} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
            <label style={{ fontWeight: '500' }}>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required style={{...inputStyle, resize: 'vertical'}} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
            <label style={{ fontWeight: '500' }}>Avertissements (Optionnel)</label>
            <textarea name="warnings" value={formData.warnings} onChange={handleChange} rows="2" style={{...inputStyle, resize: 'vertical'}} />
          </div>

          <div style={{ display: 'flex', gap: '2rem', gridColumn: '1 / -1', marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} />
              Nouveauté
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" name="promo" checked={formData.promo} onChange={handleChange} />
              En Promotion
            </label>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '2rem', borderTop: '1px solid var(--color-bg-light)', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={isLoading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem' }}>
              <Save size={18} /> {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid var(--color-bg-light)',
  fontSize: '1rem',
  fontFamily: 'inherit'
};

export default ProductForm;
