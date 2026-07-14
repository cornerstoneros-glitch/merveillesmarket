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
    image: product?.image || '',
    images: product?.images || [],
    description: product?.description || '',
    warnings: product?.warnings || '',
    stock: product?.stock || 0,
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

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append('images', files[i]);
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (!res.ok) throw new Error("Erreur lors de l'upload");
      
      const result = await res.json();
      
      // Mettre à jour l'état
      setFormData(prev => {
        const newImages = [...prev.images, ...result.urls];
        return {
          ...prev,
          images: newImages,
          image: prev.image || result.urls[0] // Définir comme principale si vide
        };
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const setMainImage = (url) => {
    setFormData({ ...formData, image: url });
  };

  const removeImage = (url) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== url),
      image: prev.image === url ? (prev.images.find(img => img !== url) || '') : prev.image
    }));
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
            <label style={{ fontWeight: '500' }}>Stock</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" style={inputStyle} />
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
            <label style={{ fontWeight: '500' }}>Images du produit (La première sera l'image principale)</label>
            <input type="file" multiple accept="image/*" onChange={handleFileUpload} disabled={isLoading} style={inputStyle} />
            
            {formData.images && formData.images.length > 0 && (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {formData.images.map((url, index) => (
                  <div key={index} style={{ position: 'relative', border: formData.image === url ? '3px solid var(--color-primary)' : '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={url} alt={`Preview ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0.25rem', backgroundColor: 'rgba(0,0,0,0.4)', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0}>
                      <button type="button" onClick={() => removeImage(url)} style={{ alignSelf: 'flex-end', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '0.2rem 0.4rem', fontSize: '0.8rem' }}>X</button>
                      {formData.image !== url && (
                        <button type="button" onClick={() => setMainImage(url)} style={{ background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '0.2rem', fontSize: '0.7rem' }}>Principale</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
