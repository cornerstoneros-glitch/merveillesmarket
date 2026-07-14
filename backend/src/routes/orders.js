import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import prisma from '../prismaClient.js';

const router = express.Router();

// Créer une commande
router.post('/', async (req, res) => {
  try {
    const { items, total, shippingFee, guestName, guestEmail, guestPhone, guestAddress, userId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Le panier est vide' });
    }

    // Utilisation d'une transaction pour vérifier et mettre à jour le stock
    const order = await prisma.$transaction(async (tx) => {
      // 1. Vérifier le stock pour chaque article
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.id }
        });
        
        if (!product) {
          throw new Error(`Produit introuvable : ${item.name}`);
        }
        
        if (product.stock < item.quantity) {
          throw new Error(`Stock insuffisant pour ${product.name} (disponible : ${product.stock})`);
        }
        
        // 2. Décrémenter le stock
        await tx.product.update({
          where: { id: item.id },
          data: { stock: product.stock - item.quantity }
        });
      }

      // 3. Créer la commande
      return await tx.order.create({
        data: {
          items: JSON.stringify(items),
          total,
          shippingFee: shippingFee || 0,
          userId: userId ? parseInt(userId) : null,
          guestName,
          guestEmail,
          guestPhone,
          guestAddress,
          status: 'PENDING'
        }
      });
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    // Renvoyer l'erreur spécifique du stock si c'est le cas
    res.status(400).json({ error: error.message || 'Erreur serveur lors de la création de la commande' });
  }
});

// Récupérer les commandes de l'utilisateur connecté
import { auth } from '../middleware/auth.js';
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de vos commandes' });
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
