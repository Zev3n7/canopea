// src/app/monitoring/page.tsx
'use client'
import dynamic from 'next/dynamic'
import { Activity, Download, Wifi, WifiOff, RefreshCw } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import KpiCard from '@/components/ui/KpiCard'
import { useMonitoreo } from '@/hooks/useFirestore'
import { BALIZA_DEMO } from '@/lib/constants'

const SensorChart  = dynamic(() => import('@/components/ui/SensorChart'),  { ssr: false })
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-dark pt-16">

        {/* ── Page header ── */}
        <div className="border-b border-border-green bg-bg-mid">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-5 h-5 text-lime" />
                  <h1 className="text-xl font-display font-bold">Panel de monitoreo</h1>
                </div>
                <p className="text-text3 text-sm">{BALIZA_DEMO.nombre} · {BALIZA_DEMO.id}</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Connection status */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono ${
                  modoDemo
                    ? 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400'
                    : 'border-lime/20 bg-lime/5 text-lime'
                }`}>
                  {modoDemo ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                  {modoDemo ? 'MODO DEMO' : 'FIREBASE LIVE'}
                </div>

                {/* Last update */}
                {ultima && (
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-text3 font-mono">
                    <RefreshCw className="w-3 h-3" />
                    {tiempoRelativo(ultima.timestamp)}
                  </div>
                )}

                {/* Export */}
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-surface border border-border-green text-text2 hover:text-lime hover:border-lime/30 text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {/* Demo banner */}
          {modoDemo && (
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 flex items-start gap-3">
              <span className="text-yellow-400 mt-0.5">⚠</span>
              <div>
                <p className="text-yellow-400 text-sm font-semibold">Modo demo activo</p>
                <p className="text-yellow-400/70 text-xs mt-0.5">
                  Los datos son simulados. Para datos reales, configura las variables de entorno de Firebase en <code className="font-mono">.env.local</code> y reinicia el servidor.
                </p>
              </div>
            </div>
          )}

          {/* Loading */}
          {cargando ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-surface border border-border-green animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* ── KPI Row ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard sensor="mq2"   value={ultima?.mq2_ppm   ?? 0} label="GLP · Humo · Metano" />
                <KpiCard sensor="mq7"   value={ultima?.mq7_ppm   ?? 0} label="Monóxido de carbono" />
                <KpiCard sensor="mq135" value={ultima?.mq135_ppm ?? 0} label="VOC · NH₃ · NOx"     />

                {/* Summary card */}
                <div className="rounded-2xl border border-border-green bg-surface p-5">
                  <p className="text-xs font-mono text-text3 uppercase tracking-widest mb-3">Última lectura</p>
                  <p className="text-2xl font-bold font-mono text-text">
                    {ultima ? tiempoRelativo(ultima.timestamp) : '—'}
                  </p>
                  <p className="text-xs text-text3 mt-2">{lecturas.length} lecturas guardadas</p>
                  <div className="mt-3 pt-3 border-t border-border-green flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-lime dot-pulse" />
                    <span className="text-xs text-text3 font-mono">Actualización cada 4s</span>
                  </div>
                </div>
              </div>

              {/* ── Charts ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <SensorChart lecturas={lecturas} sensor="mq2_ppm"   color="#84BD01" label="MQ-2 — GLP / Humo"    umbral={1000} />
                <SensorChart lecturas={lecturas} sensor="mq7_ppm"   color="#0DD2EA" label="MQ-7 — CO"            umbral={200}  />
                <SensorChart lecturas={lecturas} sensor="mq135_ppm" color="#7FA832" label="MQ-135 — VOC / NH₃"   umbral={150}  />
              </div>

              {/* ── Tabla historial ── */}
              <div className="bg-surface border border-border-green rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border-green flex items-center justify-between">
                  <h2 className="text-sm font-semibold tracking-wider uppercase text-text2">Historial de lecturas</h2>
                  <span className="text-xs font-mono text-text3">{lecturas.length} registros</span>
                </div>
                <LecturasTable lecturas={lecturas} balizaNombre={BALIZA_DEMO.nombre} />
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
