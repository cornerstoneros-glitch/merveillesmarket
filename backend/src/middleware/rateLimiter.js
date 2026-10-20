import rateLimit from 'express-rate-limit';

// Limiteur strict pour la connexion et l'inscription (Protection anti-brute force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 tentatives max par IP
  standardHeaders: true, // Retourne les headers `RateLimit-*`
  legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
  message: {
    error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
  }
});

// Limiteur pour l'inscription à la newsletter (anti-spam)
export const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10, // 10 inscriptions par heure par IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Trop de requêtes. Veuillez réessayer plus tard.'
  }
});

// Limiteur général de l'API (Protection DoS)
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requêtes par fenêtre
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Limite de requêtes atteinte. Veuillez patienter.'
  }
});
