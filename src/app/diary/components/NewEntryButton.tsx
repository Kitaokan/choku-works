'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface NewEntryButtonProps {
  year: string;
  month: string;
}

const NewEntryButton: React.FC<NewEntryButtonProps> = ({ year, month }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/diary/${year}/${month}/new?auth=admin`);
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      新規作成
    </button>
  );
};

export default NewEntryButton;