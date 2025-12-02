import type { Metadata } from 'next'

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
      <body style={{ margin: 0, padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
        <main style={{ maxWidth: '800px', margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  )
}

