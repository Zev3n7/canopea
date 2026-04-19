// src/components/ui/KpiCard.tsx
'use client'
import { UMBRALES } from '@/lib/constants'

type Sensor = 'mq2' | 'mq7' | 'mq135'

interface KpiCardProps {
  sensor:  Sensor
  value:   number
  label:   string
  unit?:   string
}

const CONFIG: Record<Sensor, { max: number; name: string }> = {
  mq2:   { max: UMBRALES.mq2,   name: 'MQ-2' },
  mq7:   { max: UMBRALES.mq7,   name: 'MQ-7' },
  mq135: { max: UMBRALES.mq135, name: 'MQ-135' },
}

function getLevel(pct: number) {
  if (pct > 80) return { label: 'ALERTA', color: 'text-red-400',    bar: 'bg-red-500',    border: 'border-red-500/30',  bg: 'bg-red-500/5'  }
  if (pct > 50) return { label: 'AVISO',  color: 'text-yellow-400', bar: 'bg-yellow-400', border: 'border-yellow-400/30', bg: 'bg-yellow-400/5' }
  return           { label: 'OK',    color: 'text-lime',       bar: 'bg-lime',       border: 'border-lime/20',     bg: 'bg-lime/5'     }
}

export default function KpiCard({ sensor, value, label, unit = 'ppm' }: KpiCardProps) {
  const cfg  = CONFIG[sensor]
  const pct  = Math.min(100, (value / cfg.max) * 100)
  const lvl  = getLevel(pct)

  return (
    <div className={`rounded-2xl border ${lvl.border} ${lvl.bg} p-5 transition-all duration-500`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-mono text-text3 tracking-widest uppercase">{cfg.name}</p>
          <p className="text-xs text-text3 mt-0.5">{label}</p>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${lvl.color} border ${lvl.border}`}>
          {lvl.label}
        </span>
      </div>

      <div className={`text-3xl font-bold font-mono ${lvl.color} mb-3`}>
        {isNaN(value) ? '—' : value.toFixed(0)}
        <span className="text-sm font-normal text-text3 ml-1">{unit}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-border-green rounded-full overflow-hidden">
        <div
          className={`h-full ${lvl.bar} rounded-full transition-all duration-700`}
          style={{ width: `${pct.toFixed(1)}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-text3 font-mono">0</span>
        <span className="text-xs text-text3 font-mono">umbral: {cfg.max}</span>
      </div>
    </div>
  )
}
