import express from 'express';
import pkg from '@prisma/client';
import { adminAuth } from '../middleware/auth.js';
const { PrismaClient } = pkg;

const router = express.Router();
const prisma = new PrismaClient();

// Récupérer tous les produits (Public)
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Récupérer un produit par son ID (Public)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// ADMIN: Créer un produit
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, price, category, universe, image, description, warnings, isNew, promo } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        category,
        universe,
        image: image || '/images/products/placeholder.png',
        description,
        warnings: warnings || null,
        isNew: isNew || false,
        promo: promo || false
      }
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// ADMIN: Mettre à jour un produit
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, price, category, universe, image, description, warnings, isNew, promo } = req.body;
    
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        price: parseFloat(price),
        category,
        universe,
        image,
        description,
        warnings,
        isNew,
        promo
      }
    });
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// ADMIN: Supprimer un produit
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true, message: "Produit supprimé" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
