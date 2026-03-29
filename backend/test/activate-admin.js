import prisma from '../lib/prisma.lib.js';
import dotenv from 'dotenv';
dotenv.config();

async function activateAdmin() {
  const email = 'admin@xpadgame.vn';
  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: { status: 'ACTIVE' }
    });
    console.log(`✅ Da kich hoat thanh cong tai khoan: ${email}`);
    console.log(`Trang thai hien tai: ${user.status}`);
  } catch (err) {
    console.error(`❌ Loi: Khong tim thay tai khoan ${email} hoac loi ket noi.`);
  } finally {
    await prisma.$disconnect();
  }
}

activateAdmin();
