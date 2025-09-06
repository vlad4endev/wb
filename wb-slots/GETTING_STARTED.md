# 🚀 Быстрый старт WB Slots

## Предварительные требования

- **Node.js 18+** - [Скачать](https://nodejs.org/)
- **Docker и Docker Compose** - [Скачать](https://www.docker.com/products/docker-desktop/)
- **Git** - [Скачать](https://git-scm.com/)

## 🏃‍♂️ Запуск за 5 минут

### 1. Клонирование и установка

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd wb-slots

# Установите зависимости
npm install
```

### 2. Настройка окружения

```bash
# Скопируйте файл окружения
cp env.example .env.local

# Отредактируйте .env.local (опционально)
# Все необходимые значения уже настроены для локальной разработки
```

### 3. Запуск с Docker

```bash
# Запустите все сервисы
docker-compose up -d

# Дождитесь запуска (30-60 секунд)
# Проверьте статус
docker-compose ps
```

### 4. Инициализация базы данных

```bash
# Выполните миграции
npm run db:migrate

# Заполните демо-данными
npm run db:seed
```

### 5. Запуск приложения

```bash
# В первом терминале - веб-приложение
npm run dev

# Во втором терминале - воркеры
npm run worker
```

### 6. Откройте браузер

```
http://localhost:3000
```

## 🔑 Демо-аккаунты

После выполнения `npm run db:seed` доступны:

- **Пользователь:** `demo@wb-slots.com` / `demo123`
- **Админ:** `admin@wb-slots.com` / `admin123`

## 📋 Что дальше?

### 1. Настройте токены WB API

1. Войдите в [Личный кабинет продавца WB](https://seller.wildberries.ru/)
2. Перейдите в "Настройки" → "Доступ к API"
3. Создайте токен для категории "Supplies"
4. В приложении перейдите в "Настройки" → "Токены"
5. Добавьте токен

### 2. Настройте склады

1. Перейдите в "Настройки" → "Склады"
2. Выберите нужные склады
3. Настройте типы тары

### 3. Создайте первую задачу

1. Нажмите "Новая задача" на дашборде
2. Заполните параметры поиска
3. Настройте расписание
4. Сохраните задачу

## 🛠 Разработка

### Структура проекта

```
wb-slots/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API роуты
│   │   ├── auth/           # Страницы аутентификации
│   │   ├── dashboard/      # Дашборд
│   │   └── tasks/          # Управление задачами
│   ├── components/         # React компоненты
│   ├── lib/               # Утилиты и сервисы
│   │   ├── wb-client/     # WB API клиенты
│   │   ├── auth.ts        # Аутентификация
│   │   ├── queue.ts       # Система очередей
│   │   └── scheduler.ts   # Планировщик
│   └── workers/           # Воркеры для фоновых задач
├── prisma/                # Схема базы данных
├── tests/                 # Тесты
└── docker-compose.yml     # Docker конфигурация
```

### Полезные команды

```bash
# Разработка
npm run dev                 # Запуск приложения
npm run worker             # Запуск воркеров
npm run build              # Сборка
npm run start              # Продакшн запуск

# База данных
npm run db:generate        # Генерация Prisma клиента
npm run db:push            # Применение изменений схемы
npm run db:migrate         # Выполнение миграций
npm run db:seed            # Заполнение демо-данными

# Тестирование
npm run test               # Unit тесты
npm run test:e2e           # E2E тесты
npm run lint               # Линтинг
npm run lint:fix           # Исправление линтинга

# Docker
docker-compose up -d       # Запуск всех сервисов
docker-compose down        # Остановка сервисов
docker-compose logs -f     # Просмотр логов
```

### Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `DATABASE_URL` | URL PostgreSQL | `postgresql://postgres:password@localhost:5432/wb_slots` |
| `REDIS_URL` | URL Redis | `redis://localhost:6379` |
| `JWT_SECRET` | Секрет для JWT | `your-super-secret-jwt-key-here` |
| `ENCRYPTION_KEY` | Ключ шифрования | `your-32-byte-base64-encryption-key-here` |
| `APP_BASE_URL` | Базовый URL приложения | `http://localhost:3000` |

## 🐛 Решение проблем

### Проблемы с Docker

```bash
# Очистите контейнеры и volumes
docker-compose down -v
docker system prune -f

# Пересоздайте контейнеры
docker-compose up -d --force-recreate
```

### Проблемы с базой данных

```bash
# Сбросьте базу данных
docker-compose down
docker volume rm wb-slots_postgres_data
docker-compose up -d
npm run db:migrate
npm run db:seed
```

### Проблемы с Redis

```bash
# Очистите Redis
docker-compose exec redis redis-cli FLUSHALL
```

### Проблемы с портами

Если порты 3000, 5432 или 6379 заняты:

1. Измените порты в `docker-compose.yml`
2. Обновите `DATABASE_URL` и `REDIS_URL` в `.env.local`

## 📚 Дополнительные ресурсы

- [Документация Next.js](https://nextjs.org/docs)
- [Документация Prisma](https://www.prisma.io/docs)
- [Документация BullMQ](https://docs.bullmq.io/)
- [Документация WB API](https://dev.wildberries.ru/)

## 🤝 Поддержка

Если у вас возникли проблемы:

1. Проверьте [Issues](https://github.com/your-repo/issues)
2. Создайте новый Issue с описанием проблемы
3. Приложите логи: `docker-compose logs`

---

**Удачной разработки! 🚀**
