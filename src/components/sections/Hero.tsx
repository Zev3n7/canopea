// src/components/sections/Hero.tsx
'use client'
import dynamic from 'next/dynamic'
import { ArrowDown, Github, Activity } from 'lucide-react'
import Link from 'next/link'
import ShuffleText from '@/components/ShuffleText'

const FaultyTerminal = dynamic(() => import('@/components/FaultyTerminal'), { ssr: false })

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-bg-dark">
      {/* FaultyTerminal background */}
      <div className="absolute inset-0 z-0">
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.5}
          scanlineIntensity={0.5}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          curvature={0.1}
          tint="#00DF81"
          mouseReact
          mouseStrength={0.5}
          pageLoadAnimation
          brightness={0.55}
          className="w-full h-full"
        />
      </div>

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'rgba(3, 13, 9, 0.72)' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-lime/20 bg-lime/5 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-lime dot-pulse" />
          <span className="font-mono text-xs tracking-wider text-lime">PROYECTO CIENTÍFICO · CÓDIGO ABIERTO</span>
        </div>

        {/* Title with ShuffleText */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-4 leading-tight" style={{ color: '#00DF81' }}>
          <ShuffleText
            text="CANOPEA"
            as="span"
            duration={1200}
            iterationsPerChar={6}
            triggerOnMount
            triggerOnHover
            className="tracking-widest"
          />
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-text2 font-light mt-4 mb-10 tracking-wide">
          Proyecto de código abierto de balizas meteorológicas
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/monitoring"
            className="flex items-center gap-2 px-6 py-3 rounded text-sm font-mono font-semibold transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: '#00DF81', color: '#030D09' }}
          >
            <Activity className="w-4 h-4" />
            Ver monitoreo en vivo
          </Link>
          <a
            href="https://github.com/Zev3n7/canopea"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded text-sm font-mono transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'transparent', border: '1px solid #095544', color: '#AAC8C4' }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'rgba(0,223,129,0.3)'
              el.style.color = '#F1F7F6'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = '#095544'
              el.style.color = '#AAC8C4'
            }}
          >
            <Github className="w-4 h-4" />
            Código en GitHub
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-14 grid grid-cols-3 gap-6 max-w-sm mx-auto">
          {[
            { val: '3', label: 'Sensores' },
            { val: 'ESP32', label: 'MCU' },
            { val: 'MIT', label: 'Licencia' },
          ].map(({ val, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold font-mono" style={{ color: '#00DF81' }}>{val}</div>
              <div className="text-xs uppercase tracking-wider mt-1" style={{ color: '#707D7D' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll arrow */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-text3 hover:text-lime transition-colors z-10"
      >
        <span className="text-xs font-mono tracking-widest">SCROLL</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </a>
    </section>
  )
}
