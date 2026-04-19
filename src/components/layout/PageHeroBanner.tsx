// src/components/layout/PageHeroBanner.tsx
// Reutilizable: banner hero con FaultyTerminal de fondo + TextType + ScrollFloat
'use client'
import dynamic from 'next/dynamic'

const FaultyTerminal = dynamic(() => import('@/components/FaultyTerminal'), { ssr: false })
const TextType = dynamic(() => import('@/components/ui/TextType'), { ssr: false })

interface PageHeroBannerProps {
  /** Etiqueta superior monospace */
  tag: string
  /** Título principal (se muestra con TextType) */
  title: string
  /** Subtitulo o descripción */
  subtitle: string
  /** Clase extra para el contenedor section */
  className?: string
}

export default function PageHeroBanner({ tag, title, subtitle, className = '' }: PageHeroBannerProps) {
  return (
    <section
      className={`relative overflow-hidden bg-bg-dark border-b border-border-green ${className}`}
      style={{ minHeight: 280 }}
    >
      {/* FaultyTerminal background */}
      <div className="absolute inset-0 z-0">
        <FaultyTerminal
          scale={1.2}
          gridMul={[3, 1]}
          digitSize={1.0}
          timeScale={0.35}
          scanlineIntensity={0.4}
          glitchAmount={0.8}
          flickerAmount={0.8}
          noiseAmp={0.9}
          curvature={0.05}
          tint="#00DF81"
          mouseReact
          mouseStrength={0.3}
          brightness={0.4}
          className="w-full h-full"
        />
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(13,23,16,0.6) 0%, rgba(13,23,16,0.85) 100%)' }}
      />
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,223,129,0.05) 0%, transparent 70%)' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
        {/* Tag */}
        <div className="inline-block mb-5 px-3 py-1 rounded text-[9px] font-mono tracking-[3px] border"
          style={{ background: 'rgba(0,223,129,0.08)', borderColor: 'rgba(0,223,129,0.25)', color: '#00DF81' }}>
          {tag}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-display font-black mb-3 gradient-text">
          <TextType
            texts={[title]}
            typingSpeed={45}
            pauseDuration={99999}
            showCursor
            cursorCharacter="|"
            className="gradient-text"
            loop={false}
          />
        </h1>

        {/* Subtitle */}
        <p className="text-text2 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-light">
          {subtitle}
        </p>
      </div>
    </section>
  )
}
