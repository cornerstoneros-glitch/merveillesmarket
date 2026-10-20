import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Configuration des adresses de référence
export const ORDER_NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || 'commandes@merveillesmarket.net';
export const ORDER_FROM_EMAIL = process.env.ORDER_FROM_EMAIL || '"Merveilles Market Commandes" <commandes@merveillesmarket.net>';
export const NEWSLETTER_FROM_EMAIL = process.env.NEWSLETTER_FROM_EMAIL || '"Merveilles Market" <no_reply@merveillesmarket.net>';
export const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contact@merveillesmarket.net';

// Création du transporteur Nodemailer
// Supprime les guillemets parasites si les valeurs .env ont été copiées avec guillemets
const stripQuotes = (val) => (val ? val.replace(/^["']|["']$/g, '').trim() : val);

const createTransporter = () => {
  const host = stripQuotes(process.env.SMTP_HOST);
  const user = stripQuotes(process.env.SMTP_USER);
  const pass = stripQuotes(process.env.SMTP_PASS);
  const port = parseInt(stripQuotes(process.env.SMTP_PORT) || '587', 10);
  const secureRaw = stripQuotes(process.env.SMTP_SECURE);
  const secure = secureRaw === 'true' || port === 465;

  if (!host || !user || !pass) {
    return null; // SMTP non configuré — mode simulation console
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const formatPriceFCFA = (amount) => {
  return new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);
};

/**
 * Envoie un email générique avec fallback en console si SMTP non configuré
 */
export const sendMail = async ({ from, to, subject, html, text, replyTo }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`\n📧 [EMAIL SIMULATION - SMTP non configuré dans .env]`);
    console.log(`De: ${from}`);
    console.log(`À: ${to}`);
    if (replyTo) console.log(`Répondre à: ${replyTo}`);
    console.log(`Sujet: ${subject}`);
    console.log(`Texte / Aperçu: ${text || (html ? html.replace(/<[^>]+>/g, ' ').slice(0, 150) + '...' : '')}`);
    console.log(`----------------------------------------------------\n`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      replyTo,
      subject,
      text: text || (html ? html.replace(/<[^>]+>/g, ' ') : ''),
      html,
    });
    console.log(`✅ Email envoyé avec succès à ${to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Erreur lors de l'envoi de l'email à ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Notification automatique envoyée à commandes@merveillesmarket.net pour toute nouvelle commande
 */
export const sendOrderNotificationToAdmin = async (order) => {
  let items = [];
  try {
    items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  } catch (e) {
    items = [];
  }

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.name}</strong>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${formatPriceFCFA(item.price)}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">
        ${formatPriceFCFA(item.price * item.quantity)}
      </td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #143C1A; padding: 25px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px; color: #BE8943;">Merveilles Market</h1>
        <p style="margin: 5px 0 0; font-size: 16px;">Nouvelle commande reçue !</p>
      </div>

      <div style="padding: 25px;">
        <div style="background-color: #f8fafc; border-left: 4px solid #143C1A; padding: 15px; margin-bottom: 25px;">
          <h2 style="margin: 0 0 10px; font-size: 18px; color: #143C1A;">Commande #${order.id}</h2>
          <p style="margin: 3px 0; color: #475569;"><strong>Date :</strong> ${new Date(order.createdAt || Date.now()).toLocaleString('fr-FR')}</p>
          <p style="margin: 3px 0; color: #475569;"><strong>Statut :</strong> <span style="background-color: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${order.status || 'PENDING'}</span></p>
        </div>

        <h3 style="color: #143C1A; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 0;">Coordonnées du client</h3>
        <table style="width: 100%; margin-bottom: 25px; font-size: 15px;">
          <tr>
            <td style="width: 35%; color: #64748b; padding: 4px 0;">Nom complet :</td>
            <td style="font-weight: 600; color: #1e293b;">${order.guestName || 'Non spécifié'}</td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 4px 0;">Téléphone :</td>
            <td style="font-weight: 600; color: #1e293b;"><a href="tel:${order.guestPhone}" style="color: #143C1A; text-decoration: none;">${order.guestPhone || 'Non spécifié'}</a></td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 4px 0;">Email :</td>
            <td style="color: #1e293b;"><a href="mailto:${order.guestEmail}" style="color: #143C1A;">${order.guestEmail || 'Non spécifié'}</a></td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 4px 0; vertical-align: top;">Adresse de livraison :</td>
            <td style="font-weight: 600; color: #1e293b;">${order.guestAddress || 'Non spécifiée'}</td>
          </tr>
        </table>

        <h3 style="color: #143C1A; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Détails des articles</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <thead>
            <tr style="background-color: #f1f5f9; color: #475569; text-align: left;">
              <th style="padding: 10px;">Article</th>
              <th style="padding: 10px; text-align: center;">Qté</th>
              <th style="padding: 10px; text-align: right;">Prix unit.</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
          <table style="width: 100%; font-size: 15px;">
            ${order.couponCode ? `
              <tr>
                <td style="color: #64748b; padding: 4px 0;">Code promo (${order.couponCode}) :</td>
                <td style="text-align: right; color: #16a34a; font-weight: bold;">-${formatPriceFCFA(order.discountAmount || 0)}</td>
              </tr>
            ` : ''}
            <tr>
              <td style="color: #64748b; padding: 4px 0;">Frais de livraison :</td>
              <td style="text-align: right; color: #1e293b;">${order.shippingFee ? formatPriceFCFA(order.shippingFee) : 'Gratuit'}</td>
            </tr>
            <tr style="border-top: 1px solid #cbd5e1;">
              <td style="padding-top: 10px; font-size: 18px; font-weight: bold; color: #143C1A;">Montant Total :</td>
              <td style="padding-top: 10px; font-size: 20px; font-weight: bold; text-align: right; color: #143C1A;">${formatPriceFCFA(order.total)}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #64748b; font-size: 13px;">Notification envoyée à ${ORDER_NOTIFICATION_EMAIL}</p>
        </div>
      </div>
    </div>
  `;

  return sendMail({
    from: ORDER_FROM_EMAIL,
    to: ORDER_NOTIFICATION_EMAIL,
    subject: `🔔 Nouvelle Commande #${order.id} - ${formatPriceFCFA(order.total)} (${order.guestName || 'Client'})`,
    html,
  });
};

/**
 * Envoi d'un email de confirmation au client
 */
export const sendOrderConfirmationToCustomer = async (order) => {
  if (!order.guestEmail) return { success: false, reason: 'Pas d email client' };

  let items = [];
  try {
    items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  } catch (e) {
    items = [];
  }

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatPriceFCFA(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #143C1A; padding: 25px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px; color: #BE8943;">Merveilles Market</h1>
        <p style="margin: 5px 0 0; font-size: 15px;">Merci pour votre commande !</p>
      </div>

      <div style="padding: 25px;">
        <p>Bonjour <strong>${order.guestName || 'Cher client'}</strong>,</p>
        <p>Nous avons bien reçu votre commande <strong>#${order.id}</strong>. Notre équipe prépare actuellement vos produits avec le plus grand soin.</p>

        <h3 style="color: #143C1A; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 25px;">Récapitulatif de votre commande</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <thead>
            <tr style="background-color: #f1f5f9; color: #475569; text-align: left;">
              <th style="padding: 10px;">Article</th>
              <th style="padding: 10px; text-align: center;">Qté</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p style="margin: 3px 0; display: flex; justify-content: space-between;">
            <span>Frais de livraison :</span>
            <strong>${order.shippingFee ? formatPriceFCFA(order.shippingFee) : 'Gratuit'}</strong>
          </p>
          <p style="margin: 8px 0 0; display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #143C1A; border-top: 1px solid #cbd5e1; padding-top: 8px;">
            <span>Total :</span>
            <span>${formatPriceFCFA(order.total)}</span>
          </p>
        </div>

        <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 15px; margin-bottom: 25px;">
          <h4 style="margin: 0 0 5px; color: #065f46;">Adresse de livraison :</h4>
          <p style="margin: 0; color: #047857;">${order.guestAddress}</p>
          <p style="margin: 5px 0 0; color: #047857; font-size: 13px;">Nous vous contacterons au <strong>${order.guestPhone}</strong> avant la livraison.</p>
        </div>

        <p style="color: #64748b; font-size: 14px;">Une question ? Contactez-nous à <a href="mailto:${CONTACT_EMAIL}" style="color: #143C1A;">${CONTACT_EMAIL}</a> ou au <strong>+225 07 01 92 95 98</strong>.</p>
      </div>
    </div>
  `;

  return sendMail({
    from: ORDER_FROM_EMAIL,
    to: order.guestEmail,
    subject: `Confirmation de votre commande #${order.id} - Merveilles Market`,
    html,
  });
};

/**
 * Envoi d'un email de bienvenue Newsletter depuis contact@merveillesmarket.net
 */
export const sendNewsletterWelcome = async (email, couponCode = 'BIENVENUE10') => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #143C1A; padding: 30px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 26px; color: #BE8943;">Merveilles Market</h1>
        <p style="margin: 8px 0 0; font-size: 16px;">Bienvenue dans notre communauté !</p>
      </div>

      <div style="padding: 30px; text-align: center;">
        <h2 style="color: #143C1A; margin-top: 0;">Merci pour votre inscription à notre Newsletter</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          Vous recevrez désormais en avant-première nos conseils bien-être, nos nouveaux arrivages de produits naturels et nos offres exclusives.
        </p>

        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fae8ff 100%); border: 2px dashed #BE8943; border-radius: 12px; padding: 20px; margin: 25px 0;">
          <p style="margin: 0; font-size: 14px; color: #78350f; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
            Votre cadeau de bienvenue
          </p>
          <p style="margin: 10px 0; font-size: 28px; font-weight: bold; color: #143C1A; letter-spacing: 2px;">
            ${couponCode}
          </p>
          <p style="margin: 0; font-size: 14px; color: #78350f;">
            Bénéficiez de <strong>10% de réduction</strong> sur votre commande avec ce code.
          </p>
        </div>

        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
          Cet email a été envoyé depuis <strong>no_reply@merveillesmarket.net</strong>. Merci de ne pas répondre à cette adresse.
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 8px;">
          Pour nous contacter : <a href="mailto:contact@merveillesmarket.net" style="color: #BE8943;">contact@merveillesmarket.net</a>
        </p>
      </div>
    </div>
  `;

  return sendMail({
    from: NEWSLETTER_FROM_EMAIL,
    to: email,
    subject: `🎁 Bienvenue chez Merveilles Market ! Votre code promo -10%`,
    html,
  });
};

/**
 * Envoi d'une newsletter aux abonnés depuis contact@merveillesmarket.net
 */
export const sendNewsletterCampaign = async ({ subject, htmlContent, recipients }) => {
  let sentCount = 0;
  let failCount = 0;

  for (const recipient of recipients) {
    const res = await sendMail({
      from: NEWSLETTER_FROM_EMAIL,
      to: recipient,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #143C1A; padding: 25px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; color: #BE8943;">Merveilles Market</h1>
          </div>
          <div style="padding: 25px; color: #334155; line-height: 1.6;">
            ${htmlContent}
          </div>
          <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0;">Vous recevez cet email car vous êtes inscrit à la newsletter de Merveilles Market.</p>
            <p style="margin: 4px 0 0;">Expédié depuis no_reply@merveillesmarket.net — Ne pas répondre à cet email.</p>
            <p style="margin: 4px 0 0;">Contact : <a href="mailto:contact@merveillesmarket.net" style="color: #BE8943;">contact@merveillesmarket.net</a></p>
          </div>
        </div>
      `,
    });

    if (res.success) {
      sentCount++;
    } else {
      failCount++;
    }
  }

  return { sentCount, failCount };
};

