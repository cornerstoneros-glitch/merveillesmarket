// Fichier d'entrée principal pour le déploiement
// Ce fichier charge et démarre le backend qui lui-même servira le frontend en production.

import('./backend/src/server.js').catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
