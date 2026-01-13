import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
   console.log('MongoDB connected successfully via Prisma');
  } catch (error) {
     console.log('Failed to connect MongoDB', error);
    process.exit(1); // Dừng app nếu DB chết
  }
};

export default prisma;
