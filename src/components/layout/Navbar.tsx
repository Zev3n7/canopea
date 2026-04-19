// src/components/layout/Navbar.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Github, Leaf } from 'lucide-react'

const links = [
  { href: '/',            label: 'Inicio' },
  { href: '/monitoring',  label: 'Monitoreo' },
  { href: '/credits',     label: 'Créditos' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open,      setOpen]      = useState(false)
  const [scrolled,  setScrolled]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg-dark/95 backdrop-blur-md border-b border-border-green' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-lime/10 border border-lime/30 flex items-center justify-center group-hover:bg-lime/20 transition-colors">
              <Leaf className="w-4 h-4 text-lime" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              <span className="text-lime">CANO</span>
              <span className="text-cyan">PEA</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === href
                    ? 'bg-lime/10 text-lime border border-lime/20'
                    : 'text-text2 hover:text-text hover:bg-surface'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-green text-text2 hover:text-lime hover:border-lime/40 transition-all text-sm"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime/5 border border-lime/20">
              <span className="w-2 h-2 rounded-full bg-lime dot-pulse" />
              <span className="text-xs text-lime font-mono">LIVE</span>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-text2 hover:text-text hover:bg-surface transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-border-green mt-2 pt-4 space-y-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href ? 'bg-lime/10 text-lime' : 'text-text2 hover:text-text hover:bg-surface'
                }`}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-text2 hover:text-lime transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
