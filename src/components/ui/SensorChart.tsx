// src/components/ui/SensorChart.tsx
'use client'
import { useEffect, useRef } from 'react'
import type { SensorReading } from '@/types'

interface SensorChartProps {
  lecturas: SensorReading[]
  sensor:   'mq2_ppm' | 'mq7_ppm' | 'mq135_ppm'
  color:    string
  label:    string
  umbral:   number
  onClick?: () => void
}

function tsToDate(ts: SensorReading['timestamp']): Date {
  if (!ts) return new Date()
  if (ts instanceof Date) return ts
  if (typeof ts === 'object' && 'seconds' in ts) {
    return new Date((ts as any).seconds * 1000)
  }
  if (typeof ts === 'number') {
    return new Date(ts)
  }
  return new Date() // fallback final
}

export default function SensorChart({ lecturas, sensor, color, label, umbral, onClick }: SensorChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef  = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    import('chart.js').then(({ Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip }) => {
      Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip)
      const ctx = canvasRef.current
      if (!ctx || !lecturas.length) return

      // En la vista miniaturizada mostramos solo las ultimas 30 lecturas
      const data    = [...lecturas].reverse().slice(-30)
      const labels  = data.map(l => tsToDate(l.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      const values  = data.map(l => +(l[sensor] ?? 0).toFixed(1))

      if (chartRef.current) {
        chartRef.current.data.labels           = labels
        chartRef.current.data.datasets[0].data = values
        chartRef.current.update('none')
        return
      }

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label,
            data:            values,
            borderColor:     color,
            backgroundColor: color + '18',
            borderWidth:     1.5,
            pointRadius:     0,
            tension:         0.4,
            fill:            true,
          }],
        },
        options: {
          responsive:          true,
          maintainAspectRatio: false,
          animation:           { duration: 300 },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#172319',
              borderColor:     '#1E3520',
              borderWidth:     1,
              titleColor:      '#D9EDE3',
              bodyColor:       '#8BAF98',
              padding:         10,
              displayColors:   false,
            },
          },
          scales: {
            x: { display: false },
            y: {
              grid:   { color: 'rgba(30,53,32,.5)' },
              ticks:  { color: '#4A6655', font: { size: 10, family: 'JetBrains Mono' } },
              border: { display: false },
              suggestedMax: umbral,
            },
          },
        },
      })
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [lecturas, sensor, color, label, umbral])

  return (
    <div 
      onClick={onClick}
      className={`bg-surface border border-border-green rounded-2xl p-5 transition-all ${
        onClick ? 'cursor-pointer hover:border-[#00DF81]/50 hover:shadow-[0_0_15px_rgba(0,223,129,0.1)] hover:-translate-y-1' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono tracking-wider text-text3 uppercase">{label}</span>
        <span className="text-xs font-mono" style={{ color }}>{lecturas[0] ? (lecturas[0][sensor] as number).toFixed(0) : '—'} ppm</span>
      </div>
      <div className="relative h-36">
        <canvas ref={canvasRef} />
      </div>
      {onClick && (
        <div className="mt-4 text-center border-t border-[#095544] pt-2">
          <span className="text-[10px] font-mono text-[#00DF81] opacity-70 uppercase tracking-widest">Click para expandir análisis</span>
        </div>
      )}
    </div>
  )
}
