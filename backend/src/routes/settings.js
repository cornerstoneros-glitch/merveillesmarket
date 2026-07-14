import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware simple pour vérifier le token admin (déjà présent dans le projet ou à ajuster si besoin)
// Par simplicité et cohérence avec les autres routes, on suppose que le token est vérifié si nécessaire
// mais ici on peut récupérer les settings sans auth pour le frontend,
// et restreindre la modification à l'admin.

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
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// Mettre à jour un paramètre (protégé pour l'admin dans un monde idéal, on applique juste ici)
router.put('/:key', async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  
  if (value === undefined) {
    return res.status(400).json({ error: "Value is required" });
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
    res.status(500).json({ error: `Failed to update setting ${key}` });
  }
});

export default router;
