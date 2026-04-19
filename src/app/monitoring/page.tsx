// src/app/monitoring/page.tsx
'use client'
import dynamic from 'next/dynamic'
import { Activity, Download, Wifi, WifiOff, RefreshCw, AlertTriangle, Wind, Heart, ShieldAlert } from 'lucide-react'
import PageHeroBanner from '@/components/layout/PageHeroBanner'
import { useMonitoreo } from '@/hooks/useFirestore'
import { BALIZA_DEMO } from '@/lib/constants'
import { calculateAQI, getPollutantsRank } from '@/lib/aqi'

// Mantenemos componentes de graficos dinámicos
const SensorChart   = dynamic(() => import('@/components/ui/SensorChart'),   { ssr: false })
const LecturasTable = dynamic(() => import('@/components/ui/LecturasTable'), { ssr: false })

function tiempoRelativo(ts: any): string {
  const d = ts instanceof Date ? ts : new Date((ts?.seconds ?? 0) * 1000)
  const s = Math.floor((Date.now() - d.getTime()) / 1000)
  if (s < 5)    return 'Ahora mismo'
  if (s < 60)   return `hace ${s}s`
  if (s < 3600) return `hace ${Math.floor(s / 60)}min`
  return d.toLocaleTimeString('es-MX')
}

