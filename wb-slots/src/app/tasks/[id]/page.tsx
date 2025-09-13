'use client';

import { useState, useEffect, useCallback } from 'react';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FiArrowLeft as ArrowLeft,
  FiEdit as Edit,
  FiTrash2 as Trash2,
  FiRefreshCw as RefreshCw,
  FiLoader as Loader2,
  FiAlertTriangle as AlertTriangle,
  FiSearch as Search,
  FiBookOpen as BookOpen,
  FiCalendar as Calendar,
  FiMapPin as MapPin,
  FiZap as Zap,
  FiTarget as Target,
  FiSettings as Settings
} from 'react-icons/fi';
import Link from 'next/link';
import DashboardLayout from '@/app/dashboard-layout';
import ContinuousSearchStatus from '@/components/continuous-search-status';

interface Task {
  id: string;
  taskNumber: number;
  name: string;
  description?: string;
  enabled: boolean;
  status: string;
  scheduleCron?: string;
  autoBook: boolean;
  autoBookSupplyId?: string;
  filters: {
    warehouseIds?: number[];
    boxTypeIds?: string[];
    coefficientMin?: number;
    coefficientMax?: number;
    dates?: {
      from?: string;
      to?: string;
    };
  };
  priority: number;
  createdAt: string;
  updatedAt: string;
  runs: Array<{
=======
=======
>>>>>>> Stashed changes
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Play, 
  Square,
  Zap, 
  Calendar, 
  Warehouse, 
  Settings,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/app/dashboard-layout';

interface Task {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  scheduleCron?: string;
  autoBook: boolean;
  autoBookSupplyId?: string;
  filters?: any;
  priority: number;
  createdAt: string;
  updatedAt: string;
  runs?: Array<{
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    id: string;
    status: string;
    startedAt: string;
    finishedAt?: string;
    foundSlots?: number;
    summary?: any;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    foundSlotsDetails?: Array<{
      id: string;
      warehouseId: number;
      warehouseName: string;
      date: string;
      timeSlot: string;
      coefficient: number;
      available: boolean;
      boxTypes: any;
      supplyId?: string;
      isBooked: boolean;
      bookingId?: string;
      createdAt: string;
    }>;
  }>;
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params?.id as string;
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warehouseInfo, setWarehouseInfo] = useState<Record<number, string>>({});

  // Загружаем информацию о складах
  const fetchWarehouseInfo = useCallback(async (warehouseIds: number[]) => {
    try {
      const response = await fetch('/api/warehouses/reference');
      const data = await response.json();
      
      if (data.success) {
        const warehouseMap: Record<number, string> = {};
        data.data.forEach((warehouse: any) => {
          if (warehouseIds.includes(warehouse.id)) {
            warehouseMap[warehouse.id] = warehouse.name;
          }
        });
        setWarehouseInfo(warehouseMap);
      }
    } catch (error) {
      console.error('Error fetching warehouse info:', error);
    }
  }, []);

  // Загружаем данные задачи
=======
=======
>>>>>>> Stashed changes
  }>;
  _count?: {
    runs: number;
  };
}

