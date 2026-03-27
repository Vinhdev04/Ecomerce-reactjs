import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing connection to:', process.env.DATABASE_URL.replace(/:([^@]+)@/, (match, group1) => `:${"*".repeat(group1.length)}@`));
    await prisma.$connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    const productCount = await prisma.product.count();
    console.log(`Product count: ${productCount}`);
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

testConnection();
