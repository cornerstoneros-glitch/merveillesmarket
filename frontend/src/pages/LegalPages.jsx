import React, { useEffect } from 'react';

const PageLayout = ({ title, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container section" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--color-green-dark)', borderBottom: '2px solid var(--color-bg-light)', paddingBottom: '1rem' }}>
        {title}
      </h1>
      <div style={{ lineHeight: '1.8', color: 'var(--color-text)', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {children}
      </div>
    </div>
  );
};

export const CGU = () => (
  <PageLayout title="Conditions Générales d'Utilisation (CGU)">
    <h2>1. Objet</h2>
    <p>Les présentes Conditions Générales d'Utilisation ont pour objet de définir les modalités de mise à disposition du site Merveilles Market et les conditions d'utilisation du service par l'Utilisateur.</p>
    
    <h2>2. Accès au site</h2>
    <p>Le site est accessible gratuitement en tout lieu à tout Utilisateur ayant un accès à Internet. Tous les frais supportés par l'Utilisateur pour accéder au service (matériel informatique, logiciels, connexion Internet, etc.) sont à sa charge.</p>

    <h2>3. Propriété intellectuelle</h2>
    <p>Les marques, logos, signes ainsi que tous les contenus du site font l'objet d'une protection par le Code de la propriété intellectuelle et plus particulièrement par le droit d'auteur.</p>

    <h2>4. Données personnelles</h2>
    <p>L'Utilisateur doit obligatoirement fournir des informations personnelles pour procéder à son inscription sur le site. L'éditeur garantit le respect de la vie privée de l'Utilisateur, conformément à la loi Informatique et Libertés et au RGPD.</p>
  </PageLayout>
);

export const CGV = () => (
  <PageLayout title="Conditions Générales de Vente (CGV)">
    <h2>1. Champ d'application</h2>
    <p>Les présentes conditions s'appliquent à toutes les ventes conclues par le biais du site Internet Merveilles Market. Tout passage de commande vaut acceptation pleine et entière des présentes CGV.</p>

    <h2>2. Prix</h2>
    <p>Les prix de nos produits sont indiqués en FCFA toutes taxes comprises, sauf indication contraire. La boutique se réserve le droit de modifier ses prix à tout moment, mais le produit sera facturé sur la base du tarif en vigueur au moment de la validation de la commande.</p>

    <h2>3. Commandes</h2>
    <p>Le client peut passer commande directement sur notre site web. Merveilles Market se réserve le droit de ne pas enregistrer un paiement, et de ne pas confirmer une commande pour quelque raison que ce soit.</p>

    <h2>4. Livraison</h2>
    <p>Les produits sont livrés à l'adresse de livraison indiquée au cours du processus de commande. Les délais de livraison ne sont donnés qu'à titre indicatif et un retard ne donne pas le droit à l'acheteur de réclamer des dommages et intérêts.</p>

    <h2>5. Rétractation</h2>
    <p>Conformément aux dispositions légales en vigueur, vous disposez d'un délai pour exercer votre droit de rétractation sans avoir à justifier de motifs ni à payer de pénalité. Les retours sont à effectuer dans leur état d'origine et complets.</p>
  </PageLayout>
);

export const MentionsLegales = () => (
  <PageLayout title="Mentions Légales">
    <h2>Éditeur du site</h2>
    <p>Le site Merveilles Market est édité par l'entreprise Merveilles Trade Market, immatriculée au registre du commerce.</p>
    
    <h2>Hébergement</h2>
    <p>Ce site est hébergé par Hostinger.<br/>
    Adresse de l'hébergeur : Hostinger International Ltd. 61 Lordou Vironos Street, 6023 Larnaca, Chypre</p>

    <h2>Contact</h2>
    <p>Vous pouvez nous contacter directement depuis la page contact de notre site Internet ou par courrier électronique.</p>

    <h2>Limitation de responsabilité</h2>
    <p>Les informations contenues sur ce site sont aussi précises que possibles et le site est périodiquement remis à jour. L'éditeur ne saurait être tenu pour responsable des erreurs, d'une absence de disponibilité des informations et/ou de la présence de virus sur son site.</p>
  </PageLayout>
);

export const Confidentialite = () => (
  <PageLayout title="Politique de Confidentialité">
    <h2>1. Collecte des informations</h2>
    <p>Nous recueillons des informations lorsque vous vous inscrivez sur notre site, lorsque vous vous connectez à votre compte, faites un achat, et/ou lorsque vous vous déconnectez. Les informations recueillies incluent votre nom, votre adresse e-mail, numéro de téléphone, et adresse de livraison.</p>

    <h2>2. Utilisation des informations</h2>
    <p>Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour personnaliser votre expérience, répondre à vos besoins individuels, fournir un contenu publicitaire personnalisé, améliorer notre site, améliorer le service client et vos besoins de prise en charge, vous contacter par e-mail ou gérer une commande.</p>

    <h2>3. Confidentialité du commerce en ligne</h2>
    <p>Nous sommes les seuls propriétaires des informations recueillies sur ce site. Vos informations personnelles ne seront pas vendues, échangées, transférées, ou données à une autre société pour n'importe quelle raison, sans votre consentement, en dehors de ce qui est nécessaire pour répondre à une demande et/ou une transaction, comme par exemple pour expédier une commande.</p>

    <h2>4. Protection des informations</h2>
    <p>Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Les ordinateurs et serveurs utilisés pour stocker des informations personnelles identifiables sont conservés dans un environnement sécurisé.</p>
  </PageLayout>
);

export const PolitiqueCookies = () => (
  <PageLayout title="Politique des Cookies">
    <h2>Qu'est-ce qu'un cookie ?</h2>
    <p>Un cookie est un petit fichier texte déposé sur votre ordinateur, tablette ou smartphone lors de la visite d'un site ou de la consultation d'une publicité. Il a pour but de collecter des informations relatives à votre navigation et de vous adresser des services et contenus adaptés.</p>

    <h2>Utilisation des cookies</h2>
    <p>Merveilles Market utilise des cookies pour analyser la fréquentation de nos pages, comprendre le parcours de navigation de nos utilisateurs afin de toujours améliorer l'expérience sur notre site. Ils nous permettent également de mémoriser vos préférences (panier, compte client).</p>

    <h2>Gérer vos préférences</h2>
    <p>Vous pouvez à tout moment choisir de désactiver ces cookies. Votre navigateur peut également être paramétré pour vous signaler les cookies qui sont déposés dans votre ordinateur et vous demander de les accepter ou non.</p>
    <p>Nous rappelons que le paramétrage est susceptible de modifier vos conditions d'accès à nos services nécessitant l'utilisation de cookies.</p>
  </PageLayout>
);
