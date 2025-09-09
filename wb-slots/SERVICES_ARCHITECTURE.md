# 🏗️ Архитектура разделенных сервисов

## 📋 Обзор

Система разделена на два независимых сервиса, которые работают в рамках одного процесса, но запускаются по отдельным командам:

1. **SlotSearchService** - поиск слотов Wildberries
2. **AutoBookingService** - автоматическое бронирование через Puppeteer

## 🔧 SlotSearchService

### Назначение
- Поиск доступных слотов на Wildberries
- Фильтрация по критериям (склады, типы поставки, коэффициенты)
- Непрерывный поиск с настраиваемыми интервалами
- Логирование всех операций

### Файлы
- `src/lib/services/slot-search-service.ts` - основной сервис
- `src/app/api/services/slot-search/route.ts` - API endpoints

### API Endpoints
- `POST /api/services/slot-search` - запуск поиска
- `GET /api/services/slot-search` - получение статуса
- `DELETE /api/services/slot-search` - остановка поиска

### Конфигурация
```typescript
interface SlotSearchConfig {
  taskId: string;
  userId: string;
  runId?: string;
  warehouseIds: number[];
  boxTypeIds: number[];
  coefficientMin: number;
  coefficientMax: number;
  dateFrom: string;
  dateTo: string;
  stopOnFirstFound: boolean;
  isSortingCenter: boolean;
  maxSearchCycles?: number;
  searchDelay?: number;
  maxExecutionTime?: number;
}
```

## 🤖 AutoBookingService

### Назначение
- Автоматическое бронирование найденных слотов
- Работа с Puppeteer для взаимодействия с WB
- Управление WB сессиями и cookies
- Отправка уведомлений о результатах

### Файлы
- `src/lib/services/auto-booking-service.ts` - основной сервис
- `src/app/api/services/auto-booking/route.ts` - API endpoints

### API Endpoints
- `POST /api/services/auto-booking` - запуск бронирования
- `GET /api/services/auto-booking` - получение статуса
- `DELETE /api/services/auto-booking` - остановка бронирования

### Конфигурация
```typescript
interface BookingConfig {
  taskId: string;
  userId: string;
  runId: string;
  slotId: string;
  supplyId: string;
  warehouseId: number;
  boxTypeId: number;
  date: string;
  coefficient: number;
}
```

## 📧 TelegramService

### Назначение
- Отправка уведомлений через Telegram Bot API
- Управление настройками уведомлений пользователей
- Различные типы уведомлений (найден слот, успешное бронирование, ошибки)

### Файлы
- `src/lib/services/telegram-service.ts` - основной сервис
- `src/app/api/services/telegram/route.ts` - API endpoints

### API Endpoints
- `POST /api/services/telegram` - отправка уведомления
- `GET /api/services/telegram` - проверка настроек

## 🔄 Queue Workers

### Обновленная архитектура очередей
- `scanSlotsWorker` - использует SlotSearchService
- `bookSlotWorker` - использует AutoBookingService
- `notifyWorker` - использует TelegramService
- `stopTaskWorker` - остановка задач
- `monitorWorker` - непрерывный мониторинг

### Преимущества новой архитектуры
1. **Модульность** - каждый сервис отвечает за свою область
2. **Независимость** - сервисы можно запускать отдельно
3. **Тестируемость** - легко тестировать каждый сервис
4. **Масштабируемость** - можно вынести в отдельные микросервисы
5. **Переиспользование** - сервисы можно использовать в разных контекстах

## 🚀 Использование

### Запуск через API
```typescript
// Запуск поиска слотов
const searchResult = await fetch('/api/services/slot-search', {
  method: 'POST',
  body: JSON.stringify(searchConfig)
});

// Запуск бронирования
const bookingResult = await fetch('/api/services/auto-booking', {
  method: 'POST',
  body: JSON.stringify(bookingConfig)
});

// Отправка уведомления
const notificationResult = await fetch('/api/services/telegram', {
  method: 'POST',
  body: JSON.stringify({ message: 'Test notification' })
});
```

### Запуск через Queue Workers
```typescript
// Добавление задачи поиска в очередь
await addJob('scan-slots', {
  taskId,
  userId,
  runId
});

// Добавление задачи бронирования в очередь
await addJob('book-slot', {
  taskId,
  userId,
  runId,
  slotId,
  supplyId,
  warehouseId,
  boxTypeId,
  date,
  coefficient
});
```

## 🧪 Тестирование

### Страница тестирования
- URL: `/test-services`
- Возможности:
  - Тестирование каждого сервиса отдельно
  - Проверка статусов сервисов
  - Отправка тестовых уведомлений
  - Просмотр результатов в реальном времени

### Тестовые сценарии
1. **Поиск слотов** - тестирование с различными параметрами
2. **Бронирование** - тестирование с тестовыми данными
3. **Уведомления** - проверка отправки в Telegram
4. **Интеграция** - тестирование взаимодействия сервисов

## 📊 Мониторинг

### Логирование
- Каждый сервис ведет детальные логи
- Логи сохраняются в базе данных через `RunLog`
- Поддержка различных уровней логирования (DEBUG, INFO, WARN, ERROR)

### Статусы
- `isSearchInProgress()` - статус поиска слотов
- `isBookingInProgress()` - статус бронирования
- `isNotificationConfigured()` - настройки уведомлений

## 🔧 Конфигурация

### Environment Variables
```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token

# Redis
REDIS_URL=redis://localhost:6379

# Database
DATABASE_URL=postgresql://...

# WB API
WB_SUPPLIES_API_URL=https://supplies-api.wildberries.ru
```

### Настройки сервисов
- **SlotSearchService**: интервалы поиска, максимальное время выполнения
- **AutoBookingService**: настройки Puppeteer, таймауты
- **TelegramService**: настройки уведомлений пользователей

## 🚀 Развертывание

### Локальная разработка
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Docker
```bash
docker-compose up -d
```

## 📈 Преимущества новой архитектуры

1. **Разделение ответственности** - каждый сервис решает свою задачу
2. **Независимое тестирование** - можно тестировать сервисы по отдельности
3. **Гибкость** - легко добавлять новые сервисы
4. **Масштабируемость** - можно вынести сервисы в отдельные контейнеры
5. **Переиспользование** - сервисы можно использовать в других проектах
6. **Мониторинг** - детальное логирование и отслеживание состояния
7. **API-first** - каждый сервис имеет REST API для внешнего использования

## 🔮 Планы развития

1. **Микросервисная архитектура** - вынос сервисов в отдельные контейнеры
2. **Event-driven архитектура** - использование событий для связи сервисов
3. **Горизонтальное масштабирование** - запуск нескольких экземпляров сервисов
4. **Мониторинг и метрики** - интеграция с системами мониторинга
5. **CI/CD** - автоматическое тестирование и развертывание сервисов
