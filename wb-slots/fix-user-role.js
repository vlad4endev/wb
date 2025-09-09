// Простой скрипт для обновления роли пользователя
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixUserRole() {
  try {
    console.log('🔄 Ищем пользователя...');
    
    // Сначала найдем пользователя
    const user = await prisma.user.findUnique({
      where: { id: 'cmfbry14q0000136cf6k6yhu2' }
    });
    
    if (!user) {
      console.log('❌ Пользователь не найден');
      return;
    }
    
    console.log('👤 Найден пользователь:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
    
    console.log('🔄 Обновляем роль...');
    
    // Обновляем роль
    const updatedUser = await prisma.user.update({
      where: { id: 'cmfbry14q0000136cf6k6yhu2' },
      data: { 
        role: 'DEVELOPER',
        isProtected: true
      }
    });
    
    console.log('✅ Роль обновлена!');
    console.log('👤 Новые данные:', {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      isProtected: updatedUser.isProtected
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserRole();
