// src/lib/aqi.ts
// Cálculo del Índice de Calidad del Aire (ICA) basado en umbrales Canopea
// Referencia: NOM-172-SEMARNAT-2023 (IAyS) adaptado a sensores MQ

export interface AQIResult {
  score:           number   // porcentaje relativo al umbral del peor sensor
  level:           string   // BUENA | ACEPTABLE | MALA | MUY MALA | EXTREMADAMENTE MALA
  color:           string   // color de fondo para la card
  primaryPollutant:string   // nombre del contaminante principal
  healthMsg:       string   // mensaje de salud
  tips:            string[] // recomendaciones
}

export interface PollutantRank {
  id:     string
  name:   string
  val:    number
  unit:   string
  umbral: number
  pct:    number  // (val / umbral) * 100
}

// Convierte a number seguro
function safe(v: unknown): number {
  const n = Number(v)
  return isFinite(n) ? n : 0
}

const UMBRALES = { mq2: 1000, mq7: 200, mq135: 150 }

const LEVELS: Array<{
  max:   number
  level: string
  color: string
  msg:   string
  tips:  string[]
}> = [
  {
    max:   50,
    level: 'BUENA',
    color: '#00DF81',
    msg:   'La calidad del aire es satisfactoria y la contaminación del aire representa poco o ningún riesgo.',
    tips: [
      'Condiciones ideales para actividades al aire libre.',
      'Mantén los espacios ventilados naturalmente.',
      'Ideal para ejercicio físico en exteriores.',
    ],
  },
  {
    max:   100,
    level: 'ACEPTABLE',
    color: '#F9CB42',
    msg:   'La calidad del aire es aceptable. Sin embargo, puede haber un riesgo moderado para grupos sensibles.',
    tips: [
      'Personas con enfermedades respiratorias deben limitar el esfuerzo prolongado al aire libre.',
      'Mantén buena ventilación en espacios cerrados.',
      'Monitorea los niveles si realizas actividad física intensa.',
    ],
  },
  {
    max:   150,
    level: 'MALA',
    color: '#FF8C00',
    msg:   'Miembros de grupos sensibles pueden experimentar efectos en la salud. El público en general probablemente no se vea afectado.',
    tips: [
      'Grupos sensibles (niños, adultos mayores, personas con enfermedades respiratorias) deben evitar actividad física prolongada al aire libre.',
      'Cierra ventanas si la contaminación exterior es alta.',
      'Consulta a un médico si presentas síntomas respiratorios.',
    ],
  },
  {
    max:   200,
    level: 'MUY MALA',
    color: '#E63946',
    msg:   'Toda la población puede comenzar a experimentar efectos en la salud. Los grupos sensibles pueden experimentar efectos más graves.',
    tips: [
      'Evita actividades al aire libre prolongadas.',
      'Usa mascarilla si necesitas salir.',
      'Mantén los espacios cerrados y bien filtrados.',
      'Busca atención médica si presentas dificultad para respirar.',
    ],
  },
  {
    max:   Infinity,
    level: 'EXTREMADAMENTE MALA',
    color: '#8B008B',
    msg:   'Advertencia sanitaria: toda la población puede verse afectada. Se recomienda evitar toda exposición al aire exterior.',
    tips: [
      'Permanece en interiores con ventanas cerradas.',
      'Usa purificadores de aire si los tienes disponibles.',
      'Usa mascarilla N95 si debes salir.',
      'Contacta a las autoridades sanitarias locales.',
      'Acude al médico ante cualquier síntoma respiratorio.',
    ],
  },
]

const POLLUTANT_NAMES: Record<string, string> = {
  mq2:   'GLP / Humo (MQ-2)',
  mq7:   'Monóxido de CO (MQ-7)',
  mq135: 'VOC / NH₃ (MQ-135)',
}

export function calculateAQI(
  mq2_raw:   unknown,
  mq7_raw:   unknown,
  mq135_raw: unknown,
): AQIResult {
  const v2   = safe(mq2_raw)
  const v7   = safe(mq7_raw)
  const v135 = safe(mq135_raw)

  const pct2   = (v2   / UMBRALES.mq2)   * 100
  const pct7   = (v7   / UMBRALES.mq7)   * 100
  const pct135 = (v135 / UMBRALES.mq135) * 100

  // El score es el mayor porcentaje relativo
  const worst = Math.max(pct2, pct7, pct135)
  const primaryKey =
    worst === pct2   ? 'mq2'   :
    worst === pct7   ? 'mq7'   : 'mq135'

  const lvl = LEVELS.find(l => worst <= l.max) ?? LEVELS[LEVELS.length - 1]

  return {
    score:            worst,
    level:            lvl.level,
    color:            lvl.color,
    primaryPollutant: POLLUTANT_NAMES[primaryKey],
    healthMsg:        lvl.msg,
    tips:             lvl.tips,
  }
}

export function getPollutantsRank(
  mq2_raw:   unknown,
  mq7_raw:   unknown,
  mq135_raw: unknown,
): PollutantRank[] {
  const v2   = safe(mq2_raw)
  const v7   = safe(mq7_raw)
  const v135 = safe(mq135_raw)

  return [
    { id: 'mq2',   name: 'GLP / Humo',    val: v2,   unit: 'ppm', umbral: UMBRALES.mq2,   pct: (v2   / UMBRALES.mq2)   * 100 },
    { id: 'mq7',   name: 'Monóxido (CO)', val: v7,   unit: 'ppm', umbral: UMBRALES.mq7,   pct: (v7   / UMBRALES.mq7)   * 100 },
    { id: 'mq135', name: 'VOC / NH₃',     val: v135, unit: 'ppm', umbral: UMBRALES.mq135, pct: (v135 / UMBRALES.mq135) * 100 },
  ].sort((a, b) => b.pct - a.pct)
}
