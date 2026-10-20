import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import prisma from '../prismaClient.js';

const router = express.Router();

// Obtenir tous les paramètres (public)
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    // Convert array to key-value object
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    
    // Valeurs par défaut si non défini
    if (!settingsObj['shippingFee']) {
      settingsObj['shippingFee'] = '0';
    }
    
    res.json(settingsObj);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Impossible de récupérer les paramètres" });
  }
});

// Mettre à jour un paramètre (strictement protégé pour l'admin)
router.put('/:key', adminAuth, async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  
  if (value === undefined) {
    return res.status(400).json({ error: "La valeur est requise" });
  }

  try {
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value: value.toString() },
      create: { key, value: value.toString() },
    });
    
    res.json(setting);
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du paramètre" });
  }
});

export default router;

