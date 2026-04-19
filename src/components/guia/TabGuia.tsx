// src/components/guia/TabGuia.tsx
// ─────────────────────────────────────────────────────────────────────────
// Paleta única: Caribbean Green #00DF81 (acento) + grises de la paleta.
// Sin emojis. Sin arcoíris de colores por sección.
'use client'
import { useState } from 'react'
import { ChevronRight, GitFork } from 'lucide-react'
import { sections } from '@/lib/guia-data'

// Un solo set de estilos — acento uniform para todas las secciones
const ACCENT     = '#00DF81'
const ACCENT_DIM = 'rgba(0,223,129,0.08)'
const BORDER     = '#095544'
const BG_CARD    = '#032221'
const BG_EXPAND  = '#030D09'

export default function TabGuia() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      {/* Hilo conductor */}
      <div
        className="rounded-xl p-4 mb-6"
        style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-2 mb-3">
          <GitFork className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          <span
            className="text-[10px] font-mono tracking-widest uppercase"
            style={{ color: ACCENT }}
          >
            Hilo Conductor
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: '#AAC8C4' }}>
          Los sensores MQ son{' '}
          <span className="font-semibold" style={{ color: '#F1F7F6' }}>
            transductores quimioresistivos
          </span>
          : la adsorción de gas en SnO₂ cambia Rs →{' '}
          <span className="font-semibold" style={{ color: ACCENT }}>
            divisor de voltaje
          </span>{' '}
          genera Vout →{' '}
          <span className="font-semibold" style={{ color: ACCENT }}>
            ADC del ESP32
          </span>{' '}
          lo digitaliza → se calcula ppm →{' '}
          <span className="font-semibold" style={{ color: '#2CC295' }}>
            ESP32 envía por WiFi
          </span>{' '}
          al servidor → la página web muestra el AQI en tiempo real.
        </p>
      </div>

      {/* Section list */}
      {sections.map(s => {
        const isOpen = active === s.id
        return (
          <div
            key={s.id}
            className="rounded-xl overflow-hidden transition-all duration-200"
            style={{
              border:     `1px solid ${isOpen ? ACCENT + '44' : BORDER}`,
              background: isOpen ? ACCENT_DIM : BG_CARD,
            }}
          >
            {/* Header */}
            <button
              onClick={() => setActive(isOpen ? null : s.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
            >
              {/* Step number */}
              <span
                className="text-[10px] font-mono w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: ACCENT + '15', color: ACCENT, border: `1px solid ${ACCENT}30` }}
              >
                {s.id === 'semiconductores' ? '01' :
                 s.id === 'ohm'             ? '02' :
                 s.id === 'termico'         ? '03' :
                 s.id === 'cinetica'        ? '04' :
                 s.id === 'difusion'        ? '05' :
                 s.id === 'transductor'     ? '06' :
                 s.id === 'esp32'           ? '07' :
                 s.id === 'servidor'        ? '08' : '09'}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-sm font-semibold" style={{ color: '#F1F7F6' }}>
                    {s.title}
                  </span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-mono tracking-wider"
                    style={{
                      background: ACCENT + '10',
                      border:     `1px solid ${ACCENT}25`,
                      color:      ACCENT,
                    }}
                  >
                    {s.badge}
                  </span>
                </div>
                <span className="text-xs" style={{ color: '#707D7D' }}>{s.subtitle}</span>
              </div>

              <ChevronRight
                className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                style={{
                  color:     isOpen ? ACCENT : '#707D7D',
                  transform: isOpen ? 'rotate(90deg)' : 'none',
                }}
              />
            </button>

            {/* Expanded */}
            {isOpen && (
              <div
                className="px-4 pb-4 border-t"
                style={{ borderColor: ACCENT + '20' }}
              >
                {/* Formula */}
                <div
                  className="my-3 rounded-lg py-2.5 px-4 text-center"
                  style={{ background: BG_EXPAND, border: `1px solid ${ACCENT}25` }}
                >
                  <div
                    className="text-sm font-bold font-mono tracking-wide mb-1"
                    style={{ color: ACCENT }}
                  >
                    {s.formula}
                  </div>
                  <div className="text-[10px]" style={{ color: '#707D7D' }}>{s.formulaNote}</div>
                </div>

                {/* Topics */}
                <div className="space-y-2 mt-3">
                  {s.topics.map((t, i) => (
                    <div
                      key={i}
                      className="rounded-lg p-3 border-l-2"
                      style={{ background: BG_EXPAND, borderColor: ACCENT + '60' }}
                    >
                      <p
                        className="text-[10px] font-bold mb-1.5 uppercase tracking-wide"
                        style={{ color: ACCENT }}
                      >
                        {t.q}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: '#AAC8C4' }}>{t.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
