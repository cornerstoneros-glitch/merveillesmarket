import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import prisma from '../prismaClient.js';
import { sendOrderNotificationToAdmin, sendOrderConfirmationToCustomer } from '../services/emailService.js';

const router = express.Router();

// Créer une commande
router.post('/', async (req, res) => {
  try {
    const { items, total, shippingFee, guestName, guestEmail, guestPhone, guestAddress, userId, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Le panier est vide' });
    }

    // 1. Validation de base des entrées
    if (!guestName || !guestPhone || !guestAddress) {
      return res.status(400).json({ error: 'Nom, téléphone et adresse de livraison requis.' });
    }

    // Utilisation d'une transaction pour vérifier les prix réels en BDD et mettre à jour le stock
    const order = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const verifiedItems = [];

      // 1. Vérifier chaque article avec le prix authentique de la base de données
      for (const item of items) {
        const qty = parseInt(item.quantity, 10);
        if (isNaN(qty) || qty <= 0) {
          throw new Error('Quantité invalide pour un article.');
        }

        const product = await tx.product.findUnique({
          where: { id: parseInt(item.id, 10) }
        });
        
        if (!product) {
          throw new Error(`Produit introuvable (ID: ${item.id})`);
        }
        
        if (product.stock < qty) {
          throw new Error(`Stock insuffisant pour ${product.name} (disponible : ${product.stock})`);
        }
        
        // Décrémenter le stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - qty }
        });

        subtotal += product.price * qty;
        verifiedItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: qty
        });
      }

      let finalDiscountAmount = 0;
      let appliedCouponCode = null;

      // Vérification du coupon côté serveur
      if (couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode.trim().toUpperCase() }
        });

        if (coupon && coupon.isActive && (coupon.usageLimit === null || coupon.usageCount < coupon.usageLimit)) {
          if (coupon.discountType === 'PERCENTAGE') {
            finalDiscountAmount = subtotal * (coupon.discountValue / 100);
          } else if (coupon.discountType === 'FIXED') {
            finalDiscountAmount = coupon.discountValue;
          }
          
          if (finalDiscountAmount > subtotal) {
            finalDiscountAmount = subtotal; // Le discount ne peut pas excéder le sous-total
          }

          appliedCouponCode = coupon.code;

          // Mettre à jour le compteur d'utilisation
          await tx.coupon.update({
            where: { id: coupon.id },
            data: { usageCount: coupon.usageCount + 1 }
          });
        }
      }

      const validShippingFee = Math.max(0, parseFloat(shippingFee) || 0);
      const computedTotal = subtotal + validShippingFee - finalDiscountAmount;

      // 3. Créer la commande avec données vérifiées côté serveur
      return await tx.order.create({
        data: {
          items: JSON.stringify(verifiedItems),
          total: computedTotal,
          shippingFee: validShippingFee,
          couponCode: appliedCouponCode,
          discountAmount: finalDiscountAmount,
          userId: userId ? parseInt(userId) : null,
          guestName: guestName.trim().slice(0, 100),
          guestEmail: guestEmail ? guestEmail.trim().toLowerCase().slice(0, 100) : null,
          guestPhone: guestPhone.trim().slice(0, 30),
          guestAddress: guestAddress.trim().slice(0, 300),
          status: 'PENDING'
        }
      });
    });

    // Envoi asynchrone des emails (ne bloque pas et ne fait pas échouer la réponse client)
    sendOrderNotificationToAdmin(order).catch(err => {
      console.error('Erreur lors de la notification admin de la commande:', err);
    });

    if (order.guestEmail) {
      sendOrderConfirmationToCustomer(order).catch(err => {
        console.error('Erreur lors de l\'envoi de confirmation de commande au client:', err);
      });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
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
