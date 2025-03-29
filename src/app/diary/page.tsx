import React from 'react';
import Link from 'next/link';
import { getDiaryMonths } from '@/app/diary/utils';

export default async function DiaryPage() {
  const months = await getDiaryMonths();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold hover:text-blue-500 transition-colors">
            Choku Works
          </Link>
          <h1 className="text-2xl font-bold">日記</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">アーカイブ</h2>
          
          {months.length > 0 ? (
            <ul className="space-y-3">
              {months.map((month) => (
                <li key={month.id}>
                  <Link 
                    href={`/diary/${month.year}/${month.month}`}
                    className="block p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {month.year}年{month.month}月
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">まだ日記のエントリーがありません。</p>
          )}
        </div>
      </main>
    </div>
  );
}