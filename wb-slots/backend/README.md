# WB Slots Backend

NestJS backend для системы автоматизации поиска и бронирования слотов поставки на Wildberries.

## 🚀 Быстрый старт

### Предварительные требования

- Node.js (v18+)
- PostgreSQL
- Redis

### Установка

1. Установите зависимости:
```bash
npm install
```

2. Скопируйте файл переменных окружения:
```bash
cp env.example .env
```

3. Настройте переменные окружения в файле `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wb_slots?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3001
REDIS_URL="redis://localhost:6379"
```

4. Сгенерируйте Prisma клиент:
```bash
npm run db:generate
```

5. Примените миграции базы данных:
```bash
npm run db:push
```

### Запуск

#### Режим разработки
```bash
npm run start:dev
```

#### Продакшн
```bash
npm run build
npm run start:prod
```

## 📚 API Документация

После запуска сервера документация Swagger доступна по адресу:
- http://localhost:3001/api/docs

## 🏗️ Архитектура

### Модули

- **AuthModule** - Аутентификация и авторизация
- **UsersModule** - Управление пользователями
- **TasksModule** - Управление задачами поиска слотов
- **WarehousesModule** - Управление складами
- **PrismaModule** - Интеграция с базой данных

### Основные endpoints

#### Аутентификация
- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход
- `GET /auth/me` - Получение профиля

#### Пользователи
- `GET /users/profile` - Профиль пользователя
- `PATCH /users/profile` - Обновление профиля
- `GET /users/tokens` - Токены WB API
- `GET /users/warehouses` - Склады пользователя

#### Задачи
- `GET /tasks` - Список задач
- `POST /tasks` - Создание задачи
- `GET /tasks/:id` - Получение задачи
- `PATCH /tasks/:id` - Обновление задачи
- `DELETE /tasks/:id` - Удаление задачи
- `POST /tasks/:id/run` - Запуск задачи
- `GET /tasks/stats` - Статистика задач

#### Склады
- `GET /warehouses` - Список складов
- `POST /warehouses` - Добавление склада
- `GET /warehouses/:id` - Получение склада
- `PATCH /warehouses/:id` - Обновление склада
- `DELETE /warehouses/:id` - Удаление склада
- `PATCH /warehouses/:id/toggle` - Переключение активности

## 🔒 Безопасность

- JWT аутентификация
- Валидация входных данных с class-validator
- Row Level Security (RLS) в PostgreSQL
- CORS настройка

## 🧪 Тестирование

```bash
# Юнит тесты
npm run test

# E2E тесты
npm run test:e2e

# Покрытие кода
npm run test:cov
```

## 📦 Скрипты

- `npm run build` - Сборка проекта
- `npm run start` - Запуск продакшн версии
- `npm run start:dev` - Запуск в режиме разработки
- `npm run start:debug` - Запуск с отладкой
- `npm run lint` - Линтинг кода
- `npm run format` - Форматирование кода
- `npm run db:generate` - Генерация Prisma клиента
- `npm run db:push` - Применение изменений схемы к БД
- `npm run db:migrate` - Создание и применение миграций

## 🌍 Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `DATABASE_URL` | URL подключения к PostgreSQL | - |
| `JWT_SECRET` | Секретный ключ для JWT | - |
| `JWT_EXPIRES_IN` | Время жизни JWT токена | 7d |
| `PORT` | Порт сервера | 3001 |
| `NODE_ENV` | Окружение | development |
| `FRONTEND_URL` | URL фронтенда для CORS | http://localhost:3000 |
| `REDIS_URL` | URL подключения к Redis | redis://localhost:6379 |
| `ENCRYPTION_KEY` | Ключ шифрования для токенов WB | - |

## 📝 Логирование

Используется встроенная система логирования NestJS с поддержкой различных уровней логов.

## 🔧 Разработка

### Добавление нового модуля

```bash
nest generate module module-name
nest generate controller module-name
nest generate service module-name
```

### Структура проекта

```
src/
├── auth/              # Модуль аутентификации
├── users/             # Модуль пользователей
├── tasks/             # Модуль задач
├── warehouses/        # Модуль складов
├── prisma/            # Prisma сервис
├── common/            # Общие компоненты
├── main.ts            # Точка входа
└── app.module.ts      # Корневой модуль
```
