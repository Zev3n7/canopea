// src/lib/aqi.ts
import { UMBRALES } from './constants'

export type AQILevel = 'EXCELENTE' | 'BUENO' | 'MODERADO' | 'MALO' | 'PELIGROSO'

export interface AQIStatus {
  level: AQILevel
  score: number           // 0 to 100+ based on mostly max relative threshold
  primaryPollutant: string
  color: string           // Hex code for UI
  bgLight: string
  tips: string[]
  healthMsg: string
}

const AQI_RANGES = [
  { max: 20, level: 'EXCELENTE' as AQILevel, color: '#00DF81', bgLight: 'rgba(0,223,129,0.08)', healthMsg: 'La calidad del aire es estelar. Condiciones ideales.', tips: ['Ideal para actividades físicas al aire libre', 'Abre ventanas para ventilar interiores', 'Ningún riesgo para la salud'] },
  { max: 50, level: 'BUENO' as AQILevel,     color: '#2CC295', bgLight: 'rgba(44,194,149,0.08)', healthMsg: 'La calidad del aire es aceptable. Seguro para todos.', tips: ['Seguro para actividades en exteriores', 'Personas inusualmente sensibles deben considerar precauciones mínimas'] },
  { max: 80, level: 'MODERADO' as AQILevel,  color: '#F9CB42', bgLight: 'rgba(249,203,66,0.08)',  healthMsg: 'Contaminación detectable. Grupos sensibles en riesgo sutil.', tips: ['Grupos sensibles (asmáticos, niños, ancianos) deben limitar esfuerzo prolongado', 'Considera reducir el tiempo de ejercicio exterior', 'Monitorea síntomas respiratorios si eres vulnerable'] },
  { max: 100, level: 'MALO' as AQILevel,     color: '#FF6B35', bgLight: 'rgba(255,107,53,0.08)',  healthMsg: 'El aire es insalubre. Riesgo de afecciones respiratorias.', tips: ['Público en general debe reducir actividades intensas al aire libre', 'Grupos sensibles DEBEN usar mascarilla o permanecer en interiores', 'Cierra ventanas si el origen es humo/exterior'] },
  { max: Infinity, level: 'PELIGROSO' as AQILevel, color: '#E63946', bgLight: 'rgba(230,57,70,0.08)', healthMsg: 'Emergencia de salud pública por contaminación severa.', tips: ['PERMANECE EN INTERIORES con ventanas cerradas', 'Evita absolutamente todo esfuerzo exterior', 'Usa purificadores de aire si es posible', 'Utiliza mascarilla N95 respiratoria obligatoria en exterior'] },
]

export function calculateAQI(mq2: number, mq7: number, mq135: number): AQIStatus {
  const pMQ2   = (mq2 / UMBRALES.mq2) * 100
  const pMQ7   = (mq7 / UMBRALES.mq7) * 100
  const pMQ135 = (mq135 / UMBRALES.mq135) * 100

  // The dominant pollutant defines the overall score
  const pollutants = [
    { name: 'GLP / Metano / Humo', val: pMQ2 },
    { name: 'CO (Monóxido de Carbono)', val: pMQ7 },
    { name: 'VOC / NH₃ (Amoníaco)', val: pMQ135 }
  ]

  const maxPol = pollutants.reduce((prev, current) => (prev.val > current.val) ? prev : current)
  const score = isNaN(maxPol.val) ? 0 : maxPol.val

  const range = AQI_RANGES.find(r => score <= r.max) || AQI_RANGES[AQI_RANGES.length - 1]

  return {
    level: range.level,
    score: score,
    primaryPollutant: maxPol.name,
    color: range.color,
    bgLight: range.bgLight,
    tips: range.tips,
    healthMsg: range.healthMsg
  }
}

export function getPollutantsRank(mq2: number, mq7: number, mq135: number) {
  return [
    { id: 'mq7',   name: 'Monóxido de Carbono', val: mq7,   pct: (mq7 / UMBRALES.mq7) * 100,     umbral: UMBRALES.mq7, unit: 'ppm' },
    { id: 'mq135', name: 'Gas VOC / Amoníaco',  val: mq135, pct: (mq135 / UMBRALES.mq135) * 100, umbral: UMBRALES.mq135, unit: 'ppm' },
    { id: 'mq2',   name: 'GLP / Humo inflamable', val: mq2, pct: (mq2 / UMBRALES.mq2) * 100,     umbral: UMBRALES.mq2, unit: 'ppm' },
  ].sort((a, b) => (isNaN(b.pct) ? 0 : b.pct) - (isNaN(a.pct) ? 0 : a.pct))
}
