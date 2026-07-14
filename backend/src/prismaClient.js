import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utiliser DATABASE_URL des variables d'environnement, sinon chemin local
let dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  const dbPath = path.resolve(__dirname, '../prisma/dev.db');
  dbUrl = `file:${dbPath}`;
} else if (!dbUrl.startsWith('file:')) {
  // S'assurer que le préfixe file: est présent
  dbUrl = `file:${dbUrl}`;
}

// Initialiser l'adaptateur Prisma avec la syntaxe Prisma 7
const adapter = new PrismaBetterSqlite3({ url: dbUrl });

// Créer le client Prisma avec l'adaptateur
const prisma = new PrismaClient({ adapter });

export default prisma;
