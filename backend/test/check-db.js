import prisma from '../lib/prisma.lib.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    console.log('Testing connection to:', process.env.DATABASE_URL.replace(/:[^:]+@/, ':****@'));
    const count = await prisma.user.count();
    console.log('Connection successful! User count:', count);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
