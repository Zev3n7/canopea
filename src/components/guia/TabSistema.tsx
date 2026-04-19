// src/components/guia/TabSistema.tsx
import { flujoSistema } from '@/lib/guia-data'

const fisicaNodes = [
  { icon: '⚛️', color: '#0DD2EA', title: 'Semiconductor',       desc: 'SnO₂ tipo N · Bandgap · Depletion layer'   },
  { icon: '⚡',  color: '#F9CB42', title: 'Electromagnetismo',   desc: 'Ley de Ohm · Divisor voltaje · ADC 12 bits' },
  { icon: '🌡️', color: '#FF6B35', title: 'Termodinámica',       desc: 'Conducción · Convección · T° óptima'        },
  { icon: '💨', color: '#84BD01', title: 'Mecánica Estadística', desc: 'Cinética de gases · Maxwell-Boltzmann'       },
  { icon: '🌊', color: '#BF5FFF', title: 'Transporte de masa',   desc: 'Difusión (Fick) · Lag time · Re'            },
  { icon: '📡', color: '#00FFCC', title: 'Telecomunicaciones',   desc: 'WiFi 2.4 GHz · HTTP · MQTT · WS'           },
]

const archNodes = [
  { label: 'SENSORES\nMQ-2/7/135\nChemiresistores', color: '#0DD2EA', icon: '🔬' },
  { label: 'ESP32\nADC 12-bit\nWiFi 2.4 GHz',      color: '#00FFCC', icon: '🖥️' },
  { label: 'SERVIDOR\nHTTP/MQTT\nPágina Web AQI',    color: '#FF9500', icon: '🌐' },
]

const archLinks = [
  { label: 'Señal analógica', detail: 'Vout → GPIO ADC', color: '#F9CB42' },
  { label: 'Protocolo digital', detail: 'HTTP POST / MQTT', color: '#00FFCC' },
]

export default function TabSistema() {
  return (
    <div className="space-y-8">
      {/* Flujo vertical */}
      <div>
        <p className="text-center text-[10px] font-mono tracking-widest text-text3 mb-4">
          FLUJO COMPLETO — GAS EN AMBIENTE → PÁGINA WEB
        </p>
        <div className="flex flex-col gap-0.5">
          {flujoSistema.map((s, i) => (
            <div key={i}>
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 border"
                style={{ background: '#111E14', borderColor: s.color + '44' }}
              >
                <span className="text-lg flex-shrink-0">{s.icon}</span>
                <div className="flex-1">
                  <span
                    className="text-xs font-bold tracking-wide"
                    style={{ color: s.color }}
                  >
                    {s.label}
                  </span>
                  <p className="text-[10px] text-text3 mt-0.5">{s.desc}</p>
                </div>
                <span
                  className="text-[9px] font-mono px-2 py-0.5 rounded"
                  style={{
                    background:  s.color + '11',
                    border:      `1px solid ${s.color}22`,
                    color:       s.color,
                  }}
                >
                  P{i + 1}
                </span>
              </div>
              {i < flujoSistema.length - 1 && (
                <div className="text-center text-text3 text-base leading-4">↓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Arquitectura IoT */}
      <div className="bg-bg-mid border border-border-green rounded-xl p-5">
        <p className="text-[10px] font-mono tracking-widest mb-4" style={{ color: '#FF9500' }}>
          🏗️ ARQUITECTURA IoT
        </p>

        {/* Three nodes */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {archNodes.map((n, i) => (
            <div
              key={i}
              className="rounded-xl p-3 text-center border"
              style={{
                background:   n.color + '10',
                borderColor:  n.color + '33',
              }}
            >
              <div className="text-lg mb-2">{n.icon}</div>
              {n.label.split('\n').map((line, j) => (
                <p
                  key={j}
                  className="text-[9px] leading-relaxed"
                  style={{ color: n.color }}
                >
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Links row */}
        <div className="grid grid-cols-2 gap-3">
          {archLinks.map((l, i) => (
            <div key={i} className="text-center">
              <p className="text-[9px] font-semibold" style={{ color: l.color }}>{l.label}</p>
              <p className="text-[10px] text-text3">{l.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Física grid */}
      <div>
        <p className="text-[10px] font-mono tracking-widest text-text3 mb-3">
          FENÓMENOS FÍSICOS INVOLUCRADOS
        </p>
        <div className="grid grid-cols-2 gap-2">
          {fisicaNodes.map((n, i) => (
            <div
              key={i}
              className="rounded-xl p-3 border"
              style={{ background: '#111E14', borderColor: n.color + '33' }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base">{n.icon}</span>
                <span className="text-xs font-bold" style={{ color: n.color }}>{n.title}</span>
              </div>
              <p className="text-[10px] text-text3 leading-relaxed">{n.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
