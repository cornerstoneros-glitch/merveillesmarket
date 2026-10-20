import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from '@prisma/client';
import prisma from './prismaClient.js';
import { generalApiLimiter } from './middleware/rateLimiter.js';

const app = express();
const port = process.env.PORT || 5000;

// Requis pour les proxies inversés (Hostinger, Cloudflare, Nginx) et HTTPS
app.set('trust proxy', 1);

// Headers de sécurité HTTP avec Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://images.unsplash.com"],
      connectSrc: ["'self'", "https://*"],
    }
  },
  crossOriginEmbedderPolicy: false
}));

// Configuration stricte de CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://merveillesmarket.net',
  'https://www.merveillesmarket.net',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (applications mobiles, curl, same-origin) ou les origines whitelistées
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origine non autorisée par la politique CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' })); // Limite la taille des requêtes JSON

// Limiteur de requêtes général sur toutes les routes /api/
app.use('/api/', generalApiLimiter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import ordersRouter from './routes/orders.js';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';
import uploadRouter from './routes/upload.js';
import settingsRouter from './routes/settings.js';
import couponsRouter from './routes/coupons.js';
import newsletterRouter from './routes/newsletter.js';
import contactRouter from './routes/contact.js';

app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is alive' });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/contact', contactRouter);


// Servir le dossier uploads pour les images (supporte un dossier externe via UPLOAD_DIR)
const uploadPath = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadPath));

// Servir les fichiers statiques du frontend (dossier dist après le build)
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// Gestionnaire d'erreur global (ne divulgue JAMAIS de stack trace ou détails internes)
app.use((err, req, res, next) => {
  console.error('Erreur non interceptée:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Une erreur interne est survenue.'
  });
});

// Pour toutes les autres requêtes, renvoyer l'application React
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});


async function autoMigrate() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Coupon" (
          "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          "code" TEXT NOT NULL,
          "discountType" TEXT NOT NULL,
          "discountValue" REAL NOT NULL,
          "isActive" BOOLEAN NOT NULL DEFAULT 1,
          "usageLimit" INTEGER,
          "usageCount" INTEGER NOT NULL DEFAULT 0,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    try { await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");`); } catch (e) {}
    try { await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ADD COLUMN "couponCode" TEXT;`); } catch (e) {}
    try { await prisma.$executeRawUnsafe(`ALTER TABLE "Order" ADD COLUMN "discountAmount" REAL NOT NULL DEFAULT 0;`); } catch (e) {}

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
          "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          "email" TEXT NOT NULL,
          "isActive" BOOLEAN NOT NULL DEFAULT 1,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    try { await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");`); } catch (e) {}

    console.log("Auto-migration de la base de données vérifiée.");
  } catch (error) {
    console.error("Erreur lors de l'auto-migration:", error);
  }
}

autoMigrate().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
