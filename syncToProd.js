const fs = require('fs');

const API_LOCAL = 'http://localhost:5000/api';
const API_PROD = 'https://olive-chamois-682749.hostingersite.com/api';

const ADMIN_EMAIL = 'admin@merveillestrademarket.com';
const ADMIN_PASSWORD = 'admin123';

async function syncProducts() {
  console.log('🔄 Démarrage de la synchronisation vers Hostinger...');

  try {
    // 1. Connexion à l'API de production pour obtenir le token
    console.log('🔑 Connexion à la production...');
    const loginRes = await fetch(`${API_PROD}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    });

    if (!loginRes.ok) {
      const errData = await loginRes.json();
      throw new Error(`Échec de connexion (${loginRes.status}): ${errData.details || errData.error}\nStack: ${errData.stack || ''}`);
    }

    const { token } = await loginRes.json();
    console.log('✅ Connecté avec succès!');

    // 2. Récupérer les produits depuis l'API locale
    console.log('📦 Récupération des produits depuis le backend local (assurez-vous qu\'il tourne)...');
    const localRes = await fetch(`${API_LOCAL}/products`);
    
    if (!localRes.ok) {
      throw new Error('Impossible de contacter le backend local. Avez-vous lancé "npm run dev"?');
    }

    const localProducts = await localRes.json();
    console.log(`🔍 ${localProducts.length} produits trouvés localement.`);

    // 3. Envoyer chaque produit vers la production
    console.log('🚀 Envoi des produits vers Hostinger...');
    let successCount = 0;

    for (const product of localProducts) {
      // On retire l'ID pour que la production lui donne un nouvel ID
      const { id, createdAt, updatedAt, ...productData } = product;

      const createRes = await fetch(`${API_PROD}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (createRes.ok) {
        console.log(`✅ Produit ajouté : ${product.name}`);
        successCount++;
      } else {
        const errData = await createRes.json();
        console.error(`❌ Échec pour : ${product.name}`, errData);
      }
    }

    console.log(`🎉 Terminé ! ${successCount} produits synchronisés avec succès.`);

  } catch (err) {
    console.error('❌ Erreur :', err.message);
  }
}

syncProducts();
