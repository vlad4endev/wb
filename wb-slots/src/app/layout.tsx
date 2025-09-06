import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WB Slots - Автоматическое бронирование слотов Wildberries',
  description: 'Удобный интерфейс для поиска и авто-бронирования слотов поставки на Wildberries (FBW)',
  keywords: 'wildberries, wb, slots, booking, automation, fbw, supplies',
  authors: [{ name: 'WB Slots Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {children}
        </div>
      </body>
    </html>
  );
}
