const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function executeSQL() {
  try {
    console.log('🔄 Выполняем SQL запрос...');
    
    // Обновляем роль пользователя
    const updateResult = await prisma.$executeRaw`
      UPDATE users 
      SET 
        role = 'DEVELOPER',
        is_protected = true,
        updated_at = NOW()
      WHERE id = 'cmfbry14q0000136cf6k6yhu2'
    `;
    
    console.log('✅ Обновлено записей:', updateResult);
    
    // Проверяем результат
    const user = await prisma.user.findUnique({
      where: { id: 'cmfbry14q0000136cf6k6yhu2' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isProtected: true,
        updatedAt: true
      }
    });
    
    if (user) {
      console.log('✅ Пользователь обновлен:');
      console.log('👤 ID:', user.id);
      console.log('📧 Email:', user.email);
      console.log('👤 Имя:', user.name);
      console.log('🔑 Роль:', user.role);
      console.log('🛡️ Защищен:', user.isProtected);
      console.log('📅 Обновлен:', user.updatedAt);
    } else {
      console.log('❌ Пользователь не найден');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

executeSQL();
