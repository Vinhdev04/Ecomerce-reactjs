import prisma from '../lib/prisma.lib.js';

export const connectDatabase = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('Missing DATABASE_URL env. Server will start but DB operations will fail.');
      return;
    }
    await prisma.$connect();
    console.log('MongoDB connected successfully via Prisma');
  } catch (error) {
    console.error('Failed to connect MongoDB', error?.message || error);
    console.warn('Continuing to start server without DB connection (dev mode).');
  }
};

export default prisma;
