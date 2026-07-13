import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="container section" style={{ minHeight: '70vh' }}>
      <h1 style={{ marginBottom: '1rem', textAlign: 'center' }}>Contactez-nous</h1>
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
        Vous avez une question, une suggestion ou besoin d'aide avec votre commande ? N'hésitez pas à nous contacter, notre équipe se fera un plaisir de vous répondre.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        <div style={{ backgroundColor: 'var(--color-white)', padding: '2rem', borderRadius: '16px' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Nos Coordonnées</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--color-green-tint)', padding: '1rem', borderRadius: '50%', color: 'var(--color-green-dark)' }}>
                <Phone size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Téléphone</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>+225 07 01 92 95 98</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Lundi au Samedi: 8h00 - 18h00</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--color-gold-tint)', padding: '1rem', borderRadius: '50%', color: 'var(--color-gold)' }}>
                <Mail size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Email</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>contact@merveillestrademarket.com</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Réponse sous 24h</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ backgroundColor: 'var(--color-bg-light)', padding: '1rem', borderRadius: '50%', color: 'var(--color-text)' }}>
                <MapPin size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Adresse</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Abidjan, Côte d'Ivoire</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--color-white)', padding: '2rem', borderRadius: '16px' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Envoyez-nous un message</h2>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="name" style={{ fontWeight: '500' }}>Votre nom</label>
              <input type="text" id="name" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-light)', fontSize: '1rem' }} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="email" style={{ fontWeight: '500' }}>Votre email</label>
              <input type="email" id="email" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-light)', fontSize: '1rem' }} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="message" style={{ fontWeight: '500' }}>Votre message</label>
              <textarea id="message" rows="5" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-bg-light)', fontSize: '1rem', fontFamily: 'inherit' }} required></textarea>
            </div>
            <button type="button" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Send size={18} /> Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
