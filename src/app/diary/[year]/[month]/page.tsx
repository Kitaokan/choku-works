import React from 'react';
import Link from 'next/link';
import { getDiaryEntriesByMonth } from '@/app/diary/utils';
import DiaryEntryList from '@/app/diary/components/DiaryEntryList';
import NewEntryButton from '@/app/diary/components/NewEntryButton';

interface Params {
  year: string;
  month: string;
}

export default async function MonthlyDiaryPage({ 
  params 
}: { 
  params: Params 
}) {
  const { year, month } = params;
  const entries = await getDiaryEntriesByMonth(year, month);

  // 日付でソートされたエントリーを準備
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/diary" className="text-blue-500 hover:text-blue-600 transition-colors">
              ← 戻る
            </Link>
            <h1 className="text-2xl font-bold">{year}年{month}月の日記</h1>
          </div>

          <NewEntryButton year={year} month={month} />
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow max-w-3xl mx-auto">
          {sortedEntries.length > 0 ? (
            <DiaryEntryList entries={sortedEntries} />
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              この月の日記はまだありません。
            </div>
          )}
        </div>
      </main>
    </div>
  );
}