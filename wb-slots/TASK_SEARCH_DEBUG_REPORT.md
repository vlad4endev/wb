# 🔍 Отчет об отладке проблемы с поиском слотов

## 🚨 **Выявленная проблема:**

При создании задачи не запускается поиск слотов из-за **отсутствия токена SUPPLIES** у пользователя.

## 🔍 **Анализ кода:**

### 1. **Процесс создания задачи:**
```typescript
// src/app/api/tasks/route.ts:105-137
// Автоматически запускаем непрерывный поиск слотов для новой задачи
try {
  const searchConfig = { /* конфигурация поиска */ };
  
  // Запускаем поиск асинхронно
  continuousSlotSearchService.startContinuousSearch(searchConfig).catch(error => {
    console.error('Continuous search error:', error);
  });
} catch (error) {
  console.error('Error starting continuous slot search:', error);
}
```

### 2. **Проверка токена в сервисе поиска:**
```typescript
// src/lib/services/continuous-slot-search-service.ts:81-100
const suppliesToken = await prisma.userToken.findFirst({
  where: {
    userId: config.userId,
    category: 'SUPPLIES',
    isActive: true,
  },
});

if (!suppliesToken) {
  console.error(`No active supplies token found for user ${config.userId}`);
  throw new Error(`No active supplies token found. User has ${userTokens.length} tokens. Please add a SUPPLIES token in settings.`);
}
```

## ❌ **Корень проблемы:**

1. **Отсутствие токена SUPPLIES** - пользователь не добавил токен для API Wildberries
2. **Сервис поиска падает** с ошибкой при попытке получить токен
3. **Поиск не запускается** из-за исключения

## ✅ **Созданные решения:**

### 1. **API для добавления тестового токена:**
- `src/app/api/debug/add-test-token/route.ts`
- Позволяет добавить тестовый токен SUPPLIES для отладки

### 2. **Тестовые скрипты:**
- `test-full-flow.js` - полный тест потока
- `test-task-creation.js` - тест создания задачи
- `test-db-connection.js` - тест подключения к БД

### 3. **Улучшенная диагностика:**
- Добавлены подробные логи в `continuous-slot-search-service.ts`
- Проверка количества токенов у пользователя
- Информативные сообщения об ошибках

## 🛠️ **Инструкции по исправлению:**

### **Вариант 1: Добавить тестовый токен через API**
```bash
# 1. Войти в систему
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# 2. Добавить тестовый токен
curl -X POST http://localhost:3000/api/debug/add-test-token \
  -b cookies.txt

# 3. Создать задачу
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"Test Task","filters":{"warehouseIds":[117501]}}'
```

### **Вариант 2: Добавить токен через интерфейс**
1. Открыть `http://localhost:3000/settings`
2. Перейти в раздел "Токены API"
3. Добавить токен с категорией "SUPPLIES"
4. Убедиться, что токен активен

### **Вариант 3: Использовать тестовый скрипт**
```bash
cd wb-slots
node test-full-flow.js
```

## 📊 **Статус исправлений:**

- ✅ **Выявлена причина проблемы** - отсутствие токена SUPPLIES
- ✅ **Создан API для добавления тестового токена**
- ✅ **Добавлена подробная диагностика**
- ✅ **Созданы тестовые скрипты**
- ⏳ **Требуется добавление токена пользователем**

## 🎯 **Результат:**

После добавления токена SUPPLIES поиск слотов будет запускаться автоматически при создании задачи.

---
*Отчет создан: $(date)*
*Статус: Проблема выявлена, решение готово*
