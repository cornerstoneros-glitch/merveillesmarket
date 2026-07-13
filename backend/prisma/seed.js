import pkg from '@prisma/client';
import bcrypt from 'bcryptjs';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const mockProducts = [
  {
    name: 'Tisane Détox Minceur',
    price: 3500,
    category: 'Tisanes & infusions',
    universe: 'abbeys',
    image: 'https://images.unsplash.com/photo-1576092762791-dd9e2220c471?auto=format&fit=crop&q=80&w=400',
    description: 'Mélange traditionnel de plantes pour détoxifier l\'organisme.',
    warnings: 'Ne se substitue pas à un avis médical. Déconseillé aux femmes enceintes.',
    isNew: true
  },
  {
    name: 'Huile de Baobab Pure',
    price: 4000,
    category: 'Soins du corps',
    universe: 'abbeys',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=400',
    description: 'Huile de massage nourrissante pour la peau et les cheveux.',
    warnings: 'Usage externe uniquement.'
  },
  {
    name: 'Poudre de Moringa',
    price: 2500,
    category: 'Compléments naturels',
    universe: 'abbeys',
    image: 'https://images.unsplash.com/photo-1615485994246-24e03b41d407?auto=format&fit=crop&q=80&w=400',
    description: 'Complément riche en vitamines et antioxydants.',
    warnings: 'Respecter la dose journalière recommandée.'
  },
  {
    name: 'Robe d\'été Fleurie',
    price: 12000,
    category: 'Mode femme',
    universe: 'josy',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=400',
    description: 'Robe légère parfaite pour la saison estivale. 100% coton.',
    isNew: true
  },
  {
    name: 'Blender Multifonction',
    price: 25000,
    category: 'Électroménager cuisine',
    universe: 'josy',
    image: 'https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?auto=format&fit=crop&q=80&w=400',
    description: 'Blender puissant de 800W, idéal pour smoothies et soupes.',
    promo: true
  },
  {
    name: 'Sac à Main en Cuir',
    price: 18000,
    category: 'Accessoires',
    universe: 'josy',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=400',
    description: 'Sac élégant avec multiples compartiments.'
  }
];

async function main() {
  console.log(`Start seeding ...`);
  for (const p of mockProducts) {
    const product = await prisma.product.create({
      data: p,
    });
    console.log(`Created product with id: ${product.id}`);
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@merveillestrademarket.com' },
    update: {},
    create: {
      email: 'admin@merveillestrademarket.com',
      name: 'Administrateur',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
