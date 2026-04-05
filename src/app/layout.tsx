import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LipColor 美妆色号大全",
  description: "浏览各大美妆品牌口红色号，查看真实色卡，找到你的完美唇色",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 text-gray-900 antialiased min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">💄</span>
              <span className="text-xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                LipColor
              </span>
              <span className="text-sm text-gray-500 hidden sm:inline">美妆色号大全</span>
            </a>
            <nav className="flex items-center gap-4 text-sm">
              <a href="/" className="text-gray-600 hover:text-rose-500 transition">首页</a>
              <a href="/brands" className="text-gray-600 hover:text-rose-500 transition">品牌</a>
              <a href="/search" className="text-gray-600 hover:text-rose-500 transition">搜索</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
            <p>💄 LipColor 美妆色号大全 — 帮你找到完美唇色</p>
            <p className="mt-1">色号仅供参考，实际颜色因屏幕显示可能有差异</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
