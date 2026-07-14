import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import prisma from '../prismaClient.js';

const router = express.Router();

// Créer une commande
router.post('/', async (req, res) => {
  try {
    const { items, total, guestName, guestEmail, guestPhone, guestAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Le panier est vide' });
    }

    const order = await prisma.order.create({
      data: {
        items: JSON.stringify(items),
        total,
        guestName,
        guestEmail,
        guestPhone,
        guestAddress,
        status: 'PENDING'
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création de la commande' });
  }
});

// Récupérer une commande par son ID (optionnel, pour la page de succès)
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ADMIN: Récupérer toutes les commandes
router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des commandes' });
  }
});

// ADMIN: Mettre à jour le statut d'une commande
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du statut' });
  }
});

export default router;
