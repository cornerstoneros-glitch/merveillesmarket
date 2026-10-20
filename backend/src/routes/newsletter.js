import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import prisma from '../prismaClient.js';
import { sendNewsletterWelcome, sendNewsletterCampaign } from '../services/emailService.js';

const router = express.Router();

// Inscription à la newsletter (public)
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Adresse email invalide' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Enregistrer ou réactiver l'abonné
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email: cleanEmail },
      update: { isActive: true },
      create: { email: cleanEmail, isActive: true },
    });

    // Envoyer l'email de bienvenue avec le code promo BIENVENUE10
    // On ne bloque pas si l'envoi échoue
    sendNewsletterWelcome(cleanEmail, 'BIENVENUE10').catch(err => {
      console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', err);
    });

    res.status(200).json({
      success: true,
      message: 'Inscription à la newsletter confirmée !',
      couponCode: 'BIENVENUE10',
      subscriber
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription à la newsletter:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

// Récupérer la liste des abonnés (admin)
router.get('/subscribers', adminAuth, async (req, res) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(subscribers);
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnés:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Envoyer une newsletter à tous les abonnés (admin) - expédié depuis contact@merveillesmarket.net
router.post('/send', adminAuth, async (req, res) => {
  try {
    const { subject, htmlContent } = req.body;

    if (!subject || !htmlContent) {
      return res.status(400).json({ error: 'Le sujet et le contenu sont requis.' });
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      select: { email: true }
    });

    if (subscribers.length === 0) {
      return res.status(400).json({ error: 'Aucun abonné actif pour recevoir la newsletter.' });
    }

    const recipients = subscribers.map(s => s.email);
    const result = await sendNewsletterCampaign({ subject, htmlContent, recipients });

    res.json({
      success: true,
      message: `Newsletter envoyée avec succès à ${result.sentCount} abonnés.`,
      ...result
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la newsletter:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de la newsletter' });
  }
});

export default router;
