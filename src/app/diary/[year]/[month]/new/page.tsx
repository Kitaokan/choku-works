import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/app/diary/utils';
import NewEntryForm from '@/app/diary/components/NewEntryForm';

interface NewEntryPageProps {
  params: {
    year: string;
    month: string;
  };
  searchParams: Record<string, string>;
}

export default async function NewEntryPage({ params, searchParams }: NewEntryPageProps) {
  const { year, month } = params;

  // 認証チェック - 認証されていない場合は月別ページにリダイレクト
  if (!isAuthenticated(new Request(
    `https://chokuworks.com/diary/${year}/${month}/new?${new URLSearchParams(searchParams).toString()}`,
    { method: 'GET' }
  ))) {
    redirect(`/diary/${year}/${month}`);
  }

  // 今日の日付を取得（年月日）
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
  
  // 現在の年月が選択された年月と一致するか確認
  const currentYear = today.getFullYear().toString();
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
  
  // 選択された年月が現在の年月と一致しない場合、デフォルト日を1日に設定
  const defaultDate = (currentYear === year && currentMonth === month) 
    ? formattedToday 
    : `${year}-${month}-01`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
        <div className="container mx-auto flex items-center space-x-4">
          <Link 
            href={`/diary/${year}/${month}`} 
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            ← 戻る
          </Link>
          <h1 className="text-2xl font-bold">新しい日記を書く</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-3xl mx-auto">
          <NewEntryForm year={year} month={month} defaultDate={defaultDate} />
        </div>
      </main>
    </div>
  );
}