import React, { useState, useEffect } from 'react';
import { Mail, Send, Users, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { fetchNewsletterSubscribers, sendNewsletter } from '../../api';

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [notification, setNotification] = useState(null);

  const token = localStorage.getItem('token');

  const loadSubscribers = async () => {
    try {
      const data = await fetchNewsletterSubscribers(token);
      setSubscribers(data);
    } catch (err) {
      console.error('Erreur chargement abonnés:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleSendCampaign = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;

    if (!window.confirm(`Confirmez-vous l'envoi de cette newsletter à ${subscribers.length} abonné(s) depuis contact@merveillesmarket.net ?`)) {
      return;
    }

    setSending(true);
    setNotification(null);

    try {
      // Conversion des sauts de ligne en paragraphes HTML simples
      const formattedHtml = content
        .split('\n\n')
        .map(p => `<p style="margin-bottom: 15px; font-size: 15px;">${p.replace(/\n/g, '<br/>')}</p>`)
        .join('');

      const res = await sendNewsletter({
        subject,
        htmlContent: formattedHtml
      }, token);

      setNotification({
        type: 'success',
        text: `Campagne expédiée avec succès depuis contact@merveillesmarket.net (${res.sentCount || subscribers.length} abonnés notifiés).`
      });

      setSubject('');
      setContent('');
    } catch (err) {
      setNotification({
        type: 'error',
        text: err.message || 'Erreur lors de l\'envoi de la newsletter.'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Gestion des Newsletters</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Les emails de newsletters sont expédiés automatiquement depuis <strong style={{ color: 'var(--color-green-dark)' }}>contact@merveillesmarket.net</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ backgroundColor: 'var(--color-white)', padding: '0.75rem 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Users size={20} color="var(--color-green-dark)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Total Abonnés</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{subscribers.length}</div>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: notification.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: notification.type === 'success' ? '#166534' : '#991b1b',
          border: `1px solid ${notification.type === 'success' ? '#bbf7d0' : '#fecaca'}`
        }}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{notification.text}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {/* Formulaire d'envoi */}
        <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send size={20} color="var(--color-green-dark)" />
            Composer une Newsletter
          </h2>

          <form onSubmit={handleSendCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ padding: '0.75rem 1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Expéditeur (From) : </span>
              <strong>Merveilles Market &lt;contact@merveillesmarket.net&gt;</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="nlSubject" style={{ fontWeight: '500' }}>Sujet du message</label>
              <input
                type="text"
                id="nlSubject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Nouveaux arrivages & promotions de la semaine !"
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-light)', fontSize: '1rem' }}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="nlContent" style={{ fontWeight: '500' }}>Message</label>
              <textarea
                id="nlContent"
                rows="8"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Rédigez ici le contenu de votre newsletter..."
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-light)', fontSize: '1rem', fontFamily: 'inherit' }}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Astuce : Vous pouvez séparer vos paragraphes par une ligne vide.
              </span>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={sending || subscribers.length === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.85rem',
                fontSize: '1rem',
                opacity: (sending || subscribers.length === 0) ? 0.6 : 1
              }}
            >
              <Mail size={18} />
              {sending ? 'Expédition en cours...' : `Envoyer à tous (${subscribers.length} abonnés)`}
            </button>
          </form>
        </div>

        {/* Liste des abonnés */}
        <div style={{ backgroundColor: 'var(--color-white)', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="var(--color-green-dark)" />
            Abonnés actifs ({subscribers.length})
          </h2>

          {loading ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>Chargement des abonnés...</p>
          ) : subscribers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
              <Mail size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p>Aucun abonné pour le moment.</p>
              <p style={{ fontSize: '0.85rem' }}>Les personnes s'inscrivant via le formulaire de bienvenue apparaîtront ici.</p>
            </div>
          ) : (
            <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-bg-light)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Email</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub.id || sub.email} style={{ borderBottom: '1px solid var(--color-bg-light)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: '500' }}>
                        {sub.email}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} />
                          {new Date(sub.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletter;
