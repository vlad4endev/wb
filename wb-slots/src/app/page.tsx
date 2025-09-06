import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Clock, 
  Settings, 
  BarChart3, 
  Shield, 
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                WB Slots
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Войти</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Регистрация</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Автоматическое бронирование
            <span className="text-primary"> слотов Wildberries</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Удобный интерфейс для поиска и авто-бронирования слотов поставки на Wildberries (FBW). 
            Настройте задачи и получайте уведомления о доступных датах.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-6">
                Начать бесплатно
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Посмотреть демо
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Возможности платформы
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Поиск слотов</CardTitle>
                <CardDescription>
                  Автоматическое сканирование доступных дат и слотов по складам WB
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Планировщик</CardTitle>
                <CardDescription>
                  Настройте расписание опроса с помощью cron-выражений
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Автобронирование</CardTitle>
                <CardDescription>
                  Автоматическое бронирование найденных слотов (экспериментально)
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Настройки</CardTitle>
                <CardDescription>
                  Гибкая настройка фильтров, складов и типов тары
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Аналитика</CardTitle>
                <CardDescription>
                  История поставок, логи и статистика выполнения задач
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle>Безопасность</CardTitle>
                <CardDescription>
                  Шифрование токенов, RLS и изоляция данных пользователей
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Как это работает
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Регистрация</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Создайте аккаунт и добавьте токены WB API
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Настройка</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Выберите склады и настройте параметры поиска
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Задачи</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Создайте задачи с расписанием и автобронированием
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">4</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Результат</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Получайте уведомления и бронируйте слоты автоматически
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Статус системы
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold">API WB</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Работает</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold">Планировщик</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Активен</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                  <div>
                    <h4 className="font-semibold">Автобронирование</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">В разработке</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-primary-foreground" />
                </div>
                <h4 className="text-xl font-bold">WB Slots</h4>
              </div>
              <p className="text-gray-400">
                Автоматическое бронирование слотов Wildberries
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Продукт</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white">Возможности</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Тарифы</Link></li>
                <li><Link href="/demo" className="hover:text-white">Демо</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Поддержка</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/docs" className="hover:text-white">Документация</Link></li>
                <li><Link href="/help" className="hover:text-white">Помощь</Link></li>
                <li><Link href="/contact" className="hover:text-white">Контакты</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Правовая информация</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Конфиденциальность</Link></li>
                <li><Link href="/terms" className="hover:text-white">Условия использования</Link></li>
                <li><Link href="/disclaimer" className="hover:text-white">Отказ от ответственности</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 WB Slots. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
