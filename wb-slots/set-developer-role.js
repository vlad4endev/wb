// Скрипт для установки роли DEVELOPER пользователю
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setDeveloperRole() {
  try {
    const userId = 'cmfbry14q0000136cf6k6yhu2';
    
    console.log('🔄 Устанавливаем роль DEVELOPER для пользователя...');
    
    // Обновляем роль пользователя
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        role: 'DEVELOPER',
        isProtected: true
      },
    });
    
    console.log('✅ Роль обновлена успешно!');
    console.log('👤 Пользователь:', {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      isProtected: updatedUser.isProtected
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

setDeveloperRole();
