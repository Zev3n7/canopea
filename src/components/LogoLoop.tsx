// src/components/LogoLoop.tsx
// Infinite marquee — tecnologías del proyecto
// ──────────────────────────────────────────────
// Para modificar: edita el array DEFAULT_LOGOS abajo.
// Cada item acepta: name, abbreviation, color, href
'use client'
import React, { useRef, useEffect } from 'react'
import {
  Cpu, Globe, Database, LayoutTemplate, Layers,
  Map, Code2, FileText, Wifi, Wind, CloudFog, FlaskConical,
} from 'lucide-react'

export interface LogoItem {
  name: string
  Icon: React.ElementType
  color?: string
  href?: string
}

// ──────────────────────────────────────────────
// STACK TECNOLÓGICO — edita libremente
// ──────────────────────────────────────────────
export const DEFAULT_LOGOS: LogoItem[] = [
  { name: 'ESP32', Icon: Cpu, color: '#00DF81', href: 'https://www.espressif.com/en/products/socs/esp32' },
  { name: 'Next.js', Icon: LayoutTemplate, color: '#F1F7F6', href: 'https://nextjs.org' },
  { name: 'Firebase', Icon: Database, color: '#2CC295', href: 'https://firebase.google.com' },
  { name: 'React', Icon: Layers, color: '#2CC295', href: 'https://react.dev' },
  { name: 'Arduino', Icon: Cpu, color: '#17876D', href: 'https://arduino.cc' },
  { name: 'Leaflet', Icon: Map, color: '#00DF81', href: 'https://leafletjs.com' },
  { name: 'TypeScript', Icon: Code2, color: '#AAC8C4', href: 'https://typescriptlang.org' },
  { name: 'MIT', Icon: FileText, color: '#707D7D', href: 'https://opensource.org/licenses/MIT' },
  { name: 'MQ-2', Icon: Wind, color: '#00DF81', href: '#https://www.alldatasheet.es/html-pdf/1572279/HANWEI/MQ-2/248/1/MQ-2.html' },
  { name: 'MQ-7', Icon: CloudFog, color: '#2CC295', href: 'https://www.alldatasheet.es/html-pdf/1648921/HANWEI/MQ-7/248/1/MQ-7.html' },
  { name: 'MQ-135', Icon: FlaskConical, color: '#2FA98C', href: 'https://www.alldatasheet.es/html-pdf/1132551/HANWEI/MQ-135/764/3/MQ-135.html' },
]

interface LogoLoopProps {
  items?: LogoItem[]
  speed?: number
  gap?: number
  pauseOnHover?: boolean
}

export default function LogoLoop({
  items = DEFAULT_LOGOS,
  speed = 55,
  gap = 48,
  pauseOnHover = true,
}: LogoLoopProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<Animation | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const totalWidth = track.scrollWidth / 2
    const dur = (totalWidth / speed) * 1000

    animRef.current = track.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(-${totalWidth}px)` }],
      { duration: dur, iterations: Infinity, easing: 'linear' }
    )
    return () => animRef.current?.cancel()
  }, [speed, items])

  const pause = () => { if (pauseOnHover) animRef.current?.pause() }
  const play = () => { if (pauseOnHover) animRef.current?.play() }

  const doubled = [...items, ...items]

  return (
    <div
      className="overflow-hidden w-full relative select-none"
      onMouseEnter={pause}
      onMouseLeave={play}
    >
      {/* Fade masks */}
      <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #030D09, transparent)' }} />
      <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #030D09, transparent)' }} />

      <div
        ref={trackRef}
        className="flex items-center"
        style={{ gap: `${gap}px`, width: 'max-content' }}
      >
        {doubled.map((item, i) => (
          <a
            key={i}
            href={item.href || '#'}
            target={item.href?.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 group no-underline flex-shrink-0"
            style={{ minWidth: 72 }}
          >
            {/* Icon card */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-250"
              style={{
                background: '#032221',
                border: '1px solid #095544',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = item.color || '#00DF81'
                el.style.background = '#0B453A'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = '#095544'
                el.style.background = '#032221'
              }}
            >
              <item.Icon
                className="w-6 h-6 transition-colors duration-250"
                style={{ color: item.color || '#707D7D' }}
              />
            </div>
            {/* Label */}
            <span
              className="text-[9px] font-mono tracking-widest uppercase"
              style={{ color: '#707D7D' }}
            >
              {item.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
