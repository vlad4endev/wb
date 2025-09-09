// Простой скрипт для обновления роли пользователя
const userId = 'cmfbry14q0000136cf6k6yhu2';

console.log('🔄 Обновляем роль пользователя через API...');

fetch('http://localhost:3000/api/admin/update-user-role', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: userId,
    role: 'DEVELOPER',
    isProtected: true
  })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('✅ Пользователь обновлен:', data.user);
  } else {
    console.error('❌ Ошибка:', data.error);
  }
})
.catch(error => {
  console.error('❌ Ошибка запроса:', error);
});
