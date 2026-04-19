// src/lib/guia-data.ts
// ─────────────────────────────────────────────────────────────────────────────
// Paleta: un solo acento (#00DF81) + secundario (#2CC295).
// Las secciones ya no tienen color individual — UI uniforme.
// ─────────────────────────────────────────────────────────────────────────────

export interface Topic {
  q: string
  a: string
}

export interface Section {
  id: string
  icon: string      // kept for semantic value, replaced by icon component in UI
  color: string      // DEPRECATED – keep for TS compat, UI ignores it
  title: string
  subtitle: string
  badge: string
  topics: Topic[]
  formula: string
  formulaNote: string
}

export interface Pregunta {
  q: string
  tema: string
}

export interface FlujoStep {
  label: string
  color: string   // DEPRECATED – UI uses accent
  icon: string
  desc: string
}

export interface Fuente {
  icon: string
  color: string   // DEPRECATED – UI ignores
  titulo: string
  url: string
  aporte: string
  conceptos: string[]
}

// ── Sections ─────────────────────────────────────────────────────────────────
export const sections: Section[] = [
  {
    id: 'semiconductores',
    icon: '⚛',
    color: '#00DF81',
    title: '1. Física de Semiconductores',
    subtitle: 'La base de los sensores MQ',
    badge: 'FUNDAMENTAL',
    topics: [
      {
        q: '¿Qué es un semiconductor?',
        a: 'Es un sólido cristalino cuya conductividad eléctrica es intermedia entre conductores y aislantes. Se rige por la Teoría de Bandas; el dióxido de estaño ($SnO_2$) posee un bandgap de $\\approx 3.6$ eV [4]. A diferencia de los metales, su resistividad disminuye con el aumento de la temperatura debido a la generación térmica de portadores de carga.',
      },
      {
        q: '¿Por qué SnO₂ en los sensores MQ?',
        a: 'El $SnO_2$ es un Óxido Metálico Semiconductor (MOS). En aire limpio, los iones de oxígeno adsorbidos atrapan electrones de la banda de conducción, creando una barrera de potencial alta (resistencia elevada). Al interactuar con gases reductores, estos reaccionan con el oxígeno, liberando electrones y disminuyendo la resistencia del material ($R_s$) [1, 2].',
      },
      {
        q: 'Tipo N y portadores de carga',
        a: 'El $SnO_2$ es intrínsecamente tipo N, donde los electrones son los portadores mayoritarios. La quimisorción de gases altera la densidad de estos electrones en la superficie del grano semiconductor, modificando la conductividad superficial según la concentración del analito en el ambiente [2, 4].',
      },
      {
        q: 'También conocidos como Chemiresistores',
        a: 'Pertenecen a la clase de transductores quimiorresistivos: dispositivos cuya resistencia eléctrica varía proporcionalmente a la presión parcial de especies químicas adsorbidas. Esta variación se traduce en una señal de tensión mediante un circuito divisor de potencial compatible con el ADC del ESP32 [1, 11].',
      },
    ],
    formula: '$$ R_s = A \\cdot [Gas]^{-n} $$',
    formulaNote: 'Relación empírica entre resistencia y concentración de gas [11]',
  },
  {
    id: 'ohm',
    icon: '⚡',
    color: '#00DF81',
    title: '2. Ley de Ohm & Circuitos',
    subtitle: 'Señal eléctrica del transductor',
    badge: 'ELÉCTRICO',
    topics: [
      {
        q: 'Divisor de voltaje — corazón del circuito MQ',
        a: 'Para convertir el cambio de resistencia en una señal medible, se utiliza un divisor de tensión. La tensión de salida ($V_{out}$) se obtiene mediante la relación de $R_s$ y una resistencia de carga fija $R_L$. Según la Ley de Ohm, un aumento en la conductividad del sensor provoca un incremento proporcional en $V_{out}$ [3, 11].',
      },
      {
        q: 'ADC del ESP32 — de voltaje a número',
        a: 'El ESP32 emplea un convertidor analógico-digital de 12 bits para cuantificar $V_{out}$. Transforma señales de 0 a 3.3V en valores discretos (0-4095). Es crítico considerar la no-linealidad del ADC y la caída de tensión en $R_L$ para obtener lecturas de precisión científica [11].',
      },
      {
        q: 'Transferencia de electrones gas-sólido',
        a: 'Microscópicamente, el flujo de corriente obedece a $J = \\sigma \\cdot E$. La interacción química modifica la conductividad ($\\sigma$) del semiconductor al variar la densidad de portadores libres, permitiendo que la Ley de Ohm describa el comportamiento macroscópico del sensor ante el gas [3, 4].',
      },
      {
        q: 'Calentador interno y ciclos del MQ-7',
        a: 'El sensor requiere energía térmica para alcanzar la energía de activación necesaria. El MQ-7 opera en ciclos: 60s a 5V (limpieza térmica) y 90s a 1.4V (fase de detección de CO). Este control de temperatura es vital para la selectividad química del dispositivo [1].',
      },
    ],
    formula: '$$ V_{out} = V_{cc} \\cdot \\frac{R_L}{R_s + R_L} $$',
    formulaNote: 'Ecuación del divisor de tensión para transductores resistivos',
  },
  {
    id: 'termico',
    icon: '◈',
    color: '#00DF81',
    title: '3. Transferencia de Calor',
    subtitle: 'Conducción, convección y temperatura',
    badge: 'TERMODINÁMICA',
    topics: [
      {
        q: 'Conducción en el sensor',
        a: 'El calor se transfiere desde el filamento interno de Ni-Cr hacia la capa de $SnO_2$ mediante conducción sólida a través de un sustrato cerámico de $Al_2O_3$. Se rige por la Ley de Fourier, donde el flujo de calor es proporcional al gradiente térmico $\\Delta T$ [1, 5].',
      },
      {
        q: 'Convección de gases hacia el sensor',
        a: 'El transporte de las moléculas de gas desde el ambiente hasta la malla del sensor ocurre por convección (natural o forzada). La temperatura del sensor genera corrientes convectivas locales que facilitan la renovación de la muestra de aire en la superficie sensible [5, 10].',
      },
      {
        q: 'Temperatura óptima de operación',
        a: 'Cada sensor tiene una temperatura de trabajo específica (ej. MQ-135: 20-200°C en la capa sensible) para maximizar la quimisorción. Una temperatura inadecuada desplaza el equilibrio químico y altera la sensibilidad y selectividad del MOS [1, 2].',
      },
      {
        q: 'Humedad como variable de interferencia',
        a: 'El vapor de agua actúa como gas interferente. Debido a la transferencia de calor latente y la adsorción de moléculas de $H_2O$, la resistencia del sensor varía. Es imperativo compensar estas lecturas utilizando sensores adicionales (como el DHT22) y algoritmos de corrección [11].',
      },
    ],
    formula: '$$ \\dot{Q} = -k \\cdot A \\cdot \\nabla T $$',
    formulaNote: 'Ley de Fourier — conducción térmica en el sustrato cerámico',
  },
  {
    id: 'cinetica',
    icon: '◎',
    color: '#00DF81',
    title: '4. Teoría Cinética de los Gases',
    subtitle: 'Movimiento molecular y velocidad',
    badge: 'MECÁNICA',
    topics: [
      {
        q: 'Velocidad cuadrática media y respuesta',
        a: 'La velocidad de las moléculas de gas ($v_{rms}$) es proporcional a $\\sqrt{T/M}$. A mayor temperatura, el aumento de la energía cinética incrementa la frecuencia de colisiones moleculares contra la superficie del sensor, acelerando el tiempo de respuesta [6, 7].',
      },
      {
        q: 'Presión parcial en mezclas de gas',
        a: 'Según la Ley de Dalton, la presión total es la suma de las presiones parciales. El sensor responde a la fracción molar del contaminante. La teoría cinética explica que la presión es el resultado del intercambio de cantidad de movimiento durante las colisiones elásticas de las partículas contra las paredes [6, 7].',
      },
      {
        q: 'Distribución de Maxwell-Boltzmann',
        a: 'No todas las moléculas tienen la misma energía. Solo aquellas en la "cola" de la distribución con energía superior a la barrera de activación logran quimisorberse. El calentador del sensor desplaza la distribución hacia energías más altas, aumentando la tasa de reacción [7].',
      },
      {
        q: 'Libre recorrido medio \\lambda',
        a: 'Es la distancia promedio que recorre una partícula entre colisiones sucesivas. En gases ligeros como el $H_2$, $\\lambda$ es mayor, lo que facilita una difusión más rápida a través de la malla protectora del sensor en comparación con moléculas más pesadas como el LPG [6, 10].',
      },
    ],
    formula: '$$ v_{rms} = \\sqrt{\\frac{3RT}{M}} $$',
    formulaNote: 'Relación entre temperatura absoluta y velocidad molecular [6]',
  },
  {
    id: 'difusion',
    icon: '~',
    color: '#00DF81',
    title: '5. Difusión y Mecánica de Fluidos',
    subtitle: 'Transporte molecular al sensor',
    badge: 'FLUIDOS',
    topics: [
      {
        q: 'Primera Ley de Fick — flujo de masa',
        a: 'El transporte de contaminantes hacia el sensor se debe principalmente a la difusión molecular, impulsada por el gradiente de concentración ($dC/dx$). El gas se mueve espontáneamente desde la fuente de emisión hacia la superficie del sensor donde la concentración es menor debido a la adsorción [8, 9].',
      },
      {
        q: 'Segunda Ley de Fick — lag time del sensor',
        a: 'Describe cómo cambia la concentración con el tiempo. El tiempo de respuesta del sensor está limitado por la difusión a través de la capa porosa de $SnO_2$ y la malla de acero, lo que genera un retardo temporal en la señal eléctrica tras un cambio súbito en el ambiente [9, 11].',
      },
      {
        q: 'Flujo laminar vs turbulento',
        a: 'El número de Reynolds ($Re$) determina el régimen de flujo de aire alrededor de la baliza. En condiciones de viento exterior, el flujo turbulento puede aumentar la tasa de transporte por convección, pero también introducir ruido estocástico en las mediciones del ADC [8, 10].',
      },
      {
        q: 'Difusión y diseño de la carcasa',
        a: 'La geometría de los orificios de la baliza debe permitir una difusión eficiente sin exponer el sensor a flujos de aire excesivos que puedan enfriar la capa sensible, alterando el equilibrio térmico necesario para la detección precisa [8, 11].',
      },
    ],
    formula: '$$ J = -D \\cdot \\frac{\\partial C}{\\partial x} $$',
    formulaNote: 'Primera Ley de Fick — difusión molecular en fase gaseosa',
  },
  {
    id: 'transductor',
    icon: '↺',
    color: '#00DF81',
    title: '6. El Sensor como Transductor',
    subtitle: 'De adsorción a señal digital',
    badge: 'INTEGRADOR',
    topics: [
      {
        q: 'Definición de transductor quimioresistivo',
        a: 'Dispositivo que convierte una magnitud química (concentración de gas) en una magnitud eléctrica (resistencia). Este proceso implica múltiples etapas físicas: transporte de masa, quimisorción superficial y transducción de carga eléctrica [2, 11].',
      },
      {
        q: 'Fisisorción vs Quimisorción',
        a: 'La fisisorción (fuerzas de Van der Waals) es débil y no altera significativamente la resistencia. La quimisorción implica una transferencia real de electrones entre el gas y el $SnO_2$, siendo el proceso responsable de la señal útil en los sensores MQ [2, 4].',
      },
      {
        q: 'Calibración Rs/R0 y cálculo de ppm',
        a: 'La relación $R_s/R_0$ normaliza la respuesta. $R_0$ es la resistencia en aire limpio. Utilizando las curvas de sensibilidad de los datasheets, se aplica una regresión logarítmica para transformar la señal eléctrica en unidades de concentración (partes por millón) [1, 11].',
      },
      {
        q: 'Cadena completa de conversión',
        a: 'Fenómeno químico $\\to$ Difusión (Fick) $\\to$ Reacción superficial $\\to$ Cambio de conductividad (Ohm) $\\to$ Conversión Analógica-Digital $\\to$ Procesamiento Digital (ESP32) $\\to$ Transmisión de datos (IoT) [11].',
      },
    ],
    formula: '$$ \\log(ppm) = m \\cdot \\log(R_s/R_0) + b $$',
    formulaNote: 'Transformación lineal para el cálculo de concentración',
  },
];

