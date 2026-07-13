import React from 'react';

const Terms = () => {
  return (
    <div className="container section" style={{ minHeight: '70vh', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Conditions Générales de Vente</h1>
      
      <div style={{ backgroundColor: 'var(--color-white)', padding: '3rem', borderRadius: '16px', color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
        
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1rem' }}>1. Objet</h2>
        <p style={{ marginBottom: '2rem' }}>
          Les présentes conditions régissent les ventes par Merveilles Trade Market (comprenant les univers Merveilles Abbeys et Josy Market) de produits naturels, vêtements et électroménagers via la plateforme e-commerce.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1rem' }}>2. Prix</h2>
        <p style={{ marginBottom: '2rem' }}>
          Les prix de nos produits sont indiqués en Francs CFA (XOF) toutes taxes comprises (TTC), sauf indication contraire et hors frais de traitement et d'expédition. Merveilles Trade Market se réserve le droit de modifier ses prix à tout moment.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1rem' }}>3. Commandes</h2>
        <p style={{ marginBottom: '2rem' }}>
          Vous pouvez passer commande sur notre site internet. Les informations contractuelles sont présentées en langue française et feront l'objet d'une confirmation au plus tard au moment de la validation de votre commande.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1rem' }}>4. Validation</h2>
        <p style={{ marginBottom: '2rem' }}>
          Vous déclarez avoir pris connaissance et accepté les présentes Conditions Générales de Vente avant la passation de votre commande. La validation de votre commande vaut donc acceptation de ces Conditions Générales de Vente.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1rem' }}>5. Paiement</h2>
        <p style={{ marginBottom: '2rem' }}>
          Le règlement de vos achats s'effectue soit par paiement à la livraison en espèces, soit par Mobile Money. Dans le cas du Mobile Money, le paiement est exigé à la réception de la marchandise.
        </p>

        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1rem' }}>6. Responsabilité</h2>
        <p style={{ marginBottom: '2rem' }}>
          Les produits proposés sont conformes à la législation ivoirienne en vigueur. En ce qui concerne les produits Merveilles Abbeys, ils sont des remèdes traditionnels. En cas de doute sur l'utilisation d'un traitement naturel, nous vous recommandons de consulter un professionnel de santé.
        </p>
        
        <p style={{ marginTop: '3rem', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center' }}>
          Dernière mise à jour : 13 Juillet 2026
        </p>
      </div>
    </div>
  );
};

export default Terms;
