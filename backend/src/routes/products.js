import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import prisma from '../prismaClient.js';

const router = express.Router();

// Helper pour parser les images
const parseImages = (product) => {
  if (product.images) {
    try {
      product.images = JSON.parse(product.images);
    } catch (e) {
      product.images = [];
    }
  } else {
    product.images = [];
  }
  return product;
};

// Récupérer tous les produits (Public)
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products.map(parseImages));
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
      res.json(parseImages(product));
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
    const { name, price, category, universe, image, images, description, warnings, stock, isNew, promo } = req.body;
    
    let imagesString = null;
    if (Array.isArray(images)) {
      imagesString = JSON.stringify(images);
    }
    
    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        category,
        universe,
        image: image || '/images/products/placeholder.png',
        images: imagesString,
        description,
        warnings: warnings || null,
        stock: stock !== undefined ? parseInt(stock) : 0,
        isNew: isNew || false,
        promo: promo || false
      }
    });
    res.status(201).json(parseImages(product));
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// ADMIN: Mettre à jour un produit
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, price, category, universe, image, images, description, warnings, stock, isNew, promo } = req.body;
    
    let imagesString = undefined;
    if (images !== undefined) {
      imagesString = Array.isArray(images) ? JSON.stringify(images) : null;
    }
    
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        price: parseFloat(price),
        category,
        universe,
        image,
        images: imagesString,
        description,
        warnings,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        isNew,
        promo
      }
    });
    res.json(parseImages(product));
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
