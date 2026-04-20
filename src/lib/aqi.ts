// src/lib/aqi.ts
import { UMBRALES } from './constants'

export type AQILevel = 'BUENA' | 'ACEPTABLE' | 'MALA' | 'MUY MALA' | 'EXTREMADAMENTE MALA'

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
  { max: 50, level: 'BUENA' as AQILevel, color: '#00DF81', bgLight: 'rgba(0,223,129,0.08)', healthMsg: 'Riesgo Bajo. La calidad del aire es idónea.', tips: ['Ideal para actividades físicas al aire libre.', 'Puede realizarse cualquier actividad al aire libre.'] },
  { max: 100, level: 'ACEPTABLE' as AQILevel,     color: '#F9CB42', bgLight: 'rgba(249,203,66,0.08)', healthMsg: 'Riesgo Moderado. Calidad de aire aceptable.', tips: ['Grupos sensibles deben considerar reducir las actividades físicas vigorosas.', 'El resto de la población puede disfrutar de actividades al aire libre.'] },
  { max: 150, level: 'MALA' as AQILevel,  color: '#FF8C00', bgLight: 'rgba(255,140,0,0.08)',  healthMsg: 'Riesgo Alto. Posibles efectos en la salud para grupos sensibles.', tips: ['Grupos sensibles (asmáticos, niños, ancianos) deben evitar las actividades físicas al aire libre.', 'La población general debe reducir las actividades físicas vigorosas al aire libre.'] },
  { max: 200, level: 'MUY MALA' as AQILevel,     color: '#E63946', bgLight: 'rgba(230,57,70,0.08)',  healthMsg: 'Riesgo Muy Alto. Incremento de afecciones respiratorias.', tips: ['Toda la población debe evitar realizar actividades físicas al aire libre.', 'Grupos sensibles DEBEN usar mascarilla o permanecer en interiores.'] },
  { max: Infinity, level: 'EXTREMADAMENTE MALA' as AQILevel, color: '#8B008B', bgLight: 'rgba(139,0,139,0.08)', healthMsg: 'Riesgo Extremadamente Alto. Emergencia de salud pública.', tips: ['PERMANECE EN INTERIORES con ventanas cerradas.', 'Usa purificadores de aire en el interior.', 'Uso obligatorio de mascarilla respiratoria si debes salir.'] },
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
