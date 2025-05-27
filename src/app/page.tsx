import Image from "next/image";
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          マイ・ボイス・ナビゲーター
        </h1>
        <p className="text-xl text-center mb-12">
          あなたの声を政治に。もっと身近に、もっと考えて。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-6 border rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">初めての方へ</h2>
            <p className="mb-4">
              政治や選挙について詳しくなくても大丈夫。
              一緒に考えながら、あなたの声を届けましょう。
            </p>
            <Link
              href="/chat"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              はじめる
            </Link>
          </div>
          <div className="p-6 border rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">選挙について知る</h2>
            <p className="mb-4">
              選挙の仕組みや投票方法について、
              わかりやすく解説しています。
            </p>
            <Link
              href="/chat?q=選挙の仕組みについて教えてください"
              className="inline-block bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
            >
              詳しく見る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
