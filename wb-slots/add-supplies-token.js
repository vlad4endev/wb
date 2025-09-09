const fetch = require('node-fetch');

async function addSuppliesToken() {
  try {
    console.log('🔑 Добавляем SUPPLIES токен через API...\n');
    
    // 1. Логинимся
    console.log('1. Логинимся...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      console.log('❌ Ошибка входа:', loginData.error);
      return;
    }
    
    console.log('✅ Вход успешен');
    console.log('👤 Пользователь:', loginData.data.user.email);
    
    // Получаем куки
    const cookies = loginResponse.headers.get('set-cookie');
    
    // 2. Проверяем существующие токены
    console.log('\n2. Проверяем существующие токены...');
    const tokensResponse = await fetch('http://localhost:3000/api/tokens', {
      method: 'GET',
      headers: { 
        'Cookie': cookies || ''
      }
    });
    
    const tokensData = await tokensResponse.json();
    
    if (tokensData.success) {
      console.log(`📋 Найдено токенов: ${tokensData.data.tokens.length}`);
      tokensData.data.tokens.forEach(token => {
        console.log(`   - ${token.category}: ${token.isActive ? 'Активен' : 'Неактивен'}`);
      });
    }
    
    // 3. Добавляем SUPPLIES токен
    console.log('\n3. Добавляем SUPPLIES токен...');
    const tokenResponse = await fetch('http://localhost:3000/api/tokens', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookies || ''
      },
      body: JSON.stringify({
        category: 'SUPPLIES',
        token: 'test-supplies-token-' + Date.now()
      })
    });
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.success) {
      console.log('✅ SUPPLIES токен добавлен успешно');
      console.log('📋 ID токена:', tokenData.data.token.id);
    } else {
      console.log('❌ Ошибка добавления токена:', tokenData.error);
    }
    
    // 4. Проверяем токены еще раз
    console.log('\n4. Проверяем токены после добавления...');
    const finalTokensResponse = await fetch('http://localhost:3000/api/tokens', {
      method: 'GET',
      headers: { 
        'Cookie': cookies || ''
      }
    });
    
    const finalTokensData = await finalTokensResponse.json();
    
    if (finalTokensData.success) {
      console.log(`📋 Итого токенов: ${finalTokensData.data.tokens.length}`);
      finalTokensData.data.tokens.forEach(token => {
        console.log(`   - ${token.category}: ${token.isActive ? 'Активен' : 'Неактивен'}`);
      });
    }
    
    console.log('\n✅ Готово! Теперь можно запускать поиск слотов.');
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

addSuppliesToken();
