'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Key, 
  Warehouse, 
  User, 
  Plus, 
  Edit, 
  Trash2,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

interface UserToken {
  id: string;
  category: string;
  tokenEncrypted: string;
  isActive: boolean;
  lastUsedAt?: string;
  createdAt: string;
}

interface Warehouse {
  id: number;
  name: string;
  enabled: boolean;
  boxAllowed: boolean;
  monopalletAllowed: boolean;
  supersafeAllowed: boolean;
}

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  timezone: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('tokens');
  const [tokens, setTokens] = useState<UserToken[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showToken, setShowToken] = useState<string | null>(null);

  // Формы
  const [newToken, setNewToken] = useState({
    category: 'SUPPLIES',
    token: '',
  });

  const [newWarehouse, setNewWarehouse] = useState({
    warehouseId: '',
    warehouseName: '',
    enabled: true,
    boxAllowed: true,
    monopalletAllowed: true,
    supersafeAllowed: true,
  });

  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    timezone: 'Europe/Moscow',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tokensRes, warehousesRes, profileRes] = await Promise.all([
        fetch('/api/tokens'),
        fetch('/api/warehouses'),
        fetch('/api/auth/me'),
      ]);

      if (tokensRes.ok) {
        const tokensData = await tokensRes.json();
        setTokens(tokensData.data?.tokens || []);
      }

      if (warehousesRes.ok) {
        const warehousesData = await warehousesRes.json();
        setWarehouses(warehousesData.data?.warehouses || []);
      }

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData.data?.user);
        setProfileForm({
          name: profileData.data?.user?.name || '',
          phone: profileData.data?.user?.phone || '',
          timezone: profileData.data?.user?.timezone || 'Europe/Moscow',
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToken = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newToken),
      });

      const data = await response.json();
      if (data.success) {
        setTokens([...tokens, data.data.token]);
        setNewToken({ category: 'SUPPLIES', token: '' });
        setError('');
      } else {
        setError(data.error || 'Ошибка добавления токена');
      }
    } catch (error) {
      setError('Ошибка добавления токена');
    }
  };

  const handleDeleteToken = async (tokenId: string) => {
    try {
      const response = await fetch(`/api/tokens/${tokenId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTokens(tokens.filter(t => t.id !== tokenId));
      }
    } catch (error) {
      console.error('Error deleting token:', error);
    }
  };

  const handleAddWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWarehouse),
      });

      const data = await response.json();
      if (data.success) {
        setWarehouses([...warehouses, data.data.warehouse]);
        setNewWarehouse({
          warehouseId: '',
          warehouseName: '',
          enabled: true,
          boxAllowed: true,
          monopalletAllowed: true,
          supersafeAllowed: true,
        });
        setError('');
      } else {
        setError(data.error || 'Ошибка добавления склада');
      }
    } catch (error) {
      setError('Ошибка добавления склада');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();
      if (data.success) {
        setProfile({ ...profile!, ...profileForm });
        setError('');
      } else {
        setError(data.error || 'Ошибка обновления профиля');
      }
    } catch (error) {
      setError('Ошибка обновления профиля');
    }
  };

  const tokenCategories = [
    { value: 'SUPPLIES', label: 'Поставки (FBW)' },
    { value: 'MARKETPLACE', label: 'Маркетплейс (FBS)' },
    { value: 'STATISTICS', label: 'Статистика' },
    { value: 'ANALYTICS', label: 'Аналитика' },
    { value: 'CONTENT', label: 'Контент' },
    { value: 'PROMOTION', label: 'Продвижение' },
    { value: 'FINANCE', label: 'Финансы' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
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
          <div className="flex items-center space-x-4">
            <Settings className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Настройки
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Управление токенами, складами и профилем
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'tokens', label: 'Токены WB API', icon: Key },
            { id: 'warehouses', label: 'Склады', icon: Warehouse },
            { id: 'profile', label: 'Профиль', icon: User },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center space-x-2"
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Tokens Tab */}
        {activeTab === 'tokens' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Добавить токен WB API</CardTitle>
                <CardDescription>
                  Добавьте токены из личного кабинета WB для работы с API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddToken} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Категория</Label>
                      <select
                        id="category"
                        value={newToken.category}
                        onChange={(e) => setNewToken({ ...newToken, category: e.target.value })}
                        className="form-input"
                      >
                        {tokenCategories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="token">Токен</Label>
                      <Input
                        id="token"
                        type="password"
                        value={newToken.token}
                        onChange={(e) => setNewToken({ ...newToken, token: e.target.value })}
                        placeholder="Введите токен из ЛК WB"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit">
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить токен
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Мои токены</CardTitle>
                <CardDescription>
                  Управление токенами WB API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tokens.map((token) => (
                    <div
                      key={token.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium">
                            {tokenCategories.find(c => c.value === token.category)?.label}
                          </h3>
                          {token.isActive ? (
                            <Badge variant="success">Активен</Badge>
                          ) : (
                            <Badge variant="secondary">Неактивен</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          Токен: {showToken === token.id ? token.tokenEncrypted : '••••••••'}
                        </p>
                        <p className="text-xs text-gray-400">
                          Создан: {new Date(token.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowToken(showToken === token.id ? null : token.id)}
                        >
                          {showToken === token.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteToken(token.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {tokens.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      Токены не добавлены
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Warehouses Tab */}
        {activeTab === 'warehouses' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Добавить склад</CardTitle>
                <CardDescription>
                  Добавьте склады для мониторинга слотов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddWarehouse} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="warehouseId">ID склада</Label>
                      <Input
                        id="warehouseId"
                        type="number"
                        value={newWarehouse.warehouseId}
                        onChange={(e) => setNewWarehouse({ ...newWarehouse, warehouseId: e.target.value })}
                        placeholder="123"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="warehouseName">Название склада</Label>
                      <Input
                        id="warehouseName"
                        value={newWarehouse.warehouseName}
                        onChange={(e) => setNewWarehouse({ ...newWarehouse, warehouseName: e.target.value })}
                        placeholder="Склад WB Москва"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Типы тары</Label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newWarehouse.boxAllowed}
                          onChange={(e) => setNewWarehouse({ ...newWarehouse, boxAllowed: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">Box</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newWarehouse.monopalletAllowed}
                          onChange={(e) => setNewWarehouse({ ...newWarehouse, monopalletAllowed: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">Monopallet</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newWarehouse.supersafeAllowed}
                          onChange={(e) => setNewWarehouse({ ...newWarehouse, supersafeAllowed: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">Supersafe</span>
                      </label>
                    </div>
                  </div>
                  <Button type="submit">
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить склад
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Мои склады</CardTitle>
                <CardDescription>
                  Управление складами для мониторинга
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {warehouses.map((warehouse) => (
                    <div
                      key={warehouse.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium">{warehouse.name}</h3>
                          {warehouse.enabled ? (
                            <Badge variant="success">Активен</Badge>
                          ) : (
                            <Badge variant="secondary">Неактивен</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          ID: {warehouse.id}
                        </p>
                        <div className="flex space-x-2 mt-2">
                          {warehouse.boxAllowed && <Badge variant="outline">Box</Badge>}
                          {warehouse.monopalletAllowed && <Badge variant="outline">Monopallet</Badge>}
                          {warehouse.supersafeAllowed && <Badge variant="outline">Supersafe</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {warehouses.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      Склады не добавлены
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Профиль пользователя</CardTitle>
                <CardDescription>
                  Управление личными данными
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Имя</Label>
                      <Input
                        id="name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder="Ваше имя"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Часовой пояс</Label>
                    <select
                      id="timezone"
                      value={profileForm.timezone}
                      onChange={(e) => setProfileForm({ ...profileForm, timezone: e.target.value })}
                      className="form-input"
                    >
                      <option value="Europe/Moscow">Москва (UTC+3)</option>
                      <option value="Europe/Kiev">Киев (UTC+2)</option>
                      <option value="Asia/Yekaterinburg">Екатеринбург (UTC+5)</option>
                      <option value="Asia/Novosibirsk">Новосибирск (UTC+7)</option>
                    </select>
                  </div>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить изменения
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
