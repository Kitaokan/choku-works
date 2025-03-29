'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface NewEntryFormProps {
  year: string;
  month: string;
  defaultDate: string;
}

const NewEntryForm: React.FC<NewEntryFormProps> = ({ 
  year, 
  month, 
  defaultDate 
}) => {
  const router = useRouter();
  
  const [date, setDate] = useState(defaultDate);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 日付の有効性チェック (当月内であることを確認)
  const isValidDate = () => {
    const selectedDate = new Date(date);
    const selectedMonth = selectedDate.getMonth() + 1;
    const selectedYear = selectedDate.getFullYear();

    return (
      selectedYear === parseInt(year) &&
      selectedMonth === parseInt(month)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidDate()) {
      setError(`選択した日付は${year}年${month}月の範囲内である必要があります。`);
      return;
    }

    if (!content.trim()) {
      setError('日記の内容を入力してください。');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // APIエンドポイントに投稿データを送信
      const response = await fetch('/api/diary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          content,
          auth: 'admin' // デモ用の簡易認証
        }),
      });

      if (!response.ok) {
        throw new Error('エントリーの保存に失敗しました。');
      }

      // 保存成功後、月別ページにリダイレクト
      router.push(`/diary/${year}/${month}`);
      router.refresh(); // データが更新されたのでページを再読み込み
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました。');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-2">
          日付
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          日記の内容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 resize-y"
          placeholder="今日の出来事や思ったことを書いてください..."
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '保存中...' : '保存する'}
        </button>
      </div>
    </form>
  );
};

export default NewEntryForm;