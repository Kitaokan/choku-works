import { NextResponse } from 'next/server';
import { addDiaryEntry, isAuthenticated } from '@/app/diary/utils';

export async function POST(request: Request) {
  try {
    // リクエストボディを取得
    const body = await request.json();
    // auth は認証チェックで使用するため ESLint エラーを回避
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { date, content, auth } = body;

    // 認証チェック
    if (!isAuthenticated(new Request(request.url, { 
      method: 'POST',
      headers: request.headers
    }))) {
      return NextResponse.json(
        { error: '認証エラー: このアクションを実行する権限がありません。' },
        { status: 401 }
      );
    }

    // バリデーション
    if (!date || !content) {
      return NextResponse.json(
        { error: '日付と内容は必須です。' },
        { status: 400 }
      );
    }

    // 日付のフォーマットチェック (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: '日付は YYYY-MM-DD 形式で指定してください。' },
        { status: 400 }
      );
    }

    // 日記エントリーを追加
    const newEntry = await addDiaryEntry(date, content);

    return NextResponse.json({ success: true, entry: newEntry }, { status: 201 });
  } catch (error) {
    console.error('日記保存エラー:', error);
    return NextResponse.json(
      { error: '日記の保存中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}