'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/Logo'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="app-header">
      <div className="app-header-container">
        <Link href="/" className="app-header-logo-link">
          <Logo size={40} className="app-header-logo" />
          <div className="app-header-title-group">
            <span className="app-header-title">Houjin Align</span>
            <span className="app-header-subtitle">法人情報チェックツール</span>
          </div>
        </Link>
        <nav className="app-header-nav">
          <Link
            href="/"
            className={`app-header-nav-link ${pathname === '/' ? 'active' : ''}`}
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            ホーム
          </Link>
          <Link
            href="/about"
            className={`app-header-nav-link ${pathname === '/about' ? 'active' : ''}`}
            aria-current={pathname === '/about' ? 'page' : undefined}
          >
            このツールについて
          </Link>
        </nav>
      </div>
    </header>
  )
}

