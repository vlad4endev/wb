# Инструкция по обновлению роли пользователя

## Проблема
Пользователь `cmfbry14q0000136cf6k6yhu2` нуждается в роли DEVELOPER для доступа ко всем настройкам Telegram.

## Решение

### Вариант 1: Через Prisma Studio (Рекомендуется)

1. **Запустите Prisma Studio:**
   ```bash
   cd wb-slots
   npx prisma studio
   ```

2. **Откройте браузер** по адресу `http://localhost:5555`

3. **Найдите таблицу `users`** и откройте её

4. **Найдите пользователя** с ID `cmfbry14q0000136cf6k6yhu2`

5. **Отредактируйте поля:**
   - `role`: измените на `DEVELOPER`
   - `is_protected`: установите `true`

6. **Сохраните изменения**

### Вариант 2: Через SQL запрос

1. **Подключитесь к базе данных** PostgreSQL

2. **Выполните SQL запрос:**
   ```sql
   UPDATE users 
   SET 
     role = 'DEVELOPER',
     is_protected = true,
     updated_at = NOW()
   WHERE id = 'cmfbry14q0000136cf6k6yhu2';
   ```

3. **Проверьте результат:**
   ```sql
   SELECT id, email, name, role, is_protected 
   FROM users 
   WHERE id = 'cmfbry14q0000136cf6k6yhu2';
   ```

### Вариант 3: Через Node.js скрипт

1. **Создайте файл** `update-role.js`:
   ```javascript
   const { PrismaClient } = require('@prisma/client');
   const prisma = new PrismaClient();

   async function updateRole() {
     try {
       const user = await prisma.user.update({
         where: { id: 'cmfbry14q0000136cf6k6yhu2' },
         data: { 
           role: 'DEVELOPER',
           isProtected: true
         }
       });
       console.log('✅ Роль обновлена:', user);
     } catch (error) {
       console.error('❌ Ошибка:', error);
     } finally {
       await prisma.$disconnect();
     }
   }

   updateRole();
   ```

2. **Запустите скрипт:**
   ```bash
   node update-role.js
   ```

## Проверка результата

После обновления роли:

1. **Перезапустите сервер:**
   ```bash
   npm run dev
   ```

2. **Войдите в систему** под пользователем `cmfbry14q0000136cf6k6yhu2`

3. **Перейдите в настройки:** `http://localhost:3000/settings`

4. **Проверьте отображение роли** - должно показать "Разработчик"

5. **Перейдите в Telegram настройки:** `http://localhost:3000/settings/telegram`

6. **Проверьте доступ** к вкладке "Настройки разработчика"

## Ожидаемый результат

После обновления роли пользователь получит:

✅ **Роль DEVELOPER** в профиле
✅ **Доступ ко всем настройкам Telegram**
✅ **Управление шаблонами уведомлений**
✅ **Настройка бота Telegram**
✅ **Защита от удаления аккаунта**

## Файлы для обновления

Созданы следующие скрипты:
- `update-role-now.js` - обновление через Prisma
- `execute-sql.js` - выполнение SQL запроса
- `fix-user-role.js` - поиск и обновление пользователя
- `update-role.sql` - SQL запрос для обновления

Выберите любой удобный способ для обновления роли пользователя! 🚀