export default function MonitoringPage() {
  const { lecturas, conectado, modoDemo, cargando, exportCSV } = useMonitoreo(BALIZA_DEMO.id)
  const ultima = lecturas[0]

  const aqi = ultima ? calculateAQI(ultima.mq2_ppm, ultima.mq7_ppm, ultima.mq135_ppm) : null
  const rank = ultima ? getPollutantsRank(ultima.mq2_ppm, ultima.mq7_ppm, ultima.mq135_ppm) : []

  return (
    <main className="min-h-screen bg-[#030D09]">

        <PageHeroBanner
          tag="CANOPEA :: MONITOREO EN VIVO · BALIZA PRINCIPAL"
          title="Panel de monitoreo"
          subtitle="Datos en tiempo real de los sensores MQ-2, MQ-7 y MQ-135. Conectado a base de datos. Actualización cada 4 segundos."
        />

        {/* ── Status bar ── */}
        <div className="border-b border-[#095544] bg-[#032221]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-[#AAC8C4] text-xs font-mono tracking-widest">{BALIZA_DEMO.nombre} · {BALIZA_DEMO.id}</p>
              <div className="flex items-center gap-3">
                {/* Connection */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-mono tracking-widest ${
                  modoDemo
                    ? 'border-[#F9CB42]/30 bg-[#F9CB42]/10 text-[#F9CB42]'
                    : 'border-[#00DF81]/30 bg-[#00DF81]/10 text-[#00DF81]'
                }`}>
                  {modoDemo ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                  {modoDemo ? 'MODO DEMO' : 'LIVE'}
                </div>
                {ultima && (
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#AAC8C4] font-mono tracking-widest">
                    <RefreshCw className="w-3 h-3" />
                    {tiempoRelativo(ultima.timestamp)}
                  </div>
                )}
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-4 py-1.5 rounded bg-[#030D09] border border-[#095544] text-[#F1F7F6] hover:text-[#00DF81] hover:border-[#00DF81]/50 text-xs font-mono transition-colors tracking-widest uppercase"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

          {/* Demo banner */}
          {modoDemo && (
            <div className="rounded-xl border border-[#F9CB42]/30 bg-[#F9CB42]/5 p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#F9CB42] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#F9CB42] text-sm font-semibold mb-1">Modo demo activo (Datos Simulados)</p>
                <p className="text-[#F9CB42]/80 text-xs leading-relaxed">
                  Para obtener datos reales, configura las variables de entorno de Firebase en <code className="font-mono bg-[#030D09] px-1 py-0.5 rounded text-[#F9CB42] border border-[#F9CB42]/20">.env.local</code> y reinicia el servidor.
                </p>
              </div>
            </div>
          )}

          {/* Content States */}
          {cargando ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              <div className="md:col-span-2 h-64 rounded-2xl bg-[#032221] border border-[#095544]" />
              <div className="h-64 rounded-2xl bg-[#032221] border border-[#095544]" />
            </div>
          ) : !ultima || !aqi ? (
            <div className="bg-[#032221] border border-[#095544] rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
              <AlertTriangle className="w-10 h-10 text-[#707D7D] mb-4" />
              <h2 className="text-[#F1F7F6] text-xl font-bold mb-2">No hay lecturas disponibles</h2>
              <p className="text-[#AAC8C4] text-sm">La baliza está conectada pero aún no ha transmitido datos a la base de datos.</p>
            </div>
          ) : (
            <>
              {/* ── Dashboard Top AQI Section ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* AQI General Card */}
                <div 
                  className="lg:col-span-2 rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between"
                  style={{ backgroundColor: aqi.color }}
                >
                  {/* Background decoration */}
                  <div className="absolute right-0 top-0 opacity-10 blur-xl pointer-events-none translate-x-1/4 -translate-y-1/4">
                    <Wind className="w-96 h-96 text-[#030D09]" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <Wind className="w-5 h-5 text-[#030D09]" />
                      <span className="text-sm font-bold tracking-widest text-[#030D09] uppercase">Índice General • Canopea</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 mb-8">
                      <div>
                        <div className="text-[10px] font-mono tracking-widest text-[#030D09]/70 uppercase mb-1">Principal Contaminante</div>
                        <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#030D09]">{aqi.primaryPollutant}</h2>
                      </div>
                      <div className="flex-1" />
                      <div className="text-left sm:text-right">
                        <div className="text-[10px] font-mono tracking-widest text-[#030D09]/70 uppercase mb-1">Impacto Relativo</div>
                        <div className="text-4xl sm:text-5xl font-mono block font-black tracking-tighter text-[#030D09]">
                          {aqi.score.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#030D09]/10 rounded-xl p-4 border border-[#030D09]/10">
                      <div className="flex items-start gap-3">
                        <div className="bg-[#030D09] text-white px-3 py-1 rounded text-xs font-bold tracking-wider uppercase">
                          {aqi.level}
                        </div>
                        <p className="text-sm font-semibold text-[#030D09] pt-0.5">{aqi.healthMsg}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health & Analytics Sidebar */}
                <div className="flex flex-col gap-6">
                  {/* Top Pollutants Widget */}
                  <div className="bg-[#032221] border border-[#095544] rounded-2xl p-5">
                    <h3 className="text-[#AAC8C4] text-[10px] font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Activity className="w-3 h-3" />
                      Concentración Actual
                    </h3>
                    <div className="space-y-4">
                      {rank.map((pol) => (
                        <div key={pol.id}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-[#F1F7F6] font-medium">{pol.name}</span>
                            <span className="text-[#00DF81] font-mono font-bold">{pol.val.toFixed(0)} {pol.unit}</span>
                          </div>
                          <div className="h-1.5 bg-[#030D09] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#00DF81] rounded-full" 
                              style={{ width: `${Math.min(100, pol.pct)}%`, backgroundColor: pol.pct > 100 ? '#E63946' : pol.pct > 50 ? '#F9CB42' : '#00DF81' }} 
                            />
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-[9px] text-[#707D7D] font-mono">0</span>
                            <span className="text-[9px] text-[#707D7D] font-mono">{pol.umbral} max</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-[#032221] border border-[#095544] rounded-2xl p-5 flex-1">
                    <h3 className="text-[#AAC8C4] text-[10px] font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
                      {aqi.level === 'EXCELENTE' || aqi.level === 'BUENO' ? <Heart className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3 text-[#E63946]"/>}
                      Consejos de cuidado
                    </h3>
                    <ul className="space-y-3">
                      {aqi.tips.map((tip, idx) => (
                        <li key={idx} className="flex gap-2 items-start text-xs text-[#AAC8C4]">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: aqi.color }} />
                          <span className="leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

              {/* ── Charts ── */}
              <div className="pt-4">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-[#F1F7F6] text-xl font-display font-bold">Tendencia en Tiempo Real</h2>
                  <div className="h-[1px] flex-1 bg-[#095544]" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-[#032221] rounded-xl border border-[#095544] p-3">
                    <SensorChart lecturas={lecturas} sensor="mq2_ppm"   color="#00DF81" label="GLP / Metano / Humo (MQ-2)" umbral={1000} />
                  </div>
                  <div className="bg-[#032221] rounded-xl border border-[#095544] p-3">
                    <SensorChart lecturas={lecturas} sensor="mq7_ppm"   color="#2CC295" label="Monóxido de Carbono (MQ-7)" umbral={200}  />
                  </div>
                  <div className="bg-[#032221] rounded-xl border border-[#095544] p-3">
                    <SensorChart lecturas={lecturas} sensor="mq135_ppm" color="#0DD2EA" label="VOC / NH₃ (MQ-135)"         umbral={150}  />
                  </div>
                </div>
              </div>

              {/* ── Tabla historial ── */}
              <div className="bg-[#032221] border border-[#095544] rounded-2xl overflow-hidden mt-8">
                <div className="px-6 py-4 border-b border-[#095544] flex items-center justify-between">
                  <h2 className="text-sm font-semibold tracking-wider uppercase text-[#F1F7F6]">Historial del día</h2>
                  <span className="text-xs font-mono text-[#AAC8C4]">{lecturas.length} registros recientes</span>
                </div>
                <LecturasTable lecturas={lecturas} balizaNombre={BALIZA_DEMO.nombre} />
              </div>
            </>
          )}
        </div>
      </main>
  )
}
