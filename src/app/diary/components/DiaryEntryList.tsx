import React from 'react';
import { DiaryEntry } from '../utils';

interface DiaryEntryListProps {
  entries: DiaryEntry[];
}

const DiaryEntryList: React.FC<DiaryEntryListProps> = ({ entries }) => {
  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    return `${day}日(${dayOfWeek})`;
  };

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {entries.map((entry) => (
        <article key={entry.id} className="p-6">
          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatDate(entry.date)}
            </h3>
            
            <div className="prose dark:prose-invert max-w-none">
              {entry.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-2 text-gray-700 dark:text-gray-300">
                  {paragraph}
                </p>
              ))}
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              {new Date(entry.createdAt).toLocaleString('ja-JP')}に投稿
              {entry.updatedAt !== entry.createdAt && 
                ` (${new Date(entry.updatedAt).toLocaleString('ja-JP')}に更新)`
              }
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default DiaryEntryList;
