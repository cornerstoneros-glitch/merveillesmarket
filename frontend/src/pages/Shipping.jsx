import React from 'react';
import { Truck, RotateCcw, Clock, ShieldCheck } from 'lucide-react';

const Shipping = () => {
  return (
    <div className="container section" style={{ minHeight: '70vh' }}>
      <h1 style={{ marginBottom: '1rem', textAlign: 'center' }}>Livraison & Retours</h1>
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
        Nous mettons tout en œuvre pour vous offrir un service de livraison rapide et fiable, ainsi qu'une politique de retour transparente et sans tracas.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div style={{ backgroundColor: 'var(--color-white)', padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-gold-tint)', color: 'var(--color-gold)', marginBottom: '1.5rem' }}>
            <Truck size={32} />
          </div>
          <h3 style={{ marginBottom: '1rem' }}>Livraison Rapide</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Livraison en 24h à 48h sur Abidjan et expédition dans tout le pays.</p>
        </div>
        
        <div style={{ backgroundColor: 'var(--color-white)', padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-green-tint)', color: 'var(--color-green-dark)', marginBottom: '1.5rem' }}>
            <RotateCcw size={32} />
          </div>
          <h3 style={{ marginBottom: '1rem' }}>Retours Faciles</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Vous disposez de 7 jours pour retourner un article qui ne vous convient pas.</p>
        </div>
        
        <div style={{ backgroundColor: 'var(--color-white)', padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e3f2fd', color: '#1976d2', marginBottom: '1.5rem' }}>
            <ShieldCheck size={32} />
          </div>
          <h3 style={{ marginBottom: '1rem' }}>Colis Sécurisés</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Vos commandes sont emballées avec soin pour garantir leur intégrité.</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--color-white)', padding: '3rem', borderRadius: '16px' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Conditions de Livraison</h2>
          <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1rem' }}>Les frais de livraison varient en fonction de votre localisation et du poids total de votre commande. Le montant exact sera calculé au moment de la confirmation de votre commande avec notre service client.</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Abidjan :</strong> Livraison à domicile ou en point relais. Délai moyen de 24h à 48h.</li>
              <li><strong>Intérieur du pays :</strong> Expédition par compagnie de transport. Les frais d'expédition sont à la charge du client. Délai de 3 à 5 jours.</li>
            </ul>
            <p>Dès l'expédition de votre commande, vous recevrez une notification par SMS ou email.</p>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Politique de Retours et Remboursements</h2>
          <div style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1rem' }}>Si vous n'êtes pas entièrement satisfait de votre achat, nous sommes là pour vous aider. Vous avez <strong>7 jours calendaires</strong> pour retourner un article à partir de la date à laquelle vous l'avez reçu.</p>
            <p style={{ marginBottom: '1rem' }}>Pour être admissible à un retour, votre article doit être :</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Inutilisé et dans le même état que vous l'avez reçu.</li>
              <li>Dans son emballage d'origine.</li>
              <li>Accompagné du reçu ou d'une preuve d'achat.</li>
            </ul>
            <p><em>Note : Les produits cosmétiques, sous-vêtements et denrées périssables (produits Abbeys descellés) ne sont ni repris ni échangés pour des raisons d'hygiène et de sécurité.</em></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
