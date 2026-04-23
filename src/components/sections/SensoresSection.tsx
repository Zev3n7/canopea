// src/components/sections/SensoresSection.tsx
import dynamic from 'next/dynamic'
import { Wind, Flame, Beaker, MapPin, ShieldAlert, Activity } from 'lucide-react'
import { BALIZA_DEMO } from '@/lib/constants'
import { BentoCard, CANOPEA_GLOW, CANOPEA_GLOW_CYAN } from '@/components/BentoCard'

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
    umbral: 500,
    tag: 'INFLAMABLE',
  },
  {
    id:    'mq7',
    icon:  Wind,
    nombre:'MQ-7',
    gases: 'Monóxido de carbono (CO)',
    rango: '20 – 2,000 ppm',
    color: 'cyan' as const,
    desc:  'Especializado en la detección de CO, un gas tóxico producto de combustión incompleta. Indicador directo de tráfico vehicular e industria.',
    umbral: 26,
    tag: 'TÓXICO-CO',
  },
  {
    id:    'mq135',
    icon:  Beaker,
    nombre:'MQ-135',
    gases: 'NH₃ · VOC · NOx · CO₂ · Benceno',
    rango: '10 – 300 ppm (NH₃)',
    color: 'olive' as const,
    desc:  'Sensor de amplio espectro que detecta compuestos orgánicos volátiles y gases de contaminación urbana, agrícola e industrial.',
    umbral: 80,
    tag: 'VOC/NOx',
  },
]

const colorMap = {
  lime:  { text: 'text-lime',   border: 'border-lime/25',  bg: 'bg-lime/5',   badge: 'bg-lime/10 text-lime',   glow: CANOPEA_GLOW },
  cyan:  { text: 'text-cyan',   border: 'border-cyan/25',  bg: 'bg-cyan/5',   badge: 'bg-cyan/10 text-cyan',   glow: CANOPEA_GLOW_CYAN },
  olive: { text: 'text-frog',   border: 'border-frog/25',  bg: 'bg-frog/5',   badge: 'bg-frog/10 text-frog',   glow: '23, 135, 109' },
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

        {/* Bento sensor grid — asymmetric layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {sensores.map(({ id, icon: Icon, nombre, gases, rango, color, desc, umbral, tag }) => {
            const c = colorMap[color]
            return (
              <BentoCard
                key={id}
                className={`bg-surface border ${c.border} rounded-2xl p-6 flex flex-col justify-between min-h-[280px] hover:-translate-y-1 transition-transform duration-300`}
                glowColor={c.glow}
                enableTilt
                clickEffect
                particleCount={10}
              >
                {/* Top: icon + tag */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${c.text}`} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.badge} font-mono tracking-wider`}>MOS</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border ${c.border} ${c.text} font-mono opacity-70`}>{tag}</span>
                  </div>
                </div>

                {/* Name + gases */}
                <div className="mb-3">
                  <h3 className={`text-2xl font-bold font-mono ${c.text} mb-1`}>{nombre}</h3>
                  <p className="text-text2 text-sm font-medium">{gases}</p>
                </div>

                <p className="text-text3 text-xs leading-relaxed mb-4 flex-1">{desc}</p>

                {/* Footer stats */}
                <div className={`pt-4 border-t ${c.border} space-y-1`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text3">Rango</span>
                    <span className={`text-xs font-mono ${c.text}`}>{rango}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text3">Umbral alerta</span>
                    <span className="text-xs font-mono text-orange-400">&gt; {umbral} ppm</span>
                  </div>
                </div>

                {/* Corner label */}
                <span className="absolute top-3 left-3 font-mono text-[9px] text-text3/50 tracking-widest opacity-60">SRC::SENSOR</span>
              </BentoCard>
            )
          })}
        </div>

        {/* Context Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <BentoCard className="bg-surface border border-lime/25 rounded-2xl p-6 md:p-8" glowColor={CANOPEA_GLOW} enableTilt clickEffect particleCount={5}>
            <h3 className="text-[#F1F7F6] text-xl font-display font-bold mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-lime" />
              Seguridad y Umbrales (ppm)
            </h3>
            <p className="text-text2 text-sm leading-relaxed mb-4">
              La medida en <strong>Partes por Millón (ppm)</strong> cuantifica la concentración métrica de un contaminante. Según normativas de seguridad e higiene, superar estos topes fisiológicos ocasiona intoxicaciones silenciosas (como la asfixia celular por CO), o advierte de la proximidad al Límite Inferior de Explosividad (LEL) en gases como el metano.
            </p>
            <p className="text-text3 text-xs leading-relaxed">
              Los límites pre-configurados en el código de Canopea disparan alertas preventivas antes de que la saturación biológica en el aire represente una emergencia irreparable, permitiendo protocolos tempranos de ventilación.
            </p>
          </BentoCard>
          
          <BentoCard className="bg-surface border border-cyan/25 rounded-2xl p-6 md:p-8" glowColor={CANOPEA_GLOW} enableTilt clickEffect particleCount={5}>
            <h3 className="text-[#F1F7F6] text-xl font-display font-bold mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan" />
              Importancia de monitorear red
            </h3>
            <p className="text-text2 text-sm leading-relaxed mb-4">
              La degradación de la calidad del aire representa una amenaza mundial causante de deficiencias agudas del sistema respiratorio e impactos drásticos en la termodinámica del ecosistema mediante el efecto invernadero e isla de calor urbarno.
            </p>
            <p className="text-text3 text-xs leading-relaxed">
              Implementar tecnología a través de redes descentralizadas como <strong>Canopea</strong> brinda la capacidad de observar focos de contaminación microscópicos e invisibles que las grandes agencias gubernamentales pasan por alto, protegiendo vecindarios e instituciones al democratizar sus propios datos.
            </p>
          </BentoCard>
        </div>

        {/* Map card — also wrapped in BentoCard */}
        <BentoCard
          className="bg-surface border border-border-green rounded-2xl overflow-hidden"
          glowColor={CANOPEA_GLOW}
          enableTilt={false}
          clickEffect
          particleCount={8}
        >
          {/* Map header */}
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
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-text3 tracking-widest">SRC::MAPA-BALIZA</span>
            </div>
          </div>

          {/* Map render */}
          <div className="h-[400px] w-full">
            <MapaBaliza />
          </div>

          {/* Map footer */}
          <div className="px-6 py-3 border-t border-border-green text-xs text-text3 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime dot-pulse" />
            Ubicación estática de la baliza
          </div>
        </BentoCard>

      </div>
    </section>
  )
}