'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FiSearch as Search, 
  FiClock as Clock, 
  FiSettings as Settings, 
  FiBarChart as BarChart3, 
  FiShield as Shield, 
  FiZap as Zap,
  FiCheckCircle as CheckCircle,
  FiAlertCircle as AlertCircle,
  FiTarget as Target,
  FiActivity as Activity,
  FiTrendingUp as TrendingUp,
  FiUsers as Users,
  FiPackage as Package,
  FiMessageSquare as Bot,
  FiBell as Bell,
  FiArrowRight as ArrowRight,
  FiPlay as Play,
  FiStar as Star,
  FiAward as Award,
  FiGlobe as Globe,
  FiDatabase as Database,
  FiLock as Lock,
  FiKey as Key,
  FiMapPin as Warehouse,
  FiMessageSquare as MessageSquare,
  FiPlus as Plus,
  FiLogIn as LogIn,
  FiUserPlus as UserPlus
} from 'react-icons/fi';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем авторизацию
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.data?.user);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  WB Slots
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Автоматический поиск слотов Wildberries
                </p>
              </div>
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Добро пожаловать!
                  </p>
                </div>
                <Button onClick={handleLogout} variant="outline">
                  Выйти
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button variant="outline" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Войти
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Регистрация
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Новый способ поиска слотов
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Автоматический поиск
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              слотов Wildberries
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Экономьте время и находите лучшие слоты для поставок с помощью 
            искусственного интеллекта и автоматизации
          </p>

          {user ? (
            <div className="flex items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Панель управления
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Начать бесплатно
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Войти в аккаунт
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Автоматизация
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Полностью автоматический поиск слотов 24/7 с уведомлениями в Telegram
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Умный поиск
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                ИИ анализирует коэффициенты и находит самые выгодные слоты
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Безопасность
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Шифрование данных и безопасная работа с API Wildberries
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Warehouse className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Справочник складов
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Официальный справочник всех складов WB с актуальными данными
              </p>
              <Link href="/warehouses" className="mt-4 inline-block">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Открыть справочник
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
