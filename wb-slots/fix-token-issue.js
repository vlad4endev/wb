const { PrismaClient } = require('@prisma/client');
const { encrypt } = require('./src/lib/encryption');

const prisma = new PrismaClient();

async function fixTokenIssue() {
  try {
    console.log('🔍 Проверяем проблему с токенами...\n');
    
    // 1. Получаем всех пользователей
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true
      }
    });
    
    console.log(`👥 Найдено пользователей: ${users.length}`);
    
    for (const user of users) {
      console.log(`\n👤 Пользователь: ${user.email} (ID: ${user.id})`);
      
      // 2. Проверяем токены пользователя
      const tokens = await prisma.userToken.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          category: true,
          isActive: true,
          createdAt: true
        }
      });
      
      console.log(`   🔑 Токенов: ${tokens.length}`);
      
      // 3. Проверяем SUPPLIES токен
      const suppliesToken = await prisma.userToken.findFirst({
        where: {
          userId: user.id,
          category: 'SUPPLIES',
          isActive: true
        }
      });
      
      if (suppliesToken) {
        console.log(`   ✅ SUPPLIES токен найден: ${suppliesToken.id}`);
      } else {
        console.log('   ❌ SUPPLIES токен не найден, создаем...');
        
        // Создаем тестовый токен
        const testToken = `test-supplies-token-${Date.now()}`;
        const encryptedToken = encrypt(testToken);
        
        try {
          const newToken = await prisma.userToken.create({
            data: {
              userId: user.id,
              category: 'SUPPLIES',
              tokenEncrypted: encryptedToken,
              isActive: true
            }
          });
          
          console.log(`   ✅ Создан SUPPLIES токен: ${newToken.id}`);
          console.log(`   🔑 Токен: ${testToken}`);
          
        } catch (error) {
          console.error(`   ❌ Ошибка создания токена:`, error.message);
        }
      }
      
      // 4. Проверяем другие токены
      if (tokens.length > 0) {
        console.log('   📋 Все токены:');
        tokens.forEach(token => {
          console.log(`      - ${token.category}: ${token.isActive ? 'Активен' : 'Неактивен'} (${new Date(token.createdAt).toLocaleDateString('ru-RU')})`);
        });
      }
    }
    
    // 5. Проверяем задачи пользователей
    console.log('\n📋 Проверяем задачи...');
    const tasks = await prisma.task.findMany({
      include: { user: true },
      take: 5
    });
    
    console.log(`📊 Найдено задач: ${tasks.length}`);
    
    for (const task of tasks) {
      console.log(`\n📝 Задача #${task.taskNumber}: ${task.name}`);
      console.log(`   Пользователь: ${task.user.email} (ID: ${task.user.id})`);
      console.log(`   Статус: ${task.enabled ? 'Включена' : 'Отключена'}`);
      
      // Проверяем, есть ли токен у пользователя задачи
      const userSuppliesToken = await prisma.userToken.findFirst({
        where: {
          userId: task.user.id,
          category: 'SUPPLIES',
          isActive: true
        }
      });
      
      if (userSuppliesToken) {
        console.log(`   ✅ У пользователя есть SUPPLIES токен`);
      } else {
        console.log(`   ❌ У пользователя НЕТ SUPPLIES токена`);
      }
    }
    
    console.log('\n✅ Проверка завершена');
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixTokenIssue();
