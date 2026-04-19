// src/components/sections/Hero.tsx
'use client'
import dynamic from 'next/dynamic'
import { ArrowDown, Github, Activity } from 'lucide-react'
import Link from 'next/link'

const TextType   = dynamic(() => import('@/components/ui/TextType'),   { ssr: false })
const ShapeGrid  = dynamic(() => import('@/components/ui/ShapeGrid'),  { ssr: false })

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-bg-dark">
      {/* Background grid */}
      <div className="absolute inset-0">
        <ShapeGrid
          borderColor="#1E3520"
          hoverColor="#84BD0118"
          shapeSize={44}
          animationSpeed={0.3}
        />
      </div>

      {/* Radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(132,189,1,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-lime/20 bg-lime/5 text-sm text-lime">
          <span className="w-2 h-2 rounded-full bg-lime dot-pulse" />
          <span className="font-mono text-xs tracking-wider">PROYECTO CIENTÍFICO · CÓDIGO ABIERTO</span>
        </div>

        {/* Main title with TextType */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-4 leading-tight">
          <TextType
            texts={['Bienvenido al proyecto Canopea']}
            typingSpeed={55}
            pauseDuration={99999}
            showCursor
            cursorCharacter="|"
            className="gradient-text"
            loop={false}
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
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-lime text-bg-dark font-semibold hover:bg-lime-light transition-all duration-200 shadow-lg shadow-lime/20 hover:shadow-lime/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Activity className="w-4 h-4" />
            Ver monitoreo en vivo
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border-green text-text2 hover:text-lime hover:border-lime/40 transition-all duration-200"
          >
            <Github className="w-4 h-4" />
            Código en GitHub
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-14 grid grid-cols-3 gap-6 max-w-sm mx-auto">
          {[
            { val: '3',     label: 'Sensores' },
            { val: 'ESP32', label: 'MCU' },
            { val: 'MIT',   label: 'Licencia' },
          ].map(({ val, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold font-mono text-lime">{val}</div>
              <div className="text-xs text-text3 uppercase tracking-wider mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll arrow */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-text3 hover:text-lime transition-colors"
      >
        <span className="text-xs font-mono tracking-widest">SCROLL</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </a>
    </section>
  )
}
