export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black">
      {/* ヘッダー */}
      <header className="p-6 flex justify-between items-center">
        <div className="text-2xl font-bold">Choku Works</div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#about" className="hover:text-blue-500 transition-colors">About</a></li>
            <li><a href="#works" className="hover:text-blue-500 transition-colors">Works</a></li>
            <li><a href="#contact" className="hover:text-blue-500 transition-colors">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-6 py-12">
        {/* ヒーローセクション */}
        <section className="text-center py-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to My Portfolio</h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Web開発の旅を始めたばかりです。このサイトは私の学習の過程で作成したプロジェクトを紹介するポートフォリオです。
          </p>
        </section>

        {/* About セクション */}
        <section id="about" className="py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-3xl mx-auto">
            <p className="text-lg mb-4">
              はじめまして！私はプログラミング経験者ですが、Web開発は初心者です。
              このポートフォリオサイトはNext.jsとTailwind CSSを使って作成しています。
            </p>
            <p className="text-lg">
              新しい技術を学ぶことが好きで、特にフロントエンド開発に興味を持っています。
              これからもっと多くのプロジェクトに挑戦していきたいと思っています。
            </p>
          </div>
        </section>

        {/* Works セクション */}
        <section id="works" className="py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">My Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* プロジェクト1 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">ポートフォリオサイト</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Next.jsとTailwind CSSを使って作成した最初のプロジェクト。
                </p>
                <div className="flex space-x-2">
                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded">Next.js</span>
                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded">Tailwind CSS</span>
                </div>
              </div>
            </div>
            
            {/* プロジェクト2: Glowbie */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-indigo-900 flex items-center justify-center">
                <div className="text-white text-4xl">✨ Glowbie ✨</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Glowbie</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  カメラで顔をキャプチャし、ホタルのような光の演出を加えるWebアプリ。
                </p>
                <div className="flex space-x-2 mb-4">
                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded">Next.js</span>
                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded">Three.js</span>
                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded">WebGL</span>
                </div>
                <a 
                  href="/glowbie" 
                  className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                >
                  体験する
                </a>
              </div>
            </div>
            
            {/* プロジェクト3（プレースホルダー） */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  次のプロジェクトを計画中です。
                </p>
                <div className="flex space-x-2">
                  <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded">準備中</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact セクション */}
        <section id="contact" className="py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Contact</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-3xl mx-auto">
            <p className="text-center text-lg mb-6">
              お問い合わせやコラボレーションのご提案があれば、以下からご連絡ください。
            </p>
            <div className="flex justify-center">
              <a
                href="https://github.com/Kitaokan"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2025 Choku Works. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
