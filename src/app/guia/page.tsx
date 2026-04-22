// src/app/guia/page.tsx
'use client'
import PageHeroBanner from '@/components/layout/PageHeroBanner'
import GuiaBlog from '@/components/guia/GuiaBlog'

export default function GuiaPage() {
  return (
    <main className="min-h-screen bg-bg-dark">

        <PageHeroBanner
          tag="FÍSICA APLICADA · IOT · BALIZA METEOROLÓGICA"
          title="BALIZA METEOROLÓGICA"
          subtitle="Guía técnica completa del sistema Canopea: sensores MQ, microcontrolador ESP32, mapa del sistema IoT y fuentes de referencia científica."
        />

        {/* Guia Blog Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <GuiaBlog />
        </div>

        {/* Footer strip */}
        <div className="border-t border-border-green py-4 text-center">
          <p className="text-[9px] font-mono tracking-widest text-text3">
            BALIZA · MQ-2 · MQ-7 · MQ-135 · ESP32 · IOT · FÍSICA APLICADA
          </p>
        </div>
      </main>
  )
}
