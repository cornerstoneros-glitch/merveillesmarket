import express from 'express';
import { sendContactMessageEmail } from '../services/emailService.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Traitement du formulaire de contact avec Rate Limiting anti-spam
router.post('/', authLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 1. Validation des champs
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Veuillez renseigner votre nom (au moins 2 caractères).' });
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
      return res.status(400).json({ error: 'Veuillez renseigner une adresse email valide.' });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({ error: 'Veuillez saisir un message d\'au moins 5 caractères.' });
    }

    const cleanName = name.trim().slice(0, 100);
    const cleanEmail = email.trim().toLowerCase().slice(0, 100);
    const cleanMessage = message.trim().slice(0, 3000);

    // 2. Envoi de l'email à contact@merveillesmarket.net
    const mailResult = await sendContactMessageEmail({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
    });

    if (!mailResult.success && !mailResult.simulated) {
      console.error('Erreur lors de l\'envoi du message de contact:', mailResult.error);
      return res.status(500).json({ error: 'Impossible d\'expédier votre message pour le moment. Veuillez réessayer plus tard ou nous joindre directement par téléphone.' });
    }

    res.json({
      success: true,
      message: 'Votre message a bien été envoyé ! Notre équipe vous répondra sous 24h.'
    });
  } catch (error) {
    console.error('Erreur route contact:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de l\'envoi de votre message.' });
  }
});

export default router;
