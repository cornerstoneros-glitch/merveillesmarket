import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqData = [
  {
    question: "Comment puis-je passer une commande ?",
    answer: "Pour passer une commande, parcourez nos univers (Abbeys ou Josy), ajoutez les produits souhaités à votre panier, puis rendez-vous sur la page panier pour procéder au paiement. Remplissez simplement vos informations de livraison et confirmez votre commande."
  },
  {
    question: "Quels sont les délais de livraison ?",
    answer: "Les livraisons à Abidjan sont généralement effectuées dans un délai de 24 à 48 heures. Pour les expéditions vers l'intérieur du pays, comptez entre 3 à 5 jours ouvrables."
  },
  {
    question: "Quels sont les modes de paiement acceptés ?",
    answer: "Nous acceptons actuellement le paiement à la livraison (en espèces) ainsi que les paiements par Mobile Money (Orange, MTN, Moov, Wave) à la réception de votre commande."
  },
  {
    question: "Puis-je retourner un produit s'il ne me convient pas ?",
    answer: "Oui, vous disposez d'un délai de 7 jours après réception pour retourner un produit non utilisé et dans son emballage d'origine. Veuillez consulter notre politique de retours pour plus de détails."
  },
  {
    question: "Les produits Merveilles Abbeys sont-ils 100% naturels ?",
    answer: "Absolument. Tous nos traitements et produits issus de l'univers Merveilles Abbeys sont confectionnés à partir de plantes médicinales locales et d'ingrédients 100% naturels, sans additifs chimiques."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container section" style={{ minHeight: '60vh', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '1rem', textAlign: 'center' }}>Foire Aux Questions</h1>
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
        Retrouvez ici les réponses aux questions les plus fréquemment posées par nos clients.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {faqData.map((item, index) => (
          <div key={index} style={{ backgroundColor: 'var(--color-white)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-bg-light)' }}>
            <button 
              onClick={() => toggleQuestion(index)}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: '600', fontSize: '1.1rem', color: 'var(--color-text)' }}
            >
              {item.question}
              {openIndex === index ? <ChevronUp size={20} color="var(--color-gold)" /> : <ChevronDown size={20} color="var(--color-text-muted)" />}
            </button>
            
            {openIndex === index && (
              <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