/**
 * Envoi d'un message reçu depuis le formulaire de contact à contact@merveillesmarket.net
 */
export const sendContactMessageEmail = async ({ name, email, message }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #143C1A; padding: 25px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px; color: #BE8943;">Merveilles Market</h1>
        <p style="margin: 5px 0 0; font-size: 15px;">Nouveau message reçu depuis le site</p>
      </div>

      <div style="padding: 25px;">
        <div style="background-color: #f8fafc; border-left: 4px solid #143C1A; padding: 15px; margin-bottom: 20px;">
          <p style="margin: 3px 0;"><strong>Expéditeur :</strong> ${name}</p>
          <p style="margin: 3px 0;"><strong>Email :</strong> <a href="mailto:${email}" style="color: #143C1A;">${email}</a></p>
          <p style="margin: 3px 0; color: #64748b; font-size: 13px;">Date : ${new Date().toLocaleString('fr-FR')}</p>
        </div>

        <h3 style="color: #143C1A; margin-bottom: 8px; margin-top: 0;">Message :</h3>
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; font-size: 15px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">
${message}
        </div>

        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; text-align: center;">
          💡 Vous pouvez répondre directement à cet email pour contacter ${name} à l'adresse <strong>${email}</strong>.
        </div>
      </div>
    </div>
  `;

  return sendMail({
    from: `"Contact Formulaire" <${CONTACT_EMAIL}>`,
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: `📩 [Contact] Nouveau message de ${name}`,
    html,
  });
};

