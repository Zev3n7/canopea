// src/components/sections/SensoresSection.tsx
'use client'
import dynamic from 'next/dynamic'
import { Wind, Flame, Beaker, MapPin } from 'lucide-react'
import { BALIZA_DEMO } from '@/lib/constants'

// SSR-safe Leaflet
const MapaBaliza = dynamic(() => import('@/components/ui/MapaBaliza'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] rounded-xl bg-surface border border-border-green flex items-center justify-center">
      <div className="text-text3 text-sm font-mono animate-pulse">Cargando mapa…</div>
    </div>
  ),
})

const sensores = [
  {
    id:    'mq2',
    icon:  Flame,
    nombre:'MQ-2',
    gases: 'GLP · Metano · Hidrógeno · Humo',
    rango: '300 – 10,000 ppm',
    color: 'lime' as const,
    desc:  'Sensor de semiconductor de óxido metálico (MOS). Detecta gases inflamables y humo mediante la variación de resistencia eléctrica al contacto con el gas.',
    umbral: 1000,
  },
  {
    id:    'mq7',
    icon:  Wind,
    nombre:'MQ-7',
    gases: 'Monóxido de carbono (CO)',
    rango: '20 – 2,000 ppm',
    color: 'cyan' as const,
    desc:  'Especializado en la detección de CO, un gas tóxico producto de combustión incompleta. Indicador directo de tráfico vehicular e industria.',
    umbral: 200,
  },
  {
    id:    'mq135',
    icon:  Beaker,
    nombre:'MQ-135',
    gases: 'NH₃ · VOC · NOx · CO₂ · Benceno',
    rango: '10 – 300 ppm (NH₃)',
    color: 'olive' as const,
    desc:  'Sensor de amplio espectro que detecta compuestos orgánicos volátiles y gases de contaminación urbana, agrícola e industrial.',
    umbral: 150,
  },
]

const colorMap = {
  lime:  { text: 'text-lime',  border: 'border-lime/20',  bg: 'bg-lime/5',  badge: 'bg-lime/10 text-lime'  },
  cyan:  { text: 'text-cyan',  border: 'border-cyan/20',  bg: 'bg-cyan/5',  badge: 'bg-cyan/10 text-cyan'  },
  olive: { text: 'text-olive-light', border: 'border-olive/30', bg: 'bg-olive/5', badge: 'bg-olive/10 text-olive-light' },
}

export default function SensoresSection() {
  return (
    <section id="sensores" className="py-24 bg-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16 text-center">
          <span className="text-xs font-mono tracking-widest text-lime uppercase">02 · Hardware</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold mt-3 mb-4">
            Sensores de <span className="gradient-text">contaminación</span>
          </h2>
          <div className="section-sep mx-auto mb-4" />
          <p className="text-text2 max-w-xl mx-auto text-sm leading-relaxed">
            Cada baliza integra tres sensores electroquímicos de la familia MQ que miden la concentración de gases contaminantes en partes por millón (ppm).
          </p>
        </div>

        {/* Sensor cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {sensores.map(({ id, icon: Icon, nombre, gases, rango, color, desc, umbral }) => {
            const c = colorMap[color]
            return (
              <div
                key={id}
                className={`bg-surface border ${c.border} rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-5`}>
                  <Icon className={`w-6 h-6 ${c.text}`} />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-2xl font-bold font-mono ${c.text}`}>{nombre}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.badge} font-mono`}>
                    MOS
                  </span>
                </div>
                <p className="text-text2 text-sm mb-3 font-medium">{gases}</p>
                <p className="text-text3 text-sm leading-relaxed mb-4">{desc}</p>
                <div className="pt-4 border-t border-border-green flex items-center justify-between">
                  <span className="text-xs text-text3">Rango</span>
                  <span className={`text-xs font-mono ${c.text}`}>{rango}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-text3">Umbral alerta</span>
                  <span className="text-xs font-mono text-orange-400">&gt; {umbral} ppm</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mapa + ubicación */}
        <div className="bg-surface border border-border-green rounded-2xl overflow-hidden">
          {/* Cabecera del mapa */}
          <div className="p-6 border-b border-border-green flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-lime" />
              <div>
                <h3 className="font-semibold">{BALIZA_DEMO.nombre}</h3>
                <p className="text-text3 text-xs font-mono mt-0.5">
                  {BALIZA_DEMO.lat.toFixed(5)}, {BALIZA_DEMO.lng.toFixed(5)}
                </p>
              </div>
            </div>
          </div>

          {/* Renderizado del Mapa */}
          <div className="h-[400px] w-full">
            <MapaBaliza 
              lat={BALIZA_DEMO.lat} 
              lng={BALIZA_DEMO.lng} 
              // Ya no pasamos onMove porque el mapa es estático
            />
          </div>

          {/* Pie del mapa */}
          <div className="px-6 py-3 border-t border-border-green text-xs text-text3 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime dot-pulse" />
            Ubicación estática de la baliza
          </div>
        </div>
      </div>
    </section>
  )
}