// src/components/ui/LecturasTable.tsx
'use client'
import type { SensorReading } from '@/types'
import { UMBRALES } from '@/lib/constants'

interface LecturasTableProps {
  lecturas:  SensorReading[]
  balizaNombre: string
}

function tsToDate(ts: SensorReading['timestamp']): Date {
  if (ts instanceof Date) return ts
  return new Date((ts as any).seconds * 1000)
}

function getEstado(l: SensorReading) {
  if (l.mq2_ppm > UMBRALES.mq2 || l.mq7_ppm > UMBRALES.mq7 || l.mq135_ppm > UMBRALES.mq135)
    return { label: 'ALERTA', cls: 'bg-red-500/10 text-red-400 border-red-500/20' }
  if (l.mq2_ppm > UMBRALES.mq2 * .5 || l.mq7_ppm > UMBRALES.mq7 * .5 || l.mq135_ppm > UMBRALES.mq135 * .5)
    return { label: 'AVISO',  cls: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' }
  return { label: 'OK', cls: 'bg-lime/10 text-lime border-lime/20' }
}

export default function LecturasTable({ lecturas, balizaNombre }: LecturasTableProps) {
  const rows = lecturas.slice(0, 20)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-green">
            {['Timestamp', 'Baliza', 'MQ-2 (ppm)', 'MQ-7 (ppm)', 'MQ-135 (ppm)', 'Estado'].map(h => (
              <th key={h} className="text-left py-3 px-4 text-[10px] font-semibold tracking-widest uppercase text-text3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-10 text-text3 text-sm">Sin lecturas disponibles</td>
            </tr>
          ) : rows.map((l, i) => {
            const est = getEstado(l)
            const ts  = tsToDate(l.timestamp)
            return (
              <tr
                key={l.id ?? i}
                className="border-b border-border-green/50 hover:bg-surface/50 transition-colors"
              >
                <td className="py-2.5 px-4 font-mono text-xs text-text2">{ts.toLocaleString('es-MX')}</td>
                <td className="py-2.5 px-4 text-text2 text-xs">{balizaNombre}</td>
                <td className="py-2.5 px-4 font-mono text-xs text-lime">{l.mq2_ppm.toFixed(1)}</td>
                <td className="py-2.5 px-4 font-mono text-xs text-cyan">{l.mq7_ppm.toFixed(1)}</td>
                <td className="py-2.5 px-4 font-mono text-xs text-olive-light">{l.mq135_ppm.toFixed(1)}</td>
                <td className="py-2.5 px-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${est.cls}`}>
                    {est.label}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
