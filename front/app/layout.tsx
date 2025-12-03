import type { Metadata } from 'next'
import './globals.css'

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
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  )
}

