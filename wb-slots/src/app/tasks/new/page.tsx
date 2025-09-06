'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Warehouse {
  id: number;
  name: string;
  enabled: boolean;
}

export default function NewTaskPage() {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    enabled: true,
    scheduleCron: '',
    autoBook: false,
    autoBookSupplyId: '', // Новое поле для номера приемки
    priority: 5,
    filters: {
      coefficientMin: 0, // Минимум коэффициента
      coefficientMax: 20, // Максимум коэффициента
      allowUnload: true,
      dates: {
        from: '',
        to: '',
      },
      boxTypeIds: [5, 6],
      warehouseIds: [] as number[],
    },
    retryPolicy: {
      maxRetries: 3,
      backoffMs: 5000,
    },
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await fetch('/api/warehouses');
      const data = await response.json();
      if (data.success) {
        setWarehouses(data.data.warehouses);
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Ошибка создания задачи');
      }
    } catch (error) {
      setError('Произошла ошибка при создании задачи');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('filters.')) {
      const filterKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          [filterKey]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        },
      }));
    } else if (name.startsWith('retryPolicy.')) {
      const policyKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        retryPolicy: {
          ...prev.retryPolicy,
          [policyKey]: parseInt(value) || 0,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  const handleWarehouseChange = (warehouseId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        warehouseIds: checked
          ? [...prev.filters.warehouseIds, warehouseId]
          : prev.filters.warehouseIds.filter(id => id !== warehouseId),
      },
    }));
  };

  const cronPresets = [
    { label: 'Каждые 15 минут', value: '*/15 * * * *' },
    { label: 'Каждые 30 минут', value: '*/30 * * * *' },
    { label: 'Каждый час', value: '0 * * * *' },
    { label: 'Каждые 2 часа', value: '0 */2 * * *' },
    { label: 'Каждые 6 часов', value: '0 */6 * * *' },
    { label: 'Ежедневно в 9:00', value: '0 9 * * *' },
    { label: 'Ежедневно в 18:00', value: '0 18 * * *' },
    { label: 'По будням в 9:00', value: '0 9 * * 1-5' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Создать задачу
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Настройте автоматический поиск слотов
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
              <CardDescription>
                Название и описание задачи
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Название *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Поиск слотов Москва"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Комментарий</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Краткое описание"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="enabled"
                      checked={formData.enabled}
                      onChange={handleChange}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Задача активна</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="autoBook"
                      checked={formData.autoBook}
                      onChange={handleChange}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Автобронирование (экспериментально)</span>
                  </label>
                </div>

                {formData.autoBook && (
                  <div className="space-y-2">
                    <Label htmlFor="autoBookSupplyId">Номер приемки для бронирования *</Label>
                    <Input
                      id="autoBookSupplyId"
                      name="autoBookSupplyId"
                      value={formData.autoBookSupplyId}
                      onChange={handleChange}
                      placeholder="Введите номер приемки"
                      required={formData.autoBook}
                    />
                    <p className="text-xs text-gray-500">
                      Номер приемки, по которому будет происходить автобронирование
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Период</CardTitle>
              <CardDescription>
                Настройте частоту выполнения задачи
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scheduleCron">Cron выражение</Label>
                <Input
                  id="scheduleCron"
                  name="scheduleCron"
                  value={formData.scheduleCron}
                  onChange={handleChange}
                  placeholder="*/15 * * * *"
                />
                <p className="text-xs text-gray-500">
                  Оставьте пустым для ручного запуска
                </p>
              </div>

              <div className="space-y-2">
                <Label>Быстрые настройки</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {cronPresets.map((preset) => (
                    <Button
                      key={preset.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        scheduleCron: preset.value,
                      }))}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Фильтры поиска</CardTitle>
              <CardDescription>
                Настройте параметры поиска слотов
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Warehouses */}
              <div className="space-y-2">
                <Label>Склады *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {warehouses.map((warehouse) => (
                    <label
                      key={warehouse.id}
                      className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <input
                        type="checkbox"
                        checked={formData.filters.warehouseIds.includes(warehouse.id)}
                        onChange={(e) => handleWarehouseChange(warehouse.id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{warehouse.name}</span>
                    </label>
                  ))}
                </div>
                {formData.filters.warehouseIds.length === 0 && (
                  <p className="text-sm text-red-500">Выберите хотя бы один склад</p>
                )}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dates.from">Дата начала</Label>
                  <Input
                    id="dates.from"
                    name="filters.dates.from"
                    type="datetime-local"
                    value={formData.filters.dates.from}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dates.to">Дата окончания</Label>
                  <Input
                    id="dates.to"
                    name="filters.dates.to"
                    type="datetime-local"
                    value={formData.filters.dates.to}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Coefficient */}
              <div className="space-y-2">
                <Label>Коэффициент приёмки</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coefficientMin">Минимум</Label>
                    <Input
                      id="coefficientMin"
                      name="filters.coefficientMin"
                      type="number"
                      min="0"
                      max="20"
                      value={formData.filters.coefficientMin}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coefficientMax">Максимум</Label>
                    <Input
                      id="coefficientMax"
                      name="filters.coefficientMax"
                      type="number"
                      min="0"
                      max="20"
                      value={formData.filters.coefficientMax}
                      onChange={handleChange}
                      placeholder="20"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Диапазон коэффициента приёмки (0-20)
                </p>
              </div>

              {/* Allow Unload */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="filters.allowUnload"
                    checked={formData.filters.allowUnload}
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Разрешить разгрузку</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Retry Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Политика повторов</CardTitle>
              <CardDescription>
                Настройте поведение при ошибках
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="retryPolicy.maxRetries">Максимум повторов</Label>
                  <Input
                    id="retryPolicy.maxRetries"
                    name="retryPolicy.maxRetries"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.retryPolicy.maxRetries}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retryPolicy.backoffMs">Задержка (мс)</Label>
                  <Input
                    id="retryPolicy.backoffMs"
                    name="retryPolicy.backoffMs"
                    type="number"
                    min="1000"
                    max="60000"
                    value={formData.retryPolicy.backoffMs}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Priority */}
          <Card>
            <CardHeader>
              <CardTitle>Приоритет</CardTitle>
              <CardDescription>
                Чем выше приоритет, тем раньше выполняется задача
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="priority">Приоритет (0-10)</Label>
                <Input
                  id="priority"
                  name="priority"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.priority}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" type="button">
                Отмена
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading || formData.filters.warehouseIds.length === 0}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              Создать задачу
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
