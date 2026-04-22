// src/lib/aqi.ts
// ICA basado en NOM-172-SEMARNAT-2023 + NOM-021-SSA1-2021
// Umbrales alineados a exterior urbano y rangos reales de sensores MQ

export interface AQIResult {
  score: number
  level: string
  color: string
  primaryPollutant: string
  healthMsg: string
  tips: string[]
}

export interface PollutantRank {
  id: string
  name: string
  val: number
  unit: string
  umbral: number
  pct: number
}

function safe(v: unknown): number {
  const n = Number(v)
  return isFinite(n) ? n : 0
}

// ─── Umbrales corregidos ───────────────────────────────────────────────────────
// MQ7  → NOM-021-SSA1-2021: 7 ppm (1h) / 5 ppm (8h). Usamos 7 ppm como umbral
//         de referencia para el score relativo (100% = límite NOM 1h)
// MQ2  → Exterior urbano: GLP/metano no tiene NOM de inmisión.
//         Referencia NFPA: alerta en 500 ppm (10% LEL GLP). Umbral = 500 ppm
// MQ135→ OMS COVs totales: ~0.3 mg/m³ ≈ 0.1 ppm equiv. para aire exterior.
//         El MQ135 en ppm equivalente a COVs: umbral práctico exterior = 80 ppm
//         (valor que en condiciones normales no debe superarse en espacio abierto)
export const UMBRALES = {
  mq2: 500,   // ppm — 10% LEL GLP, referencia NFPA 58
  mq7: 7,     // ppm — NOM-021-SSA1-2021 límite 1 hora
  mq135: 80,    // ppm — umbral práctico COVs exterior MQ135
} as const

// ─── Escala ICA — NOM-172-SEMARNAT-2023 ───────────────────────────────────────
// La escala original del código usaba percentiles del umbral propio de cada sensor.
// Se mantiene esa lógica pero con umbrales corregidos.
// Bandas: Buena 0-50%, Aceptable 51-100%, Mala 101-150%, Muy mala 151-200%, Peligrosa >200%
const LEVELS: Array<{
  max: number
  level: string
  color: string
  msg: string
  tips: string[]
}> = [
    {
      max: 50,
      level: 'BUENA',
      color: '#00DF81',
      msg: 'La calidad del aire es satisfactoria. Contaminación representa poco o ningún riesgo.',
      tips: [
        'Condiciones ideales para actividades al aire libre.',
        'Mantén los espacios ventilados naturalmente.',
        'Ideal para ejercicio físico en exteriores.',
      ],
    },
    {
      max: 100,
      level: 'ACEPTABLE',
      color: '#F9CB42',
      msg: 'Calidad aceptable. Riesgo moderado para grupos sensibles.',
      tips: [
        'Personas con enfermedades respiratorias deben limitar esfuerzo prolongado al aire libre.',
        'Mantén buena ventilación en espacios cerrados.',
        'Monitorea los niveles si realizas actividad física intensa.',
      ],
    },
    {
      max: 150,
      level: 'MALA',
      color: '#FF8C00',
      // CO > 7 ppm ya supera NOM-021 → mensaje específico
      msg: 'Niveles superiores a la norma NOM-021. Grupos sensibles pueden experimentar efectos en salud.',
      tips: [
        'Niños, adultos mayores y personas con enfermedades respiratorias: evitar actividad al aire libre.',
        'Si el contaminante principal es CO, verifica fuentes de combustión cercanas.',
        'Usa cubrebocas N95 si debes permanecer en el exterior.',
        'Cierra ventanas si la fuente es exterior.',
      ],
    },
    {
      max: 200,
      level: 'MUY MALA',
      color: '#E63946',
      msg: 'Concentraciones peligrosas. Toda la población puede verse afectada.',
      tips: [
        'Permanece en interiores con puertas y ventanas cerradas.',
        'Evita cualquier actividad al aire libre.',
        'Usa mascarilla N95 si debes salir obligatoriamente.',
        'Busca atención médica ante dificultad para respirar o mareo.',
      ],
    },
    {
      max: Infinity,
      level: 'EXTREMADAMENTE MALA',
      color: '#8B008B',
      msg: 'Emergencia sanitaria. Evacuación recomendada. Contacta a autoridades.',
      tips: [
        'Permanece en interiores con ventanas cerradas.',
        'Si CO > 50 ppm: evacúa y llama a bomberos / servicios de emergencia.',
        'Usa purificadores de aire si están disponibles.',
        'Usa mascarilla N95 obligatoriamente si debes salir.',
        'Acude al médico ante cualquier síntoma respiratorio.',
      ],
    },
  ]

const POLLUTANT_NAMES: Record<string, string> = {
  mq2: 'GLP / Humo (MQ-2)',
  mq7: 'Monóxido de CO (MQ-7)',
  mq135: 'VOC / NH₃ (MQ-135)',
}

export function calculateAQI(
  mq2_raw: unknown,
  mq7_raw: unknown,
  mq135_raw: unknown,
): AQIResult {
  const v2 = safe(mq2_raw)
  const v7 = safe(mq7_raw)
  const v135 = safe(mq135_raw)

  const pct2 = (v2 / UMBRALES.mq2) * 100
  const pct7 = (v7 / UMBRALES.mq7) * 100
  const pct135 = (v135 / UMBRALES.mq135) * 100

  const worst = Math.max(pct2, pct7, pct135)
  const primaryKey =
    worst === pct7 ? 'mq7' :  // CO tiene prioridad en empate (más tóxico)
      worst === pct2 ? 'mq2' : 'mq135'

  const lvl = LEVELS.find(l => worst <= l.max) ?? LEVELS[LEVELS.length - 1]

  return {
    score: worst,
    level: lvl.level,
    color: lvl.color,
    primaryPollutant: POLLUTANT_NAMES[primaryKey],
    healthMsg: lvl.msg,
    tips: lvl.tips,
  }
}

export function getPollutantsRank(
  mq2_raw: unknown,
  mq7_raw: unknown,
  mq135_raw: unknown,
): PollutantRank[] {
  const v2 = safe(mq2_raw)
  const v7 = safe(mq7_raw)
  const v135 = safe(mq135_raw)

  return [
    { id: 'mq2', name: 'GLP / Humo', val: v2, unit: 'ppm', umbral: UMBRALES.mq2, pct: (v2 / UMBRALES.mq2) * 100 },
    { id: 'mq7', name: 'Monóxido (CO)', val: v7, unit: 'ppm', umbral: UMBRALES.mq7, pct: (v7 / UMBRALES.mq7) * 100 },
    { id: 'mq135', name: 'VOC / NH₃', val: v135, unit: 'ppm', umbral: UMBRALES.mq135, pct: (v135 / UMBRALES.mq135) * 100 },
  ].sort((a, b) => b.pct - a.pct)
}

// ─── Utilidad para el ESP32 / reglas de Firestore ─────────────────────────────
// Mapeo nivel → string que coincide con el campo `nivel` que guarda el ESP32
export function levelFromScore(score: number): string {
  return LEVELS.find(l => score <= l.max)?.level ?? 'EXTREMADAMENTE MALA'
}