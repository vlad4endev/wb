'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FiLoader2 as Loader2,
  FiSearch as Search,
  FiBookOpen as BookOpen,
  FiMessageSquare as MessageSquare,
  FiPlay as Play,
  FiSquare as Square,
  FiCheckCircle as CheckCircle,
  FiXCircle as XCircle
} from 'react-icons/fi';

export default function TestServicesPage() {
  const [slotSearchStatus, setSlotSearchStatus] = useState<any>(null);
  const [bookingStatus, setBookingStatus] = useState<any>(null);
  const [telegramStatus, setTelegramStatus] = useState<any>(null);
  
  // Отдельные состояния загрузки для каждого сервиса
  const [isSlotSearchLoading, setIsSlotSearchLoading] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [isTelegramLoading, setIsTelegramLoading] = useState(false);
  
  // Отдельные состояния ошибок для каждого сервиса
  const [slotSearchError, setSlotSearchError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [telegramError, setTelegramError] = useState<string | null>(null);
  
  // Отдельные результаты для каждого сервиса
  const [slotSearchResult, setSlotSearchResult] = useState<any>(null);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [telegramResult, setTelegramResult] = useState<any>(null);

  // Slot Search Service
  const handleSlotSearch = async () => {
    setIsSlotSearchLoading(true);
    setSlotSearchError(null);
    setSlotSearchResult(null);

    try {
      const response = await fetch('/api/services/slot-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: 'test-slot-search',
          warehouseIds: [301983],
          boxTypeIds: [5],
          coefficientMin: -1,
          coefficientMax: 0,
          dateFrom: new Date().toISOString(),
          dateTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          stopOnFirstFound: true,
          isSortingCenter: false,
          maxSearchCycles: 3,
          searchDelay: 5000,
          maxExecutionTime: 60000,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSlotSearchResult(data.data);
        setSlotSearchStatus(data.data);
      } else {
        setSlotSearchError(data.error || 'Ошибка поиска слотов');
      }
    } catch (err) {
      setSlotSearchError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setIsSlotSearchLoading(false);
    }
  };

  const handleStopSlotSearch = async () => {
    try {
      const response = await fetch('/api/services/slot-search', {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setSlotSearchStatus({ ...slotSearchStatus, isSearchInProgress: false });
        setSlotSearchError(null);
      } else {
        setSlotSearchError(data.error || 'Ошибка остановки поиска');
      }
    } catch (err) {
      setSlotSearchError(err instanceof Error ? err.message : 'Ошибка остановки поиска');
    }
  };

  const handleGetSlotSearchStatus = async () => {
    try {
      const response = await fetch('/api/services/slot-search');
      const data = await response.json();
      if (data.success) {
        setSlotSearchStatus(data.data);
        setSlotSearchError(null);
      } else {
        setSlotSearchError(data.error || 'Ошибка получения статуса');
      }
    } catch (err) {
      setSlotSearchError(err instanceof Error ? err.message : 'Ошибка получения статуса');
    }
  };

  // Auto Booking Service
  const handleBooking = async () => {
    setIsBookingLoading(true);
    setBookingError(null);
    setBookingResult(null);

    try {
      const response = await fetch('/api/services/auto-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: 'test-booking',
          runId: 'test-run-id',
          slotId: 'test-slot-id',
          supplyId: 'test-supply-id',
          warehouseId: 301983,
          boxTypeId: 5,
          date: new Date().toISOString(),
          coefficient: 0,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setBookingResult(data.data);
        setBookingStatus(data.data);
      } else {
        setBookingError(data.error || 'Ошибка бронирования');
      }
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handleStopBooking = async () => {
    try {
      const response = await fetch('/api/services/auto-booking', {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setBookingStatus({ ...bookingStatus, isBookingInProgress: false });
        setBookingError(null);
      } else {
        setBookingError(data.error || 'Ошибка остановки бронирования');
      }
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Ошибка остановки бронирования');
    }
  };

  const handleGetBookingStatus = async () => {
    try {
      const response = await fetch('/api/services/auto-booking');
      const data = await response.json();
      if (data.success) {
        setBookingStatus(data.data);
        setBookingError(null);
      } else {
        setBookingError(data.error || 'Ошибка получения статуса');
      }
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Ошибка получения статуса');
    }
  };

  // Telegram Service
  const handleSendNotification = async () => {
    setIsTelegramLoading(true);
    setTelegramError(null);
    setTelegramResult(null);

    try {
      const response = await fetch('/api/services/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: '🧪 Тестовое уведомление от разделенных сервисов!\n\n✅ SlotSearchService работает\n✅ AutoBookingService работает\n✅ TelegramService работает',
          type: 'TASK_COMPLETED',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTelegramResult(data);
        setTelegramStatus({ isConfigured: true, lastSent: new Date().toISOString() });
      } else {
        setTelegramError(data.error || 'Ошибка отправки уведомления');
      }
    } catch (err) {
      setTelegramError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setIsTelegramLoading(false);
    }
  };

  const handleGetTelegramStatus = async () => {
    try {
      const response = await fetch('/api/services/telegram');
      const data = await response.json();
      if (data.success) {
        setTelegramStatus(data.data);
        setTelegramError(null);
      } else {
        setTelegramError(data.error || 'Ошибка получения статуса');
      }
    } catch (err) {
      setTelegramError(err instanceof Error ? err.message : 'Ошибка получения статуса');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Тестирование разделенных сервисов</h1>
        <p className="text-muted-foreground">
          Тестирование SlotSearchService, AutoBookingService и TelegramService
        </p>
      </div>

      {/* Показываем ошибки для каждого сервиса отдельно */}
      {slotSearchError && (
        <Alert className="mb-4" variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>SlotSearchService: {slotSearchError}</AlertDescription>
        </Alert>
      )}
      {bookingError && (
        <Alert className="mb-4" variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>AutoBookingService: {bookingError}</AlertDescription>
        </Alert>
      )}
      {telegramError && (
        <Alert className="mb-4" variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>TelegramService: {telegramError}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SlotSearchService */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              SlotSearchService
            </CardTitle>
            <CardDescription>
              Сервис поиска слотов Wildberries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={handleSlotSearch}
                disabled={isSlotSearchLoading}
                className="flex-1"
              >
                {isSlotSearchLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Запустить поиск
              </Button>
              <Button
                onClick={handleStopSlotSearch}
                variant="outline"
                disabled={!slotSearchStatus?.isSearchInProgress}
              >
                <Square className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={handleGetSlotSearchStatus}
              variant="outline"
              className="w-full"
            >
              Получить статус
            </Button>

            {slotSearchStatus && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={slotSearchStatus.isSearchInProgress ? "default" : "secondary"}>
                    {slotSearchStatus.isSearchInProgress ? "Активен" : "Неактивен"}
                  </Badge>
                  {slotSearchStatus.isStopRequested && (
                    <Badge variant="destructive">Остановка запрошена</Badge>
                  )}
                </div>
                {slotSearchStatus.foundSlots !== undefined && (
                  <div className="text-sm text-muted-foreground">
                    Найдено слотов: {slotSearchStatus.foundSlots}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AutoBookingService */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              AutoBookingService
            </CardTitle>
            <CardDescription>
              Сервис автоматического бронирования
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={handleBooking}
                disabled={isBookingLoading}
                className="flex-1"
              >
                {isBookingLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Запустить бронирование
              </Button>
              <Button
                onClick={handleStopBooking}
                variant="outline"
                disabled={!bookingStatus?.isBookingInProgress}
              >
                <Square className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={handleGetBookingStatus}
              variant="outline"
              className="w-full"
            >
              Получить статус
            </Button>

            {bookingStatus && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={bookingStatus.isBookingInProgress ? "default" : "secondary"}>
                    {bookingStatus.isBookingInProgress ? "Активен" : "Неактивен"}
                  </Badge>
                  {bookingStatus.success !== undefined && (
                    <Badge variant={bookingStatus.success ? "default" : "destructive"}>
                      {bookingStatus.success ? "Успешно" : "Ошибка"}
                    </Badge>
                  )}
                </div>
                {bookingStatus.bookingId && (
                  <div className="text-sm text-muted-foreground">
                    ID бронирования: {bookingStatus.bookingId}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* TelegramService */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              TelegramService
            </CardTitle>
            <CardDescription>
              Сервис уведомлений Telegram
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleSendNotification}
              disabled={isTelegramLoading}
              className="w-full"
            >
              {isTelegramLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
              Отправить уведомление
            </Button>

            <Button
              onClick={handleGetTelegramStatus}
              variant="outline"
              className="w-full"
            >
              Получить статус
            </Button>

            {telegramStatus && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={telegramStatus.isConfigured ? "default" : "secondary"}>
                    {telegramStatus.isConfigured ? "Настроен" : "Не настроен"}
                  </Badge>
                </div>
                {telegramStatus.lastSent && (
                  <div className="text-sm text-muted-foreground">
                    Последнее отправлено: {new Date(telegramStatus.lastSent).toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results - показываем результаты каждого сервиса отдельно */}
      {(slotSearchResult || bookingResult || telegramResult) && (
        <div className="mt-6 space-y-4">
          {slotSearchResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Результаты SlotSearchService
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={JSON.stringify(slotSearchResult, null, 2)}
                  readOnly
                  className="min-h-[150px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          )}
          
          {bookingResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Результаты AutoBookingService
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={JSON.stringify(bookingResult, null, 2)}
                  readOnly
                  className="min-h-[150px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          )}
          
          {telegramResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Результаты TelegramService
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={JSON.stringify(telegramResult, null, 2)}
                  readOnly
                  className="min-h-[150px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
