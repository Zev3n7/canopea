// src/components/sections/TechSection.tsx
// Sección de logos de tecnologías con LogoLoop
// ──────────────────────────────────────────────
// Para modificar los logos: edita el array DEFAULT_LOGOS en src/components/LogoLoop.tsx
// O pasa tu propio array de logos como prop `items`
'use client'
import dynamic from 'next/dynamic'
import { Cpu } from 'lucide-react'
import ScrollFloat from '@/components/ScrollFloat'

const LogoLoop = dynamic(() => import('@/components/LogoLoop'), { ssr: false })

export default function TechSection() {
  return (
    <section id="tecnologias" className="py-20 bg-bg-dark border-y border-border-green overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <Cpu className="w-4 h-4 text-lime/60" />
          <ScrollFloat
            containerClassName="!my-0"
            textClassName="text-xs font-mono tracking-[0.3em] text-text3 uppercase"
            animationDuration={0.8}
            stagger={0.02}
          >
            Stack tecnológico del proyecto
          </ScrollFloat>
          <Cpu className="w-4 h-4 text-lime/60" />
        </div>

        <LogoLoop speed={55} pauseOnHover />

        {/* Edit hint */}
        <p className="text-center mt-8 text-[10px] font-mono text-text3/50 tracking-widest">
          CANOPEA · ESP32 · MQ SENSORS · NEXT.JS · FIREBASE · MIT LICENSE
        </p>
      </div>
    </section>
  )
}
