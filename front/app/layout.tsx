import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'

export const metadata: Metadata = {
  title: 'Houjin Align',
  description: '法人情報チェックツール（MVP）',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main className="main-container">
          {children}
        </main>
      </body>
    </html>
  )
}

