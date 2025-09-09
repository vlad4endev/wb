const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateRole() {
  try {
    console.log('🔄 Обновляем роль пользователя...');
    
    const result = await prisma.user.update({
      where: { 
        id: 'cmfbry14q0000136cf6k6yhu2' 
      },
      data: { 
        role: 'DEVELOPER',
        isProtected: true
      }
    });
    
    console.log('✅ Роль обновлена!');
    console.log('👤 Пользователь:', {
      id: result.id,
      email: result.email,
      name: result.name,
      role: result.role,
      isProtected: result.isProtected
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateRole();
