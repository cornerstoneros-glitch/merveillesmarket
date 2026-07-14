import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import prisma from '../prismaClient.js';

const router = express.Router();

// ADMIN: Récupérer tous les coupons
router.get('/', adminAuth, async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(coupons);
  } catch (error) {
    console.error('Erreur lors de la récupération des coupons:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des coupons' });
  }
});

// ADMIN: Créer un coupon
router.post('/', adminAuth, async (req, res) => {
  try {
    const { code, discountType, discountValue, usageLimit, isActive } = req.body;
    
    // Vérifier si le code existe déjà
    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      return res.status(400).json({ error: 'Ce code promo existe déjà' });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue: parseFloat(discountValue),
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.status(201).json(coupon);
  } catch (error) {
    console.error('Erreur lors de la création du coupon:', error);
    res.status(500).json({ error: 'Erreur lors de la création du coupon' });
  }
});

// ADMIN: Supprimer un coupon
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await prisma.coupon.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true, message: "Coupon supprimé" });
  } catch (error) {
    console.error('Erreur lors de la suppression du coupon:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du coupon' });
  }
});

// PUBLIC: Valider un coupon
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code promo manquant' });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Code promo invalide' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ error: 'Ce code promo n\'est plus actif' });
    }

    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ error: 'La limite d\'utilisation de ce code promo a été atteinte' });
    }

    // Le coupon est valide, renvoyer les infos nécessaires
    res.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    });
  } catch (error) {
    console.error('Erreur lors de la validation du coupon:', error);
    res.status(500).json({ error: 'Erreur lors de la validation du coupon' });
  }
});

export default router;
