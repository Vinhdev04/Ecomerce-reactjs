import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('backend/.env') });

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing connection to:', process.env.DATABASE_URL.replace(/:([^@]+)@/, ':****@'));
    await prisma.$connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    const productCount = await prisma.product.count();
    console.log(`Product count: ${productCount}`);
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
