'use client'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import {
  Activity, Download, Wifi, WifiOff, RefreshCw,
  AlertTriangle, Wind, Heart, ShieldAlert, Leaf,
  Thermometer, Droplets, Info
} from 'lucide-react'
import PageHeroBanner from '@/components/layout/PageHeroBanner'
import { useMonitoreo } from '@/hooks/useFirestore'
import { BALIZA_DEMO } from '@/lib/constants'
import { calculateAQI, getPollutantsRank, UMBRALES } from '@/lib/aqi'
import SensorModal from '@/components/ui/SensorModal'

const SensorChart = dynamic(() => import('@/components/ui/SensorChart'), { ssr: false })
const LecturasTable = dynamic(() => import('@/components/ui/LecturasTable'), { ssr: false })

// ─── Utilidades ───────────────────────────────────────────────────────────────
function tiempoRelativo(ts: any): string {
  const d = ts instanceof Date ? ts : new Date((ts?.seconds ?? 0) * 1000)
  const s = Math.floor((Date.now() - d.getTime()) / 1000)
  if (s < 5) return 'Ahora mismo'
  if (s < 60) return `hace ${s}s`
  if (s < 3600) return `hace ${Math.floor(s / 60)}min`
  return d.toLocaleTimeString('es-MX')
}

function getPollutantInfo(name: string) {
  if (name.includes('VOC') || name.includes('NH'))
    return 'Los Compuestos Orgánicos Volátiles y el Amoníaco son toxinas procedentes de fertilizantes, desechos de biomasa y productos químicos que afectan directamente la calidad ambiental.'
  if (name.includes('Monóxido') || name.includes('CO'))
    return 'El Monóxido de Carbono (CO) es un gas tóxico altamente peligroso asociado a la combustión incompleta de vehículos e industria pesada. Límite NOM-021: 7 ppm / 1h.'
  if (name.includes('GLP') || name.includes('Humo'))
    return 'Presencia de gases combustibles y humo. Su alza puede indicar fugas de gas licuado o actividad de fuego cercana. Alerta de seguridad: 500 ppm (10% LEL).'
  return ''
}