export default function TaskViewPage() {
  const params = useParams();
  const taskId = params.id as string;
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  const fetchTask = useCallback(async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`);
      const data = await response.json();
      
      if (data.success) {
        setTask(data.data);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        
        // Загружаем информацию о складах
        if (data.data.filters?.warehouseIds?.length > 0) {
          await fetchWarehouseInfo(data.data.filters.warehouseIds);
        }
      } else {
        setError(data.error || 'Failed to load task');
      }
    } catch (error) {
      console.error('Error fetching task:', error);
      setError('Failed to load task');
    } finally {
      setLoading(false);
    }
  }, [taskId, fetchWarehouseInfo]);

  // Удаляем задачу
  const deleteTask = async () => {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        router.push('/tasks');
      } else {
        alert(data.error || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };
=======
=======
>>>>>>> Stashed changes
      } else {
        console.error('Error fetching task:', data.error);
      }
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

  useEffect(() => {
    if (taskId) {
      fetchTask();
    }
  }, [taskId, fetchTask]);

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Загрузка задачи...</span>
=======
=======
>>>>>>> Stashed changes
  const toggleTask = async (action: 'start' | 'stop') => {
    setIsActionLoading(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}/${action}`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        setTask(prev => prev ? { ...prev, enabled: action === 'start' } : null);
      } else {
        console.error('Error toggling task:', data.error);
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const runTask = async () => {
    setIsActionLoading(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}/run`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        // Обновляем данные задачи
        fetchTask();
      } else {
        console.error('Error running task:', data.error);
      }
    } catch (error) {
      console.error('Error running task:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const runAutoBooking = async () => {
    setIsActionLoading(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}/auto-book`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        // Обновляем данные задачи
        fetchTask();
      } else {
        console.error('Error running auto booking:', data.error);
      }
    } catch (error) {
      console.error('Error running auto booking:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge variant="success">Успешно</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">Ошибка</Badge>;
      case 'RUNNING':
        return <Badge variant="warning">Выполняется</Badge>;
      default:
        return <Badge variant="secondary">Ожидание</Badge>;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600 dark:text-gray-400">Загрузка задачи...</p>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
          </div>
        </div>
      </DashboardLayout>
    );
  }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  if (error || !task) {
    return (
      <DashboardLayout>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Задача не найдена'}
          </AlertDescription>
        </Alert>
=======
=======
>>>>>>> Stashed changes
  if (!task) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
            <p className="text-gray-600 dark:text-gray-400">Задача не найдена</p>
          </div>
        </div>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      </DashboardLayout>
    );
  }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'STOPPED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      case 'BOOKING':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return 'Выполняется';
      case 'SUCCESS':
        return 'Успешно';
      case 'FAILED':
        return 'Ошибка';
      case 'PENDING':
        return 'Ожидает';
      case 'STOPPED':
        return 'Остановлена';
      case 'BOOKING':
        return 'Бронирование';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Заголовок и навигация */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/tasks">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад к задачам
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Задача #{task.taskNumber}: {task.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Создана {formatDate(task.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchTask}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Обновить
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Редактировать
            </Button>
            <Button variant="destructive" size="sm" onClick={deleteTask}>
              <Trash2 className="h-4 w-4 mr-2" />
              Удалить
            </Button>
          </div>
        </div>

        {/* Основная информация о задаче */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Статус и настройки */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Настройки задачи
                </CardTitle>
=======
=======
>>>>>>> Stashed changes
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/tasks">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад к задачам
                  </Button>
                </Link>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {task.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {task.description || 'Без описания'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {task.enabled ? (
                  <Button 
                    onClick={() => toggleTask('stop')} 
                    variant="destructive"
                    disabled={isActionLoading}
                  >
                    {isActionLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Square className="w-4 h-4 mr-2" />
                    )}
                    Остановить задачу
                  </Button>
                ) : (
                  <Button 
                    onClick={() => toggleTask('start')} 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isActionLoading}
                  >
                    {isActionLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Запустить задачу
                  </Button>
                )}
                <Link href={`/tasks/${taskId}/monitor`}>
                  <Button variant="outline" disabled={isActionLoading}>
                    <Activity className="w-4 h-4 mr-2" />
                    Мониторинг
                  </Button>
                </Link>
                <Button onClick={runTask} variant="outline" disabled={isActionLoading}>
                  <Play className="w-4 h-4 mr-2" />
                  Запустить поиск
                </Button>
                {task.autoBook && (
                  <Button onClick={runAutoBooking} className="bg-blue-600 hover:bg-blue-700" disabled={isActionLoading}>
                    <Zap className="w-4 h-4 mr-2" />
                    Автобронирование
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Info */}
            <Card>
              <CardHeader>
                <CardTitle>Информация о задаче</CardTitle>
                <CardDescription>
                  Основные параметры и настройки
                </CardDescription>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                    <label className="text-sm font-medium text-gray-500">Статус</label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(task.status)}>
                        {getStatusText(task.status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Приоритет</label>
                    <div className="mt-1 text-sm">{task.priority}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Активна</label>
                    <div className="mt-1">
                      <Badge variant={task.enabled ? "default" : "secondary"}>
                        {task.enabled ? 'Да' : 'Нет'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Автобронирование</label>
                    <div className="mt-1">
                      <Badge variant={task.autoBook ? "default" : "secondary"}>
                        {task.autoBook ? 'Включено' : 'Отключено'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {task.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Описание</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {task.description}
                    </p>
                  </div>
                )}

                {task.autoBookSupplyId && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID поставки для бронирования</label>
                    <p className="mt-1 text-sm font-mono text-gray-900 dark:text-white">
=======
=======
>>>>>>> Stashed changes
                    <p className="text-sm font-medium text-gray-500">Статус</p>
                    <p className="text-sm">
                      {task.enabled ? (
                        <Badge variant="success">Активна</Badge>
                      ) : (
                        <Badge variant="secondary">Отключена</Badge>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Приоритет</p>
                    <p className="text-sm">{task.priority}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Автобронирование</p>
                    <p className="text-sm">
                      {task.autoBook ? (
                        <Badge variant="warning">Включено</Badge>
                      ) : (
                        <Badge variant="secondary">Отключено</Badge>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Запусков</p>
                    <p className="text-sm">{task._count?.runs || 0}</p>
                  </div>
                </div>

                {task.autoBook && task.autoBookSupplyId && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID приемки для автобронирования</p>
                    <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                      {task.autoBookSupplyId}
                    </p>
                  </div>
                )}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
              </CardContent>
            </Card>

            {/* Параметры поиска */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Параметры поиска
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Склады</p>
                      <p className="text-sm text-gray-600">
                        {task.filters?.warehouseIds?.length || 0} выбрано
                      </p>
                      {task.filters?.warehouseIds && task.filters.warehouseIds.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {task.filters.warehouseIds.map((id) => (
                            <div key={id} className="text-xs text-gray-500">
                              • {warehouseInfo[id] || `Склад #${id}`}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Коэффициент</p>
                      <p className="text-sm text-gray-600">
                        {task.filters?.coefficientMin || 0} - {task.filters?.coefficientMax || 20}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Период</p>
                      <p className="text-sm text-gray-600">
                        {task.filters?.dates?.from ? 
                          new Date(task.filters.dates.from).toLocaleDateString('ru-RU') : 
                          'Не указан'
                        } - {
                          task.filters?.dates?.to ? 
                            new Date(task.filters.dates.to).toLocaleDateString('ru-RU') : 
                            'Не указан'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Типы коробок</p>
                      <p className="text-sm text-gray-600">
                        {task.filters?.boxTypeIds?.length || 0} выбрано
                      </p>
                      {task.filters?.boxTypeIds && task.filters.boxTypeIds.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {task.filters.boxTypeIds.map((typeId) => (
                            <div key={typeId} className="text-xs text-gray-500">
                              • {typeId}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
=======
=======
>>>>>>> Stashed changes

                <div>
                  <p className="text-sm font-medium text-gray-500">Создана</p>
                  <p className="text-sm">{new Date(task.createdAt).toLocaleString('ru-RU')}</p>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                </div>
              </CardContent>
            </Card>

<<<<<<< Updated upstream
<<<<<<< Updated upstream
            {/* Непрерывный поиск слотов */}
            <ContinuousSearchStatus
              taskId={task.id}
              taskNumber={task.taskNumber}
              taskName={task.name}
              autoBook={task.autoBook}
              autoBookSupplyId={task.autoBookSupplyId}
              filters={task.filters || {}}
            />
          </div>

          {/* Боковая панель с статистикой */}
          <div className="space-y-6">
            {/* Статистика запусков */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Статистика
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Всего запусков:</span>
                    <span className="font-medium">{task.runs?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Успешных:</span>
                    <span className="font-medium text-green-600">
                      {task.runs?.filter(run => run.status === 'SUCCESS').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">С ошибками:</span>
                    <span className="font-medium text-red-600">
                      {task.runs?.filter(run => run.status === 'FAILED').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Всего слотов найдено:</span>
                    <span className="font-medium">
                      {task.runs?.reduce((sum, run) => sum + (run.foundSlots || 0), 0) || 0}
                    </span>
                  </div>
=======
=======
>>>>>>> Stashed changes
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Параметры поиска</CardTitle>
                <CardDescription>
                  Настройки фильтров и условий
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Склады</p>
                  <p className="text-sm">{task.filters?.warehouseIds?.length || 0} выбрано</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Коэффициент</p>
                  <p className="text-sm">
                    {task.filters?.coefficientMin || 0} - {task.filters?.coefficientMax || 20}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Период поиска</p>
                  <p className="text-sm">
                    {task.filters?.dates?.from ? new Date(task.filters.dates.from).toLocaleDateString('ru-RU') : 'Не указан'} - 
                    {task.filters?.dates?.to ? new Date(task.filters.dates.to).toLocaleDateString('ru-RU') : 'Не указан'}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Типы тары</p>
                  <p className="text-sm">
                    {task.filters?.boxTypeIds?.map((id: number) => {
                      switch (id) {
                        case 5: return 'Box';
                        case 6: return 'Monopallet';
                        case 7: return 'Supersafe';
                        default: return `ID ${id}`;
                      }
                    }).join(', ') || 'Не указаны'}
                  </p>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                </div>
              </CardContent>
            </Card>

<<<<<<< Updated upstream
<<<<<<< Updated upstream
            {/* Последние запуски */}
            <Card>
              <CardHeader>
                <CardTitle>Последние запуски</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(task.runs || []).slice(0, 5).map((run) => (
                    <div key={run.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(run.status)}>
                            {getStatusText(run.status)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatDate(run.startedAt)}
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {run.foundSlots || 0} слотов
                        </span>
                      </div>
                      
                      {run.foundSlotsDetails && run.foundSlotsDetails.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs font-medium text-gray-600">Найденные слоты:</p>
                          {run.foundSlotsDetails.slice(0, 3).map((slot) => (
                            <div key={slot.id} className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                              <div className="flex justify-between">
                                <span>{warehouseInfo[slot.warehouseId] || `Склад #${slot.warehouseId}`}</span>
                                <span className="font-medium">Коэф: {slot.coefficient}</span>
                              </div>
                              <div className="text-gray-400">
                                {slot.date} {slot.timeSlot}
                              </div>
                            </div>
                          ))}
                          {run.foundSlotsDetails.length > 3 && (
                            <p className="text-xs text-gray-400">
                              и еще {run.foundSlotsDetails.length - 3} слотов...
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
=======
=======
>>>>>>> Stashed changes
            {/* Recent Runs */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Последние запуски</CardTitle>
                <CardDescription>
                  История выполнения задачи
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!task.runs || task.runs.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Задача еще не запускалась
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(task.runs || []).slice(0, 10).map((run) => (
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
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Запуск #{run.id.slice(-8)}
                            </p>
                            {getStatusBadge(run.status)}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(run.startedAt).toLocaleString('ru-RU')}
                            {run.finishedAt && ` - ${new Date(run.finishedAt).toLocaleString('ru-RU')}`}
                          </p>
                          {run.foundSlots && run.foundSlots > 0 && (
                            <p className="text-xs text-green-600 dark:text-green-400">
                              Найдено слотов: {run.foundSlots}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}