import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { adminAuth } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// S'assurer que le dossier uploads existe (supporte un dossier externe via UPLOAD_DIR)
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Extraire l'extension originale
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // Limite à 5MB par fichier
    files: 10 // Max 10 fichiers simultanés
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non autorisé. Formats acceptés : JPG, PNG, WEBP, AVIF.'));
    }
  }
});

// Route d'upload multiple (max 10 images) avec gestion d'erreurs Multer
router.post('/', adminAuth, (req, res) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Fichier trop volumineux (maximum 5 Mo).' });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ error: 'Nombre maximum de fichiers dépassé (10 max).' });
      }
      return res.status(400).json({ error: `Erreur d'envoi : ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Aucun fichier uploadé.' });
      }

      // Retourner les URLs publiques des fichiers uploadés
      const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
      
      res.status(200).json({ urls: fileUrls });
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      res.status(500).json({ error: 'Erreur serveur lors de l\'enregistrement des fichiers.' });
    }
  });
});

export default router;