// ─── Gauge semicircular SVG ───────────────────────────────────────────────────
function Gauge({ pct, color, size = 80 }: { pct: number; color: string; size?: number }) {
  const r = size * 0.42
  const cx = size / 2
  const cy = size * 0.56
  const circ = Math.PI * r          // semicírculo
  const fill = circ * Math.min(pct, 100) / 100

  return (
    <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
      {/* Track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="#095544" strokeWidth={size * 0.09} strokeLinecap="round"
      />
      {/* Fill */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke={color} strokeWidth={size * 0.09} strokeLinecap="round"
        strokeDasharray={`${fill} ${circ}`}
        style={{ transition: 'stroke-dasharray 0.7s ease' }}
      />
      <text
        x={cx} y={cy - size * 0.04}
        textAnchor="middle" dominantBaseline="central"
        fontSize={size * 0.165} fontWeight="600" fill="#F1F7F6" fontFamily="monospace"
      >
        {Math.round(pct)}%
      </text>
    </svg>
  )
}

// ─── Semáforo ICA ─────────────────────────────────────────────────────────────
const ICA_STEPS = [
  { key: 'BUENA', color: '#00DF81', bg: 'rgba(0,223,129,0.12)', label: 'Buena', sub: 'Riesgo bajo' },
  { key: 'ACEPTABLE', color: '#F9CB42', bg: 'rgba(249,203,66,0.12)', label: 'Aceptable', sub: 'Moderado' },
  { key: 'MALA', color: '#FF8C00', bg: 'rgba(255,140,0,0.12)', label: 'Mala', sub: 'Riesgo alto' },
  { key: 'MUY MALA', color: '#E63946', bg: 'rgba(230,57,70,0.12)', label: 'Muy mala', sub: 'Muy alto' },
  { key: 'EXTREMADAMENTE MALA', color: '#8B008B', bg: 'rgba(139,0,139,0.12)', label: 'Peligrosa', sub: 'Emergencia' },
]

function Semaforo({ level }: { level: string }) {
  return (
    <div className="flex gap-2 mb-5">
      {ICA_STEPS.map(step => {
        const active = step.key === level
        return (
          <div
            key={step.key}
            className="flex-1 rounded-xl px-2 py-2 text-center border transition-all duration-400"
            style={{
              background: active ? step.bg : 'transparent',
              borderColor: active ? step.color : '#095544',
              borderWidth: active ? '1.5px' : '0.5px',
              opacity: active ? 1 : 0.35,
            }}
          >
            <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ background: step.color }} />
            <span className="block text-[10px] font-semibold" style={{ color: active ? step.color : '#AAC8C4' }}>
              {step.label}
            </span>
            <span className="block text-[9px]" style={{ color: active ? step.color : '#707D7D', opacity: 0.8 }}>
              {step.sub}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Sensor Card ──────────────────────────────────────────────────────────────
const LEVEL_COLOR: Record<string, string> = {
  BUENA: '#00DF81', ACEPTABLE: '#F9CB42', MALA: '#FF8C00',
  'MUY MALA': '#E63946', 'EXTREMADAMENTE MALA': '#8B008B',
}
const LEVEL_BG: Record<string, string> = {
  BUENA: 'rgba(0,223,129,0.1)', ACEPTABLE: 'rgba(249,203,66,0.1)', MALA: 'rgba(255,140,0,0.1)',
  'MUY MALA': 'rgba(230,57,70,0.1)', 'EXTREMADAMENTE MALA': 'rgba(139,0,139,0.1)',
}

function levelFromPct(pct: number): string {
  if (pct <= 50) return 'BUENA'
  if (pct <= 100) return 'ACEPTABLE'
  if (pct <= 150) return 'MALA'
  if (pct <= 200) return 'MUY MALA'
  return 'EXTREMADAMENTE MALA'
}

interface SensorCardProps {
  name: string
  subtitle: string
  pct: number
  rows: { label: string; value: string; highlight?: boolean }[]
  nomRows?: { label: string; value: string }[]
  badge: string
}
function SensorCard({ name, subtitle, pct, rows, nomRows, badge }: SensorCardProps) {
  const level = levelFromPct(pct)
  const col = LEVEL_COLOR[level]
  return (
    <div
      className="rounded-2xl p-4 border flex flex-col gap-2 transition-all duration-500"
      style={{
        background: '#032221',
        borderColor: pct > 100 ? col : '#095544',
        borderWidth: pct > 100 ? '1.5px' : '0.5px',
      }}
    >
      <div>
        <div className="text-[10px] font-mono tracking-widest text-[#AAC8C4] uppercase mb-0.5">{name}</div>
        <div className="text-[10px] text-[#707D7D]">{subtitle}</div>
      </div>

      <div className="flex justify-center">
        <Gauge pct={pct} color={col} size={84} />
      </div>

      <div className="flex flex-col gap-1.5">
        {rows.map(r => (
          <div key={r.label} className="flex justify-between items-center text-xs">
            <span className="text-[#707D7D]">{r.label}</span>
            <span
              className="font-mono font-semibold"
              style={{ color: r.highlight ? col : '#F1F7F6' }}
            >
              {r.value}
            </span>
          </div>
        ))}
        {nomRows?.map(r => (
          <div key={r.label} className="flex justify-between items-center text-[10px]">
            <span className="text-[#3d6660]">{r.label}</span>
            <span className="font-mono text-[#3d6660]">{r.value}</span>
          </div>
        ))}
      </div>

      <div
        className="mt-1 text-center text-[10px] font-semibold py-1 rounded-lg"
        style={{ background: LEVEL_BG[level], color: col }}
      >
        {badge}
      </div>
    </div>
  )
}

// ─── Barra de riesgo ──────────────────────────────────────────────────────────
function RiskBar({ label, pct, nom }: { label: string; pct: number; nom: string }) {
  const level = levelFromPct(pct)
  const col = LEVEL_COLOR[level]
  const lbl = level === 'BUENA' ? 'Buena' : level === 'ACEPTABLE' ? 'Aceptable' :
    level === 'MALA' ? 'Mala' : level === 'MUY MALA' ? 'Muy mala' : 'Peligrosa'
  return (
    <div className="bg-[#032221] border border-[#095544] rounded-xl p-3 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-[#AAC8C4]">{label}</span>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: LEVEL_BG[level], color: col }}
        >
          {lbl}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#0a2e28' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(pct, 100)}%`, background: col }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-[9px] text-[#3d6660] font-mono">{nom}</span>
        <span className="text-[9px] text-[#3d6660] font-mono">{Math.round(pct)}%</span>
      </div>
    </div>
  )
}

// ─── Panel de cuidado ─────────────────────────────────────────────────────────
const CARE_CARDS = [
  {
    icon: '🟢', title: 'Calidad buena · Riesgo bajo',
    items: [
      { label: 'Actividades al aire libre', value: 'sin restricción' },
      { label: 'Ejercicio exterior', value: 'permitido normalmente' },
      { label: 'Ventanas abiertas', value: 'recomendadas' },
      { label: 'Grupos vulnerables', value: 'sin precauciones especiales' },
    ],
  },
  {
    icon: '🟡', title: 'Calidad aceptable · Moderado',
    items: [
      { label: 'Ejercicio intenso', value: 'reducir duración' },
      { label: 'Niños y adultos mayores', value: 'evitar exposición prolongada' },
      { label: 'Asma / enf. respiratoria', value: 'llevar medicamento' },
      { label: 'Ventanas', value: 'filtrar o cerrar al mediodía' },
    ],
  },
  {
    icon: '🟠', title: 'Calidad mala · Riesgo alto',
    items: [
      { label: 'Ejercicio exterior', value: 'posponer o evitar' },
      { label: 'Tiempo fuera de casa', value: 'limitar al mínimo' },
      { label: 'Cubrebocas N95', value: 'si debes salir' },
      { label: 'Grupos vulnerables', value: 'permanecer en interior' },
    ],
  },
  {
    icon: '🔴', title: 'Muy mala / Peligrosa · Emergencia',
    items: [
      { label: 'Toda la población', value: 'permanecer en interior' },
      { label: 'Puertas y ventanas', value: 'cerrar inmediatamente' },
      { label: 'Actividades y clases', value: 'suspender' },
      { label: 'CO alto', value: 'evacuar y llamar a emergencias' },
    ],
  },
]

function CarePanel() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {CARE_CARDS.map(card => (
        <div key={card.title} className="bg-[#032221] border border-[#095544] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">{card.icon}</span>
            <span className="text-xs font-semibold text-[#F1F7F6]">{card.title}</span>
          </div>
          <div className="flex flex-col gap-2">
            {card.items.map(it => (
              <div key={it.label} className="flex justify-between text-xs">
                <span className="text-[#707D7D]">{it.label}</span>
                <span className="text-[#AAC8C4] font-medium text-right ml-2">{it.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Tabla NOM ────────────────────────────────────────────────────────────────
const NOM_ROWS = [
  { gas: 'CO', sensor: 'MQ7', limite: '7 ppm', promedio: '1 hora', norma: 'NOM-021-SSA1-2021', aplica: 'Exterior' },
  { gas: 'CO', sensor: 'MQ7', limite: '5 ppm', promedio: '8 horas', norma: 'NOM-021-SSA1-2021', aplica: 'Exterior' },
  { gas: 'COVs', sensor: 'MQ135', limite: '0.1 mg/m³', promedio: 'Anual', norma: 'OMS', aplica: 'Exterior' },
  { gas: 'GLP', sensor: 'MQ2', limite: '500 ppm', promedio: 'Instantáneo', norma: 'NFPA 58 (10% LEL)', aplica: 'Seguridad' },
  { gas: 'Metano', sensor: 'MQ2', limite: '1,000 ppm', promedio: 'Instantáneo', norma: '10% LEL CH4', aplica: 'Seguridad' },
]

function NomTable() {
  return (
    <div className="bg-[#032221] border border-[#095544] rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-[#095544]">
        <span className="text-[10px] font-mono tracking-widest text-[#AAC8C4] uppercase">
          Límites normativos de referencia
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#095544]">
              {['Gas', 'Sensor', 'Límite', 'Promedio', 'Norma', 'Aplica en'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[#707D7D] font-medium tracking-wider text-[10px] uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NOM_ROWS.map((r, i) => (
              <tr key={i} className="border-b border-[#095544]/50 hover:bg-[#095544]/20 transition-colors">
                <td className="px-4 py-2.5 text-[#F1F7F6] font-medium">{r.gas}</td>
                <td className="px-4 py-2.5 font-mono text-[#00DF81]">{r.sensor}</td>
                <td className="px-4 py-2.5 font-mono text-[#F1F7F6]">{r.limite}</td>
                <td className="px-4 py-2.5 text-[#AAC8C4]">{r.promedio}</td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${r.norma === 'OMS'
                      ? 'bg-[#085041]/60 text-[#00DF81]'
                      : 'bg-[#1D3E5A]/60 text-[#2CC295]'
                    }`}>
                    {r.norma}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-[#707D7D]">{r.aplica}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
type ActiveSensor = {
  key: 'mq2_ppm' | 'mq7_ppm' | 'mq135_ppm'
  color: string
  label: string
  umbral: number
} | null

export default function MonitoringPage() {
  const { lecturas, conectado, cargando, exportCSV } = useMonitoreo(BALIZA_DEMO.id)
  const ultima = lecturas[0]
  const [sensorActivo, setSensorActivo] = useState<ActiveSensor>(null)
  const [activeTab, setActiveTab] = useState<'co' | 'glp' | 'covs'>('co')

  const aqi = ultima ? calculateAQI(ultima.mq2_ppm, ultima.mq7_ppm, ultima.mq135_ppm) : null
  const rank = ultima ? getPollutantsRank(ultima.mq2_ppm, ultima.mq7_ppm, ultima.mq135_ppm) : []

  // Porcentajes relativos para gauges y barras
  const pctMQ2 = ultima ? (Number(ultima.mq2_ppm) / UMBRALES.mq2) * 100 : 0
  const pctMQ7 = ultima ? (Number(ultima.mq7_ppm) / UMBRALES.mq7) * 100 : 0
  const pctMQ135 = ultima ? (Number(ultima.mq135_ppm) / UMBRALES.mq135) * 100 : 0

  // Color del banner según nivel
  const bannerColor = aqi ? LEVEL_COLOR[aqi.level] ?? '#00DF81' : '#00DF81'
  const bannerIcon = aqi
    ? { BUENA: '🟢', ACEPTABLE: '🟡', MALA: '🟠', 'MUY MALA': '🔴', 'EXTREMADAMENTE MALA': '🔴' }[aqi.level] ?? '🟢'
    : '🟢'

  return (
    <main className="min-h-screen bg-[#030D09]">
      <PageHeroBanner
        tag="CANOPEA :: MONITOREO EN VIVO · BALIZA PRINCIPAL"
        title="Panel de monitoreo"
        subtitle="Datos en tiempo real de los sensores MQ-2, MQ-7 y MQ-135. Actualización cada 60 segundos."
      />

      {/* ── Status bar ── */}
      <div className="border-b border-[#095544] bg-[#032221]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-[#AAC8C4] text-xs font-mono tracking-widest">
              {BALIZA_DEMO.nombre} · {BALIZA_DEMO.id}
            </p>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-mono tracking-widest ${!conectado
                  ? 'border-[#F9CB42]/30 bg-[#F9CB42]/10 text-[#F9CB42]'
                  : 'border-[#00DF81]/30 bg-[#00DF81]/10 text-[#00DF81]'
                }`}>
                {!conectado
                  ? <WifiOff className="w-3.5 h-3.5" />
                  : <><span className="w-1.5 h-1.5 rounded-full bg-[#00DF81] animate-pulse" /><Wifi className="w-3.5 h-3.5" /></>
                }
                {!conectado ? 'DESCONECTADO' : 'LIVE'}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Estados de carga ── */}
        {cargando ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            <div className="md:col-span-2 h-64 rounded-2xl bg-[#032221] border border-[#095544]" />
            <div className="h-64 rounded-2xl bg-[#032221] border border-[#095544]" />
          </div>
        ) : !ultima || !aqi ? (
          <div className="bg-[#032221] border border-[#095544] rounded-2xl p-10 text-center flex flex-col items-center min-h-[300px] justify-center">
            <AlertTriangle className="w-10 h-10 text-[#707D7D] mb-4" />
            <h2 className="text-[#F1F7F6] text-xl font-bold mb-2">No hay lecturas disponibles</h2>
            <p className="text-[#AAC8C4] text-sm">La baliza está conectada pero aún no ha transmitido datos.</p>
          </div>
        ) : (
          <>
            {/* ════════════════════════════════════════════════════════
                SECCIÓN 1 — SEMÁFORO + BANNER
            ════════════════════════════════════════════════════════ */}
            <section>
              <p className="text-[10px] font-mono tracking-widest text-[#3d6660] uppercase mb-3">
                Índice de calidad del aire (ICA)
              </p>
              <Semaforo level={aqi.level} />

              {/* Banner de estado */}
              <p className="text-[10px] font-mono tracking-widest text-[#3d6660] uppercase mb-2">
                Estado actual
              </p>
              <div
                className="rounded-2xl p-4 flex items-center gap-3 border transition-all duration-500"
                style={{
                  background: `${bannerColor}14`,
                  borderColor: `${bannerColor}40`,
                }}
              >
                <span className="text-lg">{bannerIcon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: bannerColor }}>
                    {aqi.healthMsg}
                  </p>
                  <p className="text-xs text-[#AAC8C4] mt-0.5 truncate">
                    {getPollutantInfo(aqi.primaryPollutant)}
                  </p>
                </div>
                <span className="text-xs text-[#3d6660] font-mono whitespace-nowrap">
                  {ultima && tiempoRelativo(ultima.timestamp)}
                </span>
              </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                SECCIÓN 2 — SENSOR CARDS
            ════════════════════════════════════════════════════════ */}
            <section>
              <p className="text-[10px] font-mono tracking-widest text-[#3d6660] uppercase mb-3">
                Lecturas en tiempo real
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SensorCard
                  name="MQ2"
                  subtitle="GLP · Metano · Humo"
                  pct={pctMQ2}
                  rows={[
                    { label: 'GLP', value: `${Number(ultima.mq2_ppm).toFixed(0)} ppm`, highlight: pctMQ2 > 50 },
                    { label: 'Metano', value: '— ppm' },
                    { label: 'Humo', value: '— ppm' },
                  ]}
                  nomRows={[{ label: 'Umbral NFPA', value: '500 ppm' }]}
                  badge={levelFromPct(pctMQ2)}
                />
                <SensorCard
                  name="MQ7"
                  subtitle="Monóxido de carbono"
                  pct={pctMQ7}
                  rows={[
                    { label: 'CO', value: `${Number(ultima.mq7_ppm).toFixed(2)} ppm`, highlight: pctMQ7 > 50 },
                    { label: 'NOM 1h', value: '7 ppm' },
                    { label: 'NOM 8h', value: '5 ppm' },
                  ]}
                  badge={levelFromPct(pctMQ7)}
                />
                <SensorCard
                  name="MQ135"
                  subtitle="COVs · NH₃ · Calidad"
                  pct={pctMQ135}
                  rows={[
                    { label: 'COVs', value: `${Number(ultima.mq135_ppm).toFixed(2)} ppm`, highlight: pctMQ135 > 50 },
                    { label: 'Índice', value: `${Math.round(Math.max(0, 100 - pctMQ135))}` },
                    { label: 'Calidad', value: levelFromPct(pctMQ135) === 'BUENA' ? 'Excelente' : levelFromPct(pctMQ135) },
                  ]}
                  nomRows={[{ label: 'Umbral exterior', value: '80 ppm' }]}
                  badge={levelFromPct(pctMQ135)}
                />
              </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                SECCIÓN 3 — BARRAS DE RIESGO
            ════════════════════════════════════════════════════════ */}
            <section>
              <p className="text-[10px] font-mono tracking-widest text-[#3d6660] uppercase mb-3">
                Nivel de riesgo por contaminante
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <RiskBar label="CO (salud)" pct={pctMQ7} nom="NOM-021: 5 ppm / 8h" />
                <RiskBar label="GLP (seguridad)" pct={pctMQ2} nom="Alerta: >500 ppm exterior" />
                <RiskBar label="COVs (calidad)" pct={pctMQ135} nom="OMS: <0.1 mg/m³" />
              </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                SECCIÓN 4 — HISTORIAL
            ════════════════════════════════════════════════════════ */}
            <section>
              <div className="bg-[#032221] border border-[#095544] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-mono tracking-widest text-[#AAC8C4] uppercase">
                    Historial · últimas lecturas
                  </p>
                  <div className="flex gap-1">
                    {(['co', 'glp', 'covs'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider border transition-all"
                        style={{
                          background: activeTab === tab ? '#095544' : 'transparent',
                          borderColor: activeTab === tab ? '#00DF81' : '#095544',
                          color: activeTab === tab ? '#00DF81' : '#707D7D',
                        }}
                      >
                        {tab.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Usamos SensorChart existente según tab activo */}
                <div className="rounded-xl border border-[#095544] overflow-hidden bg-[#030D09] p-3">
                  {activeTab === 'co' && (
                    <SensorChart lecturas={lecturas} sensor="mq7_ppm"
                      color="#2CC295" label="Monóxido de Carbono — MQ-7 (ppm)"
                      umbral={7}
                      onClick={() => setSensorActivo({ key: 'mq7_ppm', color: '#2CC295', label: 'Monóxido de Carbono (MQ-7)', umbral: 7 })}
                    />
                  )}
                  {activeTab === 'glp' && (
                    <SensorChart lecturas={lecturas} sensor="mq2_ppm"
                      color="#00DF81" label="GLP / Metano / Humo — MQ-2 (ppm)"
                      umbral={500}
                      onClick={() => setSensorActivo({ key: 'mq2_ppm', color: '#00DF81', label: 'GLP / Metano / Humo (MQ-2)', umbral: 500 })}
                    />
                  )}
                  {activeTab === 'covs' && (
                    <SensorChart lecturas={lecturas} sensor="mq135_ppm"
                      color="#0DD2EA" label="VOC / NH₃ — MQ-135 (ppm)"
                      umbral={80}
                      onClick={() => setSensorActivo({ key: 'mq135_ppm', color: '#0DD2EA', label: 'VOC / NH₃ (MQ-135)', umbral: 80 })}
                    />
                  )}
                </div>
              </div>
            </section>

            {/* Modal de detalle */}
            {sensorActivo && (
              <SensorModal
                isOpen={!!sensorActivo}
                onClose={() => setSensorActivo(null)}
                lecturas={lecturas}
                sensorKey={sensorActivo.key}
                color={sensorActivo.color}
                label={sensorActivo.label}
                umbral={sensorActivo.umbral}
              />
            )}

            {/* ════════════════════════════════════════════════════════
                SECCIÓN 5 — PANEL DE CUIDADO
            ════════════════════════════════════════════════════════ */}
            <section>
              <p className="text-[10px] font-mono tracking-widest text-[#3d6660] uppercase mb-3">
                Recomendaciones de cuidado por nivel
              </p>
              <CarePanel />
            </section>

            {/* ════════════════════════════════════════════════════════
                SECCIÓN 6 — HISTORIAL TABLA + DOCS
            ════════════════════════════════════════════════════════ */}
            <section>
              <div className="bg-[#032221] border border-[#095544] rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-[#095544] flex items-center justify-between">
                  <h2 className="text-xs font-semibold tracking-widest uppercase text-[#F1F7F6]">
                    Historial del día
                  </h2>
                  <span className="text-xs font-mono text-[#AAC8C4]">
                    {lecturas.length} registros
                  </span>
                </div>
                <LecturasTable lecturas={lecturas} balizaNombre={BALIZA_DEMO.nombre} />
              </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                SECCIÓN 7 — TABLA NOM + ALGORITMO
            ════════════════════════════════════════════════════════ */}
            <section>
              <NomTable />
            </section>

            <section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Algoritmo */}
                <div className="bg-[#032221] border border-[#095544] rounded-2xl p-6">
                  <h3 className="text-[#F1F7F6] text-base font-bold mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#00DF81]" />
                    Algoritmo y escalas (NOM-172)
                  </h3>
                  <p className="text-xs text-[#AAC8C4] leading-relaxed mb-4">
                    El algoritmo compara la concentración detectada (ppm) de cada sensor contra
                    su <strong className="text-[#F1F7F6]">umbral máximo normativo</strong>.
                    El gas con mayor porcentaje relativo determina el contaminante principal y el nivel ICA.
                  </p>
                  <div className="bg-[#030D09] rounded-xl p-4 border border-[#095544]/50 space-y-2">
                    {[
                      { color: '#00DF81', range: '0 – 50%', label: 'BUENA', sub: 'Riesgo Bajo' },
                      { color: '#F9CB42', range: '51 – 100%', label: 'ACEPTABLE', sub: 'Riesgo Moderado' },
                      { color: '#FF8C00', range: '101 – 150%', label: 'MALA', sub: 'Supera NOM (CO > 7 ppm)' },
                      { color: '#E63946', range: '151 – 200%', label: 'MUY MALA', sub: 'Riesgo Muy Alto' },
                      { color: '#8B008B', range: '> 200%', label: 'EXTREMADAMENTE MALA', sub: 'Emergencia' },
                    ].map(r => (
                      <div key={r.label} className="flex items-center gap-3 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: r.color }} />
                        <span className="font-mono text-[#3d6660] w-20 flex-shrink-0">{r.range}</span>
                        <span className="font-semibold" style={{ color: r.color }}>{r.label}</span>
                        <span className="text-[#707D7D] text-[10px] ml-auto">{r.sub}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contaminación ambiental */}
                <div className="bg-[#032221] border border-[#095544] rounded-2xl p-6 h-80 overflow-y-auto">
                  <h3 className="text-[#F1F7F6] text-base font-bold mb-4 flex items-center gap-2">
                    <Wind className="w-4 h-4 text-[#00DF81]" />
                    Contaminación ambiental
                  </h3>
                  <div className="space-y-4 text-xs text-[#AAC8C4] leading-relaxed">
                    {[
                      { title: '¿Qué es la contaminación?', body: 'Se entiende como la introducción de sustancias, organismos o formas de energía en ambientes donde no pertenecen, o en cantidades superiores a las propias de dichos sustratos, por tiempo suficiente para interferir con la salud, la comodidad de las personas, dañar recursos naturales o alterar el equilibrio ecológico.' },
                      { title: 'Origen y causas principales', body: 'Los efectos más graves ocurren cuando la entrada de sustancias al ambiente rebasa la capacidad de los ecosistemas para asimilarlas. Las principales causas son actividades industriales, agrícolas, explotación de energéticos fósiles y actividades domésticas.' },
                      { title: 'Efectos en la salud', body: 'Una sustancia se considera tóxica si causa daño funcional o anatómico en los organismos expuestos. La contaminación puede ocasionar muertes, mutaciones, cáncer, alteraciones neurológicas y sensitivas.' },
                      { title: 'Prevención y control', body: 'Los contaminantes químicos sintéticos no disponen de mecanismos naturales de eliminación. Su erradicación recae en políticas como el Protocolo de Montreal, la monitorización continua y educación — pilar fundacional de la red Canopea.' },
                    ].map(sec => (
                      <div key={sec.title}>
                        <h4 className="text-[#F1F7F6] font-semibold mb-1">{sec.title}</h4>
                        <p>{sec.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}