// src/components/sections/MisionSection.tsx
import { Target, Eye, Heart, Zap, Code2 } from 'lucide-react'
import { BentoCard, CANOPEA_GLOW, CANOPEA_GLOW_CYAN } from '@/components/BentoCard'

const items = [
  {
    icon:   Target,
    titulo: 'Propósito',
    color:  'lime',
    glow:   CANOPEA_GLOW,
    texto:  'Democratizar el acceso a información de calidad del aire mediante tecnología de código libre, permitiendo que cualquier comunidad, escuela o investigador pueda construir y operar su propia red de monitoreo ambiental sin depender de soluciones comerciales costosas.',
  },
  {
    icon:   Heart,
    titulo: 'Valores',
    color:  'cyan',
    glow:   CANOPEA_GLOW_CYAN,
    lista: [
      'Código abierto y transparencia radical',
      'Accesibilidad y bajo costo de replicación',
      'Colaboración comunitaria y científica',
      'Rigor técnico y validación experimental',
      'Impacto ambiental positivo y sostenible',
    ],
  },
  {
    icon:   Zap,
    titulo: 'Misión',
    color:  'olive',
    glow:   '79, 112, 1',
    texto:  'Diseñar, construir y validar un sistema distribuido de balizas meteorológicas autónomas capaces de generar mapas georreferenciados de calidad del aire en tiempo real, publicando todo el código fuente, esquemas de hardware y documentación bajo licencia libre para su libre reproducción global.',
  },
  {
    icon:   Eye,
    titulo: 'Visión',
    color:  'teal',
    glow:   '38, 81, 87',
    texto:  'Un futuro donde cualquier comunidad del mundo cuente con datos precisos y accesibles sobre la calidad de su aire, impulsando políticas públicas informadas, investigación científica descentralizada y ciudadanos empoderados para proteger su salud ambiental.',
  },
]

const colorMap: Record<string, { text: string; border: string; bg: string; dot: string }> = {
  lime:  { text: 'text-lime',       border: 'border-lime/20',  bg: 'bg-lime/5',  dot: 'bg-lime'       },
  cyan:  { text: 'text-cyan',       border: 'border-cyan/20',  bg: 'bg-cyan/5',  dot: 'bg-cyan'       },
  olive: { text: 'text-olive-light',border: 'border-olive/30', bg: 'bg-olive/5', dot: 'bg-olive-light' },
  teal:  { text: 'text-teal-light', border: 'border-teal/30',  bg: 'bg-teal/5',  dot: 'bg-teal-light'  },
}

export default function MisionSection() {
  return (
    <section id="mision" className="py-24 bg-bg-mid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16 text-center">
          <span className="text-xs font-mono tracking-widest text-lime uppercase">03 · Filosofía</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold mt-3 mb-4">
            Propósito · Misión · <span className="gradient-text">Visión</span>
          </h2>
          <div className="section-sep mx-auto mb-4" />
          <p className="text-text2 max-w-lg mx-auto text-sm leading-relaxed">
            Canopea adopta los principios del software y hardware de código libre. El proyecto es replicable, modificable y distribuible sin restricciones.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {items.map(({ icon: Icon, titulo, color, glow, texto, lista }) => {
            const c = colorMap[color]
            return (
              <BentoCard
                key={titulo}
                className={`bg-surface border ${c.border} rounded-2xl p-8 min-h-[260px] hover:-translate-y-1 transition-transform duration-300`}
                glowColor={glow}
                enableTilt
                clickEffect
                particleCount={10}
              >
                <div className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-6`}>
                  <Icon className={`w-6 h-6 ${c.text}`} />
                </div>

                {/* Retro code label */}
                <span className={`font-mono text-[9px] ${c.text} tracking-[0.25em] opacity-60 uppercase mb-2 block`}>
                  CANOPEA :: {titulo.toUpperCase()}
                </span>

                <h3 className={`text-xl font-display font-bold mb-4 ${c.text}`}>{titulo}</h3>
                {texto && (
                  <p className="text-text2 text-sm leading-relaxed">{texto}</p>
                )}
                {lista && (
                  <ul className="space-y-2">
                    {lista.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-text2">
                        <span className={`w-1.5 h-1.5 rounded-full ${c.dot} mt-1.5 flex-shrink-0`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </BentoCard>
            )
          })}
        </div>

        {/* Open source banner */}
        <div className="rounded-xl border border-border-green bg-surface p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-bg-dark border border-border-green flex items-center justify-center">
              <Code2 className="w-6 h-6 text-lime" />
            </div>
          </div>
          <span className="mono-tag block mb-2">CANOPEA :: OPEN-SOURCE</span>
          <h3 className="text-xl font-display font-semibold mb-3 text-lime">Filosofía Open Source</h3>
          <p className="text-text2 text-sm max-w-2xl mx-auto leading-relaxed mb-6">
            Todo el código del firmware ESP32, el servidor backend, el frontend y los esquemas de circuito están disponibles públicamente. Canopea utiliza exclusivamente herramientas de código libre y publica su trabajo bajo licencia MIT.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            {['MIT License', 'Firebase', 'ESP32 Arduino', 'Next.js', 'React', 'Leaflet.js'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded border border-border-green bg-bg-dark text-text2 hover:border-lime/40 hover:text-lime transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
