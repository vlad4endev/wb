'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Activity,
  Calendar,
  Warehouse
} from 'lucide-react';
import Link from 'next/link';

interface Task {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  scheduleCron?: string;
  autoBook: boolean;
  filters: any;
  priority: number;
  createdAt: string;
  runs: Array<{
    id: string;
    status: string;
    startedAt: string;
    finishedAt?: string;
    summary?: any;
  }>;
  _count: {
    runs: number;
  };
}

interface Stats {
  totalTasks: number;
  activeTasks: number;
  totalRuns: number;
  successfulRuns: number;
  foundSlots: number;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    activeTasks: 0,
    totalRuns: 0,
    successfulRuns: 0,
    foundSlots: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tasksResponse, statsResponse] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/dashboard/stats'),
      ]);

      const tasksData = await tasksResponse.json();
      const statsData = await statsResponse.json();

      if (tasksData.success) {
        setTasks(tasksData.data.tasks);
      }

      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/run`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        // Refresh tasks
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error running task:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge variant="success">Успешно</Badge>;
      case 'RUNNING':
        return <Badge variant="info">Выполняется</Badge>;
      case 'FAILED':
        return <Badge variant="error">Ошибка</Badge>;
      case 'QUEUED':
        return <Badge variant="warning">В очереди</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getLastRunStatus = (task: Task) => {
    if (task.runs.length === 0) return null;
    const lastRun = task.runs[0];
    return getStatusBadge(lastRun.status);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Дашборд
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Управление задачами и мониторинг слотов
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/tasks/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Новая задача
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Настройки
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Всего задач
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalTasks}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Активные
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.activeTasks}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Выполнений
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalRuns}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Найдено слотов
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.foundSlots}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Мои задачи</CardTitle>
              <CardDescription>
                Управление задачами поиска слотов
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    У вас пока нет задач
                  </p>
                  <Link href="/tasks/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Создать первую задачу
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {task.name}
                          </h3>
                          {task.enabled ? (
                            <Badge variant="success">Активна</Badge>
                          ) : (
                            <Badge variant="secondary">Отключена</Badge>
                          )}
                          {task.autoBook && (
                            <Badge variant="warning">Автобронирование</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {task.description || 'Без описания'}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>Приоритет: {task.priority}</span>
                          <span>Запусков: {task._count.runs}</span>
                          {getLastRunStatus(task)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runTask(task.id)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Link href={`/tasks/${task.id}`}>
                          <Button size="sm" variant="ghost">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {tasks.length > 5 && (
                    <div className="text-center pt-4">
                      <Link href="/tasks">
                        <Button variant="outline">
                          Показать все задачи ({tasks.length})
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Последние события</CardTitle>
              <CardDescription>
                История выполнения задач
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.flatMap(task => 
                  task.runs.slice(0, 2).map(run => (
                    <div
                      key={run.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        {run.status === 'SUCCESS' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : run.status === 'FAILED' ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : run.status === 'RUNNING' ? (
                          <Clock className="w-5 h-5 text-blue-500 animate-spin" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {task.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(run.startedAt).toLocaleString('ru-RU')}
                        </p>
                        {run.summary?.foundSlots && (
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Найдено слотов: {run.summary.foundSlots}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusBadge(run.status)}
                      </div>
                    </div>
                  ))
                ).slice(0, 5)}
                
                {tasks.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Пока нет событий
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
              <CardDescription>
                Часто используемые функции
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/tasks/new">
                  <Button variant="outline" className="w-full h-20 flex-col">
                    <Plus className="w-6 h-6 mb-2" />
                    Создать задачу
                  </Button>
                </Link>
                <Link href="/tokens">
                  <Button variant="outline" className="w-full h-20 flex-col">
                    <Settings className="w-6 h-6 mb-2" />
                    Управление токенами
                  </Button>
                </Link>
                <Link href="/warehouses">
                  <Button variant="outline" className="w-full h-20 flex-col">
                    <Warehouse className="w-6 h-6 mb-2" />
                    Настройка складов
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
