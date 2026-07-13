import express from 'express';
import cors from 'cors';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

import ordersRouter from './routes/orders.js';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
