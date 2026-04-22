// src/components/ui/SensorModal.tsx
'use client'
import { useEffect, useRef } from 'react'
import { X, AlertCircle } from 'lucide-react'
import type { SensorReading } from '@/types'

interface SensorModalProps {
  isOpen: boolean
  onClose: () => void
  lecturas: SensorReading[]
  sensorKey: 'mq2_ppm' | 'mq7_ppm' | 'mq135_ppm'
  color: string
  label: string
  umbral: number
}

function getSensorInfo(key: string) {
  switch(key) {
    case 'mq2_ppm':
      return {
        gas: "GLP, Metano, Humo",
        description: "Transductor de dióxido de estaño (SnO2) altamente sensitivo a gases combustibles como Gas Licuado de Petróleo, Butano, Metano y partículas de humo. Sus niveles aumentan por biomasa en combustión, fugas domésticas o incendios.",
        recomendation: "Mantener alejado de puntos ciegos de ventilación. En interiores, su alerta previene asfixia e intoxicaciones agudas."
      }
    case 'mq7_ppm':
      return {
        gas: "Monóxido de Carbono (CO)",
        description: "Gas altamente tóxico, inodoro e invisible. Producto de combustión incompleta principalmente en escapes automotrices y calefactores. El sensor utiliza un ciclo de temperatura alta/baja para discriminar otros gases.",
        recomendation: "La exposición continua a más de 50ppm causa dolor de cabeza y mareos. >200ppm es letal. Mantener ventilación activa."
      }
    case 'mq135_ppm':
      return {
        gas: "Amoníaco, Sulfuro, Benceno, VOC",
        description: "Sensor de amplio rango enfocado en calidad de aire integral. Detecta Compuestos Orgánicos Volátiles (VOC), gases nocivos en agricultura (Amoníaco) y tolueno. Excelente indicador general de contaminación del aire.",
        recomendation: "Altamente influenciado por la humedad relativa. Si excede 100ppm, se sugiere utilizar purificadores HEPA o extractores."
      }
    default:
      return { gas: "", description: "", recomendation: "" }
  }
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
  return new Date()
}

export default function SensorModal({ isOpen, onClose, lecturas, sensorKey, color, label, umbral }: SensorModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<any>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return

    import('chart.js').then(({ Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip }) => {
      Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip)
      const ctx = canvasRef.current
      if (!ctx || !lecturas.length) return

      // Use up to 100 readings (historico extenso)
      const data = [...lecturas].reverse().slice(-100)
      const labels = data.map(l => tsToDate(l.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }))
      const values = data.map(l => +(l[sensorKey] ?? 0).toFixed(1))

      if (chartRef.current) {
        chartRef.current.data.labels = labels
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
            data: values,
            borderColor: color,
            backgroundColor: color + '18',
            borderWidth: 2,
            pointRadius: 2,
            pointBackgroundColor: color,
            pointBorderColor: '#030D09',
            tension: 0.3,
            fill: true,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false, // disable to prevent redraw bugs in modal
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#172319',
              borderColor: '#1E3520',
              borderWidth: 1,
              titleColor: '#D9EDE3',
              bodyColor: '#8BAF98',
              padding: 10,
              displayColors: false,
            },
          },
          scales: {
            x: {
              grid: { color: 'rgba(30,53,32,.2)' },
              ticks: { color: '#4A6655', font: { size: 10, family: 'JetBrains Mono' }, maxTicksLimit: 12 },
            },
            y: {
              grid: { color: 'rgba(30,53,32,.5)' },
              ticks: { color: '#4A6655', font: { size: 10, family: 'JetBrains Mono' } },
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
  }, [isOpen, lecturas, sensorKey, color, label, umbral])

  if (!isOpen) return null

  const info = getSensorInfo(sensorKey)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030D09]/80 backdrop-blur-sm">
      <div className="bg-[#032221] border border-[#095544] w-full max-w-4xl max-h-[95vh] rounded-2xl shadow-2xl relative animate-fade-up flex flex-col">
        
        {/* Header estático (siempre visible para poder cerrar en móviles) */}
        <div className="flex items-center justify-between p-5 border-b border-[#095544] bg-[#030D09]/50 flex-shrink-0">
          <div>
            <h2 className="text-xl font-display font-bold text-[#F1F7F6] capitalize">{label}</h2>
            <p className="text-[#00DF81] text-xs font-mono tracking-widest mt-1">HISTORIAL AMPLIADO (1 HORA)</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#707D7D] hover:text-[#00DF81] hover:bg-[#00DF81]/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="p-5 md:p-8 flex flex-col gap-8 overflow-y-auto">
          
          {/* Ficha Técnica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#030D09] border border-[#095544] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-[#00DF81]" />
                <span className="text-[#F1F7F6] text-sm font-bold">Gases Detectados</span>
              </div>
              <p className="text-[#00DF81] font-mono text-sm tracking-wide">{info.gas}</p>
              <p className="text-[#AAC8C4] text-xs mt-3 leading-relaxed">
                {info.description}
              </p>
            </div>

            <div className="bg-[#0B453A]/30 border border-[#095544] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-[#F9CB42]" />
                <span className="text-[#F1F7F6] text-sm font-bold">Impacto a la Salud & Normativa</span>
              </div>
              <p className="text-[#AAC8C4] text-xs leading-relaxed">
                {info.recomendation}
              </p>
              <div className="mt-3 pt-3 border-t border-[#095544] flex items-center justify-between">
                <span className="text-xs text-[#707D7D] font-mono">Umbral de precaución:</span>
                <span className="text-sm font-bold text-[#F9CB42] font-mono">{umbral} ppm</span>
              </div>
            </div>
          </div>

          {/* Gráfica Expandida */}
          <div className="relative h-72 md:h-96 w-full flex-shrink-0">
            <canvas ref={canvasRef} />
          </div>
        
        </div>
      </div>
    </div>
  )
}