export const flujoSistema: FlujoStep[] = [
  { label: 'GAS EN AMBIENTE', color: '#00DF81', icon: '', desc: 'CO, LPG, NH₃, humo, benceno' },
  { label: 'DIFUSIÓN (Fick)', color: '#00DF81', icon: '', desc: 'J = -D·dC/dx → lag time' },
  { label: 'ADSORCIÓN SnO₂', color: '#00DF81', icon: '', desc: 'Quimisorción → e⁻ libres' },
  { label: 'CAMBIO EN Rs (Ohm)', color: '#00DF81', icon: '', desc: 'Rs↓ → Vout↑ (divisor voltaje)' },
  { label: 'ADC ESP32 12 bits', color: '#00DF81', icon: '', desc: '0–3.3V → 0–4095' },
  { label: 'CÁLCULO ppm', color: '#00DF81', icon: '', desc: 'ppm = a·(Rs/R0)^b' },
  { label: 'WiFi HTTP / MQTT', color: '#00DF81', icon: '', desc: 'ESP32 → Servidor (cada 10–30s)' },
  { label: 'PÁGINA WEB (AQI)', color: '#00DF81', icon: '', desc: 'Dashboard · Gráficas · Alertas' },
]

export const fuentes: Fuente[] = [
  {
    icon: '',
    color: '#00DF81',
    titulo: 'Tutorial MQ2, MQ7, MQ135 — Naylamp Mechatronics',
    url: 'https://naylampmechatronics.com/blog/42_tutorial-sensores-de-gas-mq2-mq3-mq7-y-mq135.html#:~:text=En%20este%20tutorial%20vamos%20a%20trabajar%20con,(MQ7)%20y%20de%20calidad%20de%20aire%20(MQ-135)',
    aporte: 'Tutorial práctico en español sobre la conexión y programación de los sensores MQ con microcontroladores. Explica el divisor de voltaje con RL, la calibración de R0, cómo obtener lecturas en ppm y cómo conectar los sensores a Arduino/ESP32.',
    conceptos: ['Divisor de voltaje con RL', 'Calibración de R0', 'Curvas de sensibilidad', 'Código ESP32'],
  },
  {
    icon: '',
    color: '#00DF81',
    titulo: 'Air Quality Monitoring Using MQ135 & Arduino — ResearchGate 2025',
    url: 'researchgate.net/publication/393126306',
    aporte: 'Publicación académica que valida el uso del MQ-135 en sistemas de monitoreo de calidad del aire. Confirma el uso de SnO₂, la curva logarítmica Rs/R0 vs ppm, y la importancia de la temperatura y humedad como factores de interferencia.',
    conceptos: ['Rs/R0 vs ppm (log)', 'Compensación T° y HR%', 'Validación experimental', 'Sistema IoT'],
  },
  {
    icon: '',
    color: '#00DF81',
    titulo: 'Metal Oxide Semiconductor Sensors — ScienceDirect',
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S1369800125010194#:~:text=Among%20these%2C%20metal%20oxide%20semiconductor,bonded%20to%20three%20carbon%20atoms',
    aporte: 'Artículo sobre sensores MOS. Explica el mecanismo de detección a nivel molecular: la interacción de los gases con la superficie del SnO₂ involucra complejos enlazados a 3 átomos de carbono. Confirma que los sensores MQ son de tipo MOS/chemiresistor.',
    conceptos: ['Mecanismo MOS molecular', 'Quimisorción en SnO₂', 'Enlace gas-superficie', 'Zona de depleción'],
  },
  {
    icon: '',
    color: '#00DF81',
    titulo: 'ESP32-Based IoT Air Quality Monitoring — ResearchGate 2026',
    url: 'researchgate.net/publication/399856873',
    aporte: 'Estudio sobre sistemas ESP32 para monitoreo ambiental IoT. El ESP32 (dual-core 240 MHz, WiFi integrado, USD 5–15) es la plataforma estándar para redes distribuidas. Se reportó 94.2% de disponibilidad en 9 estaciones durante 36 meses.',
    conceptos: ['ESP32 dual-core 240 MHz', 'WiFi 802.11 b/g/n', 'Redes distribuidas', 'MQTT protocolo IoT'],
  },
  {
    icon: '',
    color: '#00DF81',
    titulo: 'Ley de Ohm — Portal Académico CCH UNAM',
    url: 'https://portalacademico.cch.unam.mx/cibernetica1/implementacion-de-circuitos-logicos/ley-de-ohm',
    aporte: 'Explicación teórica de la Ley de Ohm, principio eléctrico que permite convertir los cambios de resistencia del sensor MQ en un voltaje analógico escalable por el ADC del ESP32.',
    conceptos: ['Ley de Ohm', 'División de tensión', 'Corriente', 'Resistencia'],
  },
]

export const recursos: string[] = [
  'Datasheet MQ-135 v1.4 — Winsen Electronics (winsen-sensor.com)',
  'Datasheet MQ-7 — Hanwei Electronics (curvas sensibilidad CO)',
  'ESP32 Technical Reference Manual — Espressif Systems 2024',
  'Zbotic.in: Gas Sensor Guide MQ2, MQ135 (artículo práctico 2026)',
  'Arduino Project Hub: Build Air Quality Monitor with ESP32 & AQI Tracking',
  'Hackster.io: Air Quality Monitoring Made Easy — IoT with ESP32 & MQTT',
]
