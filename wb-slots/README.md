# WB Slots - Автоматическое бронирование слотов Wildberries

Производственный моно-репозиторий с веб-приложением для поиска и авто-бронирования слотов поставки на Wildberries (FBW), с мультипользовательской моделью и задачами по сканированию/бронированию.

## 🎯 Цель

Дать пользователю (продавцу WB) удобный и простой интерфейс, где он:

- Настраивает свои токены и параметры
- Создаёт «Задачи» (сканирование доступных дат/слотов по складам и типам тары; авто-бронирование по правилам)
- Получает уведомления и логи
- Видит историю поставок/попыток и статусы

Вся конфигурация строго изолирована на уровне пользователя (multi-tenant): каждый пользователь видит только свои настройки, токены, задачи, логи.

## 🛠 Технический стек

### Frontend
- **Next.js 14** (App Router) + TypeScript
- **React Server Components**
- **TailwindCSS** + **shadcn/ui**
- **Framer Motion** для анимаций
- **i18n** (ru/en), тёмная тема

### Backend
- **Next.js** (route handlers)
- **Prisma ORM** с PostgreSQL
- **BullMQ** + Redis для очередей
- **JWT** аутентификация

### База данных
- **PostgreSQL** с Row Level Security (RLS)
- **Redis** для очередей и кэширования

### Безопасность
- Шифрование токенов (AES-GCM)
- RLS политики для мультитенантности
- Маскирование в логах

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+
- Docker и Docker Compose
- Git

### Установка

1. **Клонируйте репозиторий:**
```bash
git clone <repository-url>
cd wb-slots
```

2. **Скопируйте файл окружения:**
```bash
cp env.example .env.local
```

3. **Настройте переменные окружения в `.env.local`:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/wb_slots?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key-here-change-in-production"
ENCRYPTION_KEY="your-32-byte-base64-encryption-key-here"
APP_BASE_URL="http://localhost:3000"
```

4. **Запустите с Docker Compose:**
```bash
docker-compose up -d
```

5. **Или запустите локально:**
```bash
# Установите зависимости
npm install

# Запустите PostgreSQL и Redis
docker-compose up postgres redis -d

# Выполните миграции
npm run db:migrate

# Заполните базу демо-данными
npm run db:seed

# Запустите приложение
npm run dev

# В отдельном терминале запустите воркеры
npm run worker
```

6. **Откройте браузер:**
```
http://localhost:3000
```

### Демо-аккаунты

- **Пользователь:** `demo@wb-slots.com` / `demo123`
- **Админ:** `admin@wb-slots.com` / `admin123`

## 📋 Функциональность

### Основные возможности

- ✅ **Аутентификация и авторизация** (JWT, роли)
- ✅ **Управление токенами WB API** (шифрование)
- ✅ **Настройка складов и предпочтений**
- ✅ **Создание и управление задачами**
- ✅ **Планировщик с cron-выражениями**
- ✅ **Сканирование слотов через WB API**
- ✅ **Система очередей (BullMQ)**
- ✅ **Логирование и аудит**
- ✅ **Мультитенантность (RLS)**
- ⚠️ **Автобронирование** (экспериментально, UI-автоматизация)

### API интеграции

#### FBW Supplies (Поставки на склады WB)
- `GET /api/v1/acceptance/coefficients` - коэффициенты приёмки
- `GET /api/v1/warehouses` - список складов
- `POST /api/v1/acceptance/options` - опции приёмки
- `POST /api/v1/supplies` - список поставок
- `GET /api/v1/supplies/{ID}` - детали поставки

#### FBS Marketplace (опционально)
- `POST /api/v3/supplies` - создание FBS поставки
- `GET /api/v3/supplies` - список FBS поставок

## 🏗 Архитектура

### Модель данных

```mermaid
erDiagram
    User ||--o{ UserToken : has
    User ||--o{ WarehousePref : has
    User ||--o{ Task : has
    User ||--o{ Run : has
    User ||--o{ SupplySnapshot : has
    User ||--o{ NotificationChannel : has
    User ||--o{ AuditLog : has
    
    Task ||--o{ Run : executes
    Run ||--o{ RunLog : contains
```

### Компоненты системы

1. **Frontend (Next.js)**
   - Страницы и компоненты UI
   - API роуты для аутентификации
   - Управление состоянием

2. **Backend Services**
   - WB API клиенты
   - Система очередей (BullMQ)
   - Планировщик задач

3. **Workers**
   - Сканирование слотов
   - Бронирование (экспериментально)
   - Уведомления

4. **Database**
   - PostgreSQL с RLS
   - Redis для очередей

## 🔧 Настройка

### Получение токенов WB API

1. Войдите в [Личный кабинет продавца WB](https://seller.wildberries.ru/)
2. Перейдите в раздел "Настройки" → "Доступ к API"
3. Создайте токены для нужных категорий:
   - **Supplies** - для работы с поставками FBW
   - **Marketplace** - для FBS поставок (опционально)
   - **Statistics** - для аналитики (опционально)

### Настройка уведомлений

#### Email
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@wb-slots.com"
```

#### Telegram
```env
TELEGRAM_BOT_TOKEN="your-bot-token"
TELEGRAM_WEBHOOK_URL="https://your-domain.com/api/telegram"
```

## 📊 Мониторинг

### Логи
- Структурированные логи с Pino
- Аудит-логи в базе данных
- Логи выполнения задач

### Метрики
- Количество активных задач
- Статистика выполнения
- Использование API

## 🧪 Тестирование

```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e

# Линтинг
npm run lint
```

## 🚨 Важные замечания

### Правовые аспекты

⚠️ **ВНИМАНИЕ:** Любая UI-автоматизация может нарушать правила Wildberries. Функция автобронирования включена только в экспериментальном режиме с явным согласием пользователя.

### Безопасность

- Все токены шифруются перед сохранением в БД
- Используется Row Level Security для изоляции данных
- Токены маскируются в логах
- JWT токены имеют ограниченный срок жизни

### Ограничения

- Публичного API для бронирования FBW слотов не существует
- Автобронирование реализовано через UI-автоматизацию (экспериментально)
- Соблюдайте rate limits WB API

## 📈 Roadmap

- [ ] Официальная интеграция с WB API для бронирования
- [ ] Мобильное приложение
- [ ] Расширенная аналитика
- [ ] Интеграция с другими маркетплейсами
- [ ] API для внешних интеграций

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для подробностей.

## 📞 Поддержка

- 📧 Email: support@wb-slots.com
- 💬 Telegram: @wb_slots_support
- 📖 Документация: [docs.wb-slots.com](https://docs.wb-slots.com)

## 🙏 Благодарности

- Команде Wildberries за предоставление API
- Сообществу Next.js и React
- Всем контрибьюторам проекта

---

**Сделано с ❤️ для сообщества продавцов Wildberries**
