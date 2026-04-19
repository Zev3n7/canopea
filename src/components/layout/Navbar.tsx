// src/components/layout/Navbar.tsx
// Navbar horizontal fijo — diseño formal tech
// ─────────────────────────────────────────────
'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Leaf, Menu, X } from 'lucide-react'
import { gsap } from 'gsap'

const links = [
  { href: '/',           label: 'Inicio'    },
  { href: '/monitoring', label: 'Monitoreo' },
  { href: '/guia',       label: 'Guía'      },
  { href: '/credits',    label: 'Créditos'  },
]

export default function Navbar() {
  const pathname     = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef      = useRef<HTMLDivElement>(null)

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mobile menu animation
  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return
    if (open) {
      menu.style.display = 'block'
      gsap.fromTo(menu, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' })
    } else {
      gsap.to(menu, {
        opacity: 0, y: -8, duration: 0.18, ease: 'power2.in',
        onComplete: () => { menu.style.display = 'none' },
      })
    }
  }, [open])

  return (
    <>
      {/* Top accent line */}
      <div
        className="fixed top-0 left-0 right-0 z-[100] h-[2px] pointer-events-none"
        style={{ background: '#00DF81' }}
      />

      {/* Navbar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14"
        style={{
          background: scrolled ? 'rgba(3, 34, 33, 0.95)' : 'rgba(3, 13, 9, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #095544',
          transition: 'background 0.3s ease',
        }}
      >
        {/* Left — Logo + Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 no-underline group"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: '#032221', border: '1px solid #095544' }}
          >
            <Leaf className="w-4 h-4" style={{ color: '#00DF81' }} />
          </div>
          <span
            className="font-mono text-sm font-semibold tracking-widest"
            style={{ color: '#F1F7F6' }}
          >
            CANOPEA
          </span>
        </Link>

        {/* Center — Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {links.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-1.5 rounded text-xs font-mono tracking-widest uppercase transition-all duration-200"
                style={{
                  color:      active ? '#00DF81' : '#AAC8C4',
                  background: active ? 'rgba(0,223,129,0.08)' : 'transparent',
                  border:     active ? '1px solid rgba(0,223,129,0.2)' : '1px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = '#F1F7F6'
                    el.style.background = 'rgba(255,255,255,0.04)'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = '#AAC8C4'
                    el.style.background = 'transparent'
                  }
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right — GitHub + mobile toggle */}
        <div className="flex items-center gap-2">
          {/* GitHub */}
          <a
            href="https://github.com/Zev3n7/canopea"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-all duration-200"
            style={{ background: '#032221', border: '1px solid #095544', color: '#AAC8C4' }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.color = '#00DF81'
              el.style.borderColor = 'rgba(0,223,129,0.3)'
              el.style.background = 'rgba(0,223,129,0.06)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.color = '#AAC8C4'
              el.style.borderColor = '#095544'
              el.style.background = '#032221'
            }}
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded transition-colors"
            style={{ color: '#AAC8C4' }}
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile dropdown */}
      <div
        ref={menuRef}
        style={{
          display: 'none',
          position: 'fixed',
          top: '3.5rem',
          left: 0,
          right: 0,
          zIndex: 49,
          background: 'rgba(3, 34, 33, 0.97)',
          borderBottom: '1px solid #095544',
          backdropFilter: 'blur(12px)',
        }}
      >
        <nav className="flex flex-col px-4 py-3 gap-1">
          {links.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 rounded text-xs font-mono tracking-widest uppercase"
                style={{
                  color:      active ? '#00DF81' : '#AAC8C4',
                  background: active ? 'rgba(0,223,129,0.06)' : 'transparent',
                }}
              >
                {item.label}
              </Link>
            )
          })}
          <a
            href="https://github.com/Zev3n7/canopea"
            target="_blank" rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="sm:hidden px-4 py-2.5 rounded text-xs font-mono tracking-widest flex items-center gap-2"
            style={{ color: '#AAC8C4' }}
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        </nav>
      </div>

      {/* Spacer */}
      <div className="h-14" />
    </>
  )
}
