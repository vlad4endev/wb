'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
<<<<<<< Updated upstream
import {
  FiShield as Shield,
  FiCheckCircle as CheckCircle,
  FiAlertCircle as AlertCircle,
  FiLoader2 as Loader2,
  FiExternalLink as ExternalLink,
  FiX as X
} from 'react-icons/fi';
=======
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  X
} from 'lucide-react';
>>>>>>> Stashed changes

interface WBAuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (sessionId: string) => void;
}

export default function WBAuthPopup({ isOpen, onClose, onSuccess }: WBAuthPopupProps) {
  const [status, setStatus] = useState<'idle' | 'opening' | 'waiting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [popupWindow, setPopupWindow] = useState<Window | null>(null);
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen && status === 'idle') {
      openWBAuth();
    }

    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      if (popupWindow && !popupWindow.closed) {
        popupWindow.close();
      }
    };
  }, [isOpen]);

  const openWBAuth = async () => {
    try {
      setStatus('opening');
      setError('');

      // Открываем popup окно с WB
      const popup = window.open(
        'https://seller.wildberries.ru/',
        'wb-auth',
        'width=800,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Не удалось открыть окно авторизации. Проверьте блокировщик всплывающих окон.');
      }

      setPopupWindow(popup);
      setStatus('waiting');

      // Добавляем обработчик сообщений от popup окна
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== 'https://seller.wildberries.ru') return;
        
        if (event.data.type === 'WB_AUTH_SUCCESS') {
          clearInterval(interval);
          popup.close();
          window.removeEventListener('message', messageHandler);
          createWBSession();
        }
      };

      window.addEventListener('message', messageHandler);

      // Добавляем дополнительную проверку через postMessage
      const postMessageInterval = setInterval(() => {
        try {
          if (!popup.closed) {
            // Отправляем сообщение в popup для проверки статуса авторизации
            popup.postMessage({ type: 'CHECK_AUTH_STATUS' }, 'https://seller.wildberries.ru');
          }
        } catch (e) {
          // Игнорируем ошибки CORS
        }
      }, 2000);

      // Очищаем postMessage interval при закрытии
      setTimeout(() => {
        clearInterval(postMessageInterval);
      }, 60000); // 1 минута максимум

      // Начинаем проверку статуса авторизации с более частой проверкой
      const interval = setInterval(async () => {
        try {
          // Проверяем, не закрыто ли окно
          if (popup.closed) {
            clearInterval(interval);
            setStatus('idle');
            return;
          }

          // Пытаемся получить URL popup окна для проверки авторизации
          try {
            const popupUrl = popup.location.href;
            console.log('Checking popup URL:', popupUrl);
            
            // Проверяем, что мы на главной странице WB (после авторизации)
            if (popupUrl.includes('seller.wildberries.ru') && 
                !popupUrl.includes('login') && 
                !popupUrl.includes('auth') &&
                !popupUrl.includes('signin') &&
                !popupUrl.includes('register')) {
              
              console.log('WB login detected via URL, creating session...');
              clearInterval(interval);
              popup.close();
              
              // Получаем cookies и создаем сессию
              await createWBSession();
              return;
            }
          } catch (e) {
            // CORS ошибка - это нормально, продолжаем проверку
            console.log('CORS error checking popup URL, continuing...');
          }

          // Альтернативная проверка - проверяем cookies в основном окне
          const wbCookies = document.cookie
            .split(';')
            .some(cookie => 
              cookie.trim().startsWith('WBToken') || 
              cookie.trim().startsWith('x-supplier-id') ||
              cookie.trim().startsWith('WBToken') ||
              cookie.trim().startsWith('WBToken=') ||
              cookie.trim().startsWith('x-supplier-id=')
            );

          if (wbCookies) {
            console.log('WB cookies detected, creating session...');
            clearInterval(interval);
            popup.close();
            
            // Получаем cookies и создаем сессию
            await createWBSession();
          }
        } catch (error) {
          // Игнорируем ошибки CORS при проверке URL
          // Это нормально, так как мы не можем получить доступ к URL из другого домена
          console.log('Error in auth check:', error);
        }
      }, 1000); // Увеличиваем частоту проверки до 1 секунды

      setCheckInterval(interval);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка открытия окна авторизации');
      setStatus('error');
    }
  };

  const createWBSession = async () => {
    try {
      setStatus('opening');

      // Получаем все cookies
      const allCookies = document.cookie;
      
      // Получаем localStorage и sessionStorage
      const localStorageData = getStorageData('localStorage');
      const sessionStorageData = getStorageData('sessionStorage');
      
      // Создаем сессию на сервере с автоматическим извлечением куки
      const response = await fetch('/api/wb-auth/create-session-with-cookies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Передаем информацию о браузере и cookies
          userAgent: navigator.userAgent,
          ipAddress: await getClientIP(),
          cookies: allCookies,
          localStorage: localStorageData,
          sessionStorage: sessionStorageData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        onSuccess(data.data.sessionId);
        
        // Закрываем popup через 2 секунды
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error(data.error || 'Ошибка создания сессии');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка создания сессии');
      setStatus('error');
    }
  };

  const getStorageData = (storageType: 'localStorage' | 'sessionStorage'): Record<string, any> => {
    try {
      const storage = storageType === 'localStorage' ? window.localStorage : window.sessionStorage;
      const data: Record<string, any> = {};
      
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) {
          try {
            data[key] = storage.getItem(key);
          } catch (e) {
            // Игнорируем ошибки доступа к некоторым ключам
            console.warn(`Cannot access ${storageType} key: ${key}`);
          }
        }
      }
      
      return data;
    } catch (error) {
      console.warn(`Cannot access ${storageType}:`, error);
      return {};
    }
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  const handleClose = () => {
    if (checkInterval) {
      clearInterval(checkInterval);
    }
    if (popupWindow && !popupWindow.closed) {
      popupWindow.close();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle>Авторизация в WB</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={status === 'opening' || status === 'waiting'}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            Войдите в личный кабинет Wildberries для сохранения сессии
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'idle' && (
            <div className="text-center py-4">
              <Button onClick={openWBAuth} className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Открыть WB в новом окне
              </Button>
            </div>
          )}

          {status === 'opening' && (
            <div className="text-center py-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-sm text-gray-600">Открываем окно авторизации...</p>
            </div>
          )}

          {status === 'waiting' && (
            <div className="text-center py-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-sm text-gray-600 mb-2">Ожидаем авторизации в WB...</p>
              <p className="text-xs text-gray-500 mb-4">
                Войдите в личный кабинет в открывшемся окне. 
                <br />
                <span className="text-blue-600 font-medium">Система автоматически определит успешный вход!</span>
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={createWBSession}
                  className="text-xs w-full"
                >
                  🔍 Проверить авторизацию вручную
                </Button>
                <p className="text-xs text-gray-400">
                  Автоматическая проверка каждую секунду
                </p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-4">
              <CheckCircle className="w-8 h-8 mx-auto mb-4 text-green-500" />
              <p className="text-sm text-green-600 font-medium">
                Авторизация успешна!
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Сессия сохранена и готова к использованию
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mt-3">
                <p className="text-xs text-green-700 dark:text-green-300 font-medium mb-1">
                  ✅ Куки автоматически извлечены и сохранены
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Система готова к автобронированию слотов
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {status === 'waiting' && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={handleClose}
                className="text-sm"
              >
                Отменить
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
