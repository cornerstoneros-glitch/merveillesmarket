import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin absolu vers la base de données
const dbPath = path.resolve(__dirname, '../prisma/dev.db');

// Initialiser better-sqlite3
const sqlite = new Database(dbPath);

// Initialiser l'adaptateur Prisma
const adapter = new PrismaBetterSqlite3(sqlite);

// Créer le client Prisma avec l'adaptateur
const prisma = new PrismaClient({ adapter });

export default prisma;
