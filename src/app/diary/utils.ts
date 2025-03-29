import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 日記データの型定義
export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD形式
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiaryMonth {
  id: string;
  year: string;
  month: string;
  entryCount: number;
}

// データファイルのパス
const DATA_DIR = path.join(process.cwd(), 'data', 'diary');
const MONTHS_FILE = path.join(DATA_DIR, 'months.json');

// 初期化 - 必要なディレクトリを作成
export const initializeDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    // monthsファイルが存在しない場合は作成
    try {
      await fs.access(MONTHS_FILE);
    } catch {
      await fs.writeFile(MONTHS_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error('初期化エラー:', error);
  }
};

// 月別データの取得
export const getDiaryMonths = async (): Promise<DiaryMonth[]> => {
  await initializeDataDir();
  
  try {
    const data = await fs.readFile(MONTHS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('月別データ取得エラー:', error);
    return [];
  }
};

// 特定の年月の日記エントリーを取得
export const getDiaryEntriesByMonth = async (year: string, month: string): Promise<DiaryEntry[]> => {
  await initializeDataDir();
  
  const filePath = path.join(DATA_DIR, `${year}-${month}.json`);
  
  try {
    await fs.access(filePath);
    const data = await fs.readFile(filePath, 'utf-8');
    const entries = JSON.parse(data) as DiaryEntry[];
    // 日付の新しい順にソート
    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    // ファイルが存在しない場合は空の配列を返す
    return [];
  }
};

// 新しい日記エントリーを追加
export const addDiaryEntry = async (date: string, content: string): Promise<DiaryEntry> => {
  await initializeDataDir();
  
  // 日付からyear-month部分を抽出
  const [year, month] = date.split('-');
  const filePath = path.join(DATA_DIR, `${year}-${month}.json`);
  
  // 新しいエントリーの作成
  const timestamp = new Date().toISOString();
  const newEntry: DiaryEntry = {
    id: uuidv4(),
    date,
    content,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  
  // 既存のエントリーを取得、またはファイルを新規作成
  let entries: DiaryEntry[] = [];
  try {
    await fs.access(filePath);
    const data = await fs.readFile(filePath, 'utf-8');
    entries = JSON.parse(data);
  } catch {
    // ファイルが存在しない場合は何もしない
  }
  
  // 新しいエントリーを追加して保存
  entries.push(newEntry);
  await fs.writeFile(filePath, JSON.stringify(entries, null, 2));
  
  // monthsデータを更新
  await updateMonthsData(year, month, entries.length);
  
  return newEntry;
};

// months.jsonを更新
const updateMonthsData = async (year: string, month: string, entryCount: number) => {
  try {
    const data = await fs.readFile(MONTHS_FILE, 'utf-8');
    let months: DiaryMonth[] = JSON.parse(data);
    
    const existingMonthIndex = months.findIndex(m => m.year === year && m.month === month);
    
    if (existingMonthIndex >= 0) {
      // 既存の月データを更新
      months[existingMonthIndex].entryCount = entryCount;
    } else {
      // 新しい月データを追加
      months.push({
        id: uuidv4(),
        year,
        month,
        entryCount
      });
    }
    
    // 年と月の降順でソート
    months.sort((a, b) => {
      if (a.year === b.year) {
        return parseInt(b.month) - parseInt(a.month);
      }
      return parseInt(b.year) - parseInt(a.year);
    });
    
    await fs.writeFile(MONTHS_FILE, JSON.stringify(months, null, 2));
  } catch (error) {
    console.error('月別データ更新エラー:', error);
  }
};

// 認証チェック
export const isAuthenticated = (request: Request): boolean => {
  // 本番環境ではcookieや環境変数を使った適切な認証を実装する
  // 今回はデモとして簡易的なものを用意
  const url = new URL(request.url);
  // ?auth=admin のようにクエリパラメータでチェック（デモ用）
  return url.searchParams.get('auth') === 'admin';
};
