'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';

interface NavigationProps {
  currentPage: string;
}

const navItems = [
  { href: '/', label: '封面', id: 'home' },
  { href: '/matches', label: '赛程', id: 'matches' },
  { href: '/standings', label: '积分', id: 'standings' },
  { href: '/teams', label: '球队', id: 'teams' },
  { href: '/odds', label: '指数', id: 'odds' },
  { href: '/knockout', label: '淘汰赛', id: 'knockout' },
];

export default function Navigation({ currentPage }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#060910]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3" onClick={closeMobile}>
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--wc-emerald)] text-[10px] font-black text-[var(--wc-emerald)]">
              26
            </span>
            <span>
              <span className="block text-sm font-black tracking-[-0.03em] text-white">RAGNARÖK</span>
              <span className="block font-mono text-[8px] tracking-[0.18em] text-[var(--wc-text-muted)]">TWILIGHT OF THE GODS</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                  currentPage === item.id
                    ? 'bg-[var(--wc-emerald)] text-[#04110a]'
                    : 'text-[var(--wc-text-secondary)] hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            className="rounded-full border border-white/10 p-2 text-white md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {mobileOpen
                ? <path strokeLinecap="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div id="mobile-nav" className="grid grid-cols-2 gap-2 border-t border-white/10 py-4 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={closeMobile}
                className={`rounded-xl px-4 py-3 text-sm font-bold ${
                  currentPage === item.id
                    ? 'bg-[var(--wc-emerald)] text-[#04110a]'
                    : 'bg-white/5 text-[var(--wc-text-secondary)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
