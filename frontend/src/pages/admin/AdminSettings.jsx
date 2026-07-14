import React, { useState, useEffect } from 'react';
import { fetchSettings, updateSetting } from '../../api';
import { Save } from 'lucide-react';

const AdminSettings = () => {
  const [shippingFee, setShippingFee] = useState('0');
  const [tickerText, setTickerText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await fetchSettings();
        if (settings) {
          if (settings.shippingFee !== undefined) setShippingFee(settings.shippingFee);
          if (settings.tickerText !== undefined) setTickerText(settings.tickerText);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des paramètres:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    
    try {
      await updateSetting('shippingFee', shippingFee, token);
      await updateSetting('tickerText', tickerText, token);
      setMessage({ type: 'success', text: 'Paramètres mis à jour avec succès.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour des paramètres.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Chargement des paramètres...</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Paramètres de la boutique</h1>
      
      {message && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '2rem', 
          borderRadius: '8px', 
          backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: message.type === 'success' ? '#166534' : '#991b1b'
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid var(--color-bg-light)', paddingBottom: '1rem' }}>
            Livraison & Expédition
          </h2>
          
          <form id="settingsForm" onSubmit={handleSave}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="shippingFee" style={{ fontWeight: '500' }}>Frais de livraison par défaut (FCFA)</label>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                  Ce montant sera ajouté au total de chaque commande passée par les clients. 
                  Saisissez "0" pour offrir la livraison gratuite.
                </p>
                <input 
                  type="number" 
                  id="shippingFee" 
                  value={shippingFee} 
                  onChange={(e) => setShippingFee(e.target.value)} 
                  min="0"
                  step="100"
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-light)', fontSize: '1rem' }}
                  required
                />
              </div>
            </div>
          </form>
        </div>

        <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid var(--color-bg-light)', paddingBottom: '1rem' }}>
            Communication & Affichage
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="tickerText" style={{ fontWeight: '500' }}>Texte défilant (Nouveautés)</label>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                Ce texte s'affichera en bas du site (au-dessus du pied de page) pour informer vos clients des nouveautés ou des promotions en cours. Laissez vide pour le masquer.
              </p>
              <input 
                type="text" 
                id="tickerText" 
                value={tickerText} 
                onChange={(e) => setTickerText(e.target.value)} 
                placeholder="Ex: Nouveauté : Découvrez notre gamme de miel naturel !"
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-light)', fontSize: '1rem', width: '100%' }}
              />
            </div>
          </div>
        </div>

        <button 
          form="settingsForm"
          type="submit" 
          className="btn-primary" 
          disabled={isSaving}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', maxWidth: '300px' }}
        >
          <Save size={18} />
          {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
