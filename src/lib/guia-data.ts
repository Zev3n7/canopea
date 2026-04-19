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
  id:          string
  icon:        string      // kept for semantic value, replaced by icon component in UI
  color:       string      // DEPRECATED – keep for TS compat, UI ignores it
  title:       string
  subtitle:    string
  badge:       string
  topics:      Topic[]
  formula:     string
  formulaNote: string
}

export interface Pregunta {
  q:    string
  tema: string
}

export interface FlujoStep {
  label: string
  color: string   // DEPRECATED – UI uses accent
  icon:  string
  desc:  string
}

export interface Fuente {
  icon:      string
  color:     string   // DEPRECATED – UI ignores
  titulo:    string
  url:       string
  aporte:    string
  conceptos: string[]
}

// ── Sections ─────────────────────────────────────────────────────────────────
export const sections: Section[] = [
  {
    id:       'semiconductores',
    icon:     '⚛',
    color:    '#00DF81',
    title:    '1. Física de Semiconductores',
    subtitle: 'La base de los sensores MQ',
    badge:    'FUNDAMENTAL',
    topics: [
      {
        q: '¿Qué es un semiconductor?',
        a: 'Material cuya conductividad eléctrica está entre un conductor y un aislante. Su resistencia disminuye al aumentar la temperatura (comportamiento opuesto a los metales). El bandgap del SnO₂ ≈ 3.6 eV permite la activación térmica de electrones y la adsorción de gases en su superficie.',
      },
      {
        q: '¿Por qué SnO₂ en los sensores MQ?',
        a: 'Los sensores MQ usan un tubo de cerámica Al₂O₃ recubierto con SnO₂. En aire limpio, el SnO₂ conduce poco (alta resistencia). Cuando las moléculas de gas objetivo contactan la superficie calentada, son adsorbidas y cambian las propiedades eléctricas, reduciendo Rs. Es un sensor tipo MOS (Metal Oxide Semiconductor).',
      },
      {
        q: 'Tipo N y portadores de carga',
        a: 'SnO₂ es semiconductor tipo N: los portadores mayoritarios son electrones. El O₂ adsorbido en la superficie crea una zona de agotamiento (depletion layer) que limita la corriente. Los gases reductores (CO, H₂, LPG) donan electrones al SnO₂, reducen la zona de agotamiento y bajan drásticamente Rs.',
      },
      {
        q: 'También conocidos como Chemiresistores',
        a: 'Los sensores MQ de la serie Hanwei son chemiresistores: la detección depende del cambio en la resistencia del material sensible cuando el gas entra en contacto con él. Esta resistencia variable se convierte en voltaje usando el divisor de tensión del circuito, lo que permite medirla con el ADC del ESP32.',
      },
    ],
    formula:     'R_sensor ∝ [Gas]⁻ⁿ   (n ≈ 0.5)',
    formulaNote: 'Relación potencial entre resistencia y concentración de gas',
  },
  {
    id:       'ohm',
    icon:     '⚡',
    color:    '#00DF81',
    title:    '2. Ley de Ohm & Circuitos',
    subtitle: 'Señal eléctrica del transductor',
    badge:    'ELÉCTRICO',
    topics: [
      {
        q: 'Divisor de voltaje — corazón del circuito MQ',
        a: 'La concentración de gas se puede sensar con una red divisora de voltaje simple (Rs en serie con RL ≈ 20kΩ para MQ-135). Vout = Vcc × RL / (Rs + RL). Al disminuir Rs por presencia de gas reductor, Vout aumenta proporcionalmente.',
      },
      {
        q: 'ADC del ESP32 — de voltaje a número',
        a: 'El ESP32 tiene un ADC integrado de 12 bits. Convierte Vout (0–3.3V) en un entero 0–4095. Resolución ≈ 0.8 mV por unidad. Pines ADC: GPIO 32–39. El ADC nativo del ESP32 tiene cierta no-linealidad en sus extremos; se recomienda calibrar o usar la función esp_adc_cal.',
      },
      {
        q: 'Transferencia de electrones gas-sólido',
        a: 'Los gases reductores reaccionan con el O₂ adsorbido en el SnO₂, liberando electrones hacia la banda de conducción. Esto aumenta la densidad de portadores → menor resistencia → mayor corriente → mayor Vout. Es una transferencia cuántica de carga que obedece la Ley de Ohm a nivel macroscópico.',
      },
      {
        q: 'Calentador interno y ciclos del MQ-7',
        a: 'Cada MQ tiene un calefactor interno (Rh ≈ 33Ω). El MQ-7 usa ciclos especiales: 60s a 5V (alta T°, limpia la superficie de CO) y luego 90s a 1.4V (baja T°, óptima para adsorber CO nuevo). El ESP32 puede controlar este ciclo con un transistor o módulo de relay.',
      },
    ],
    formula:     'Vout = Vcc × RL / (Rs + RL)',
    formulaNote: 'Salida del divisor → entrada al ADC del ESP32',
  },
  {
    id:       'termico',
    icon:     '◈',
    color:    '#00DF81',
    title:    '3. Transferencia de Calor',
    subtitle: 'Conducción, convección y temperatura',
    badge:    'TERMODINÁMICA',
    topics: [
      {
        q: 'Conducción en el sensor',
        a: 'El calor del filamento calefactor se transfiere por conducción a la capa de SnO₂. Ley de Fourier: Q/t = k·A·ΔT/d. El cilindro de acero inoxidable actúa como conductor y protector. La cerámica Al₂O₃ mejora la eficiencia de calentamiento y garantiza temperatura estable en la zona sensible.',
      },
      {
        q: 'Convección de gases hacia el sensor',
        a: 'La malla metálica del sensor permite el flujo convectivo de aire hacia el elemento sensible. En la baliza exterior, las corrientes de viento crean flujo convectivo forzado que transporta moléculas de gas hasta la superficie de SnO₂. Mayor convección → más rápido llegan los gases → respuesta más veloz.',
      },
      {
        q: 'Temperatura óptima de operación',
        a: 'MQ-7: 150–350°C, MQ-2: 200–300°C, MQ-135: 20–200°C (temperatura de la capa sensible, no ambiente). A T° óptima, la tasa de adsorción es máxima y la selectividad mejora. El calefactor interno lleva el SnO₂ a esta T°. La temperatura ambiente afecta secundariamente la Rs.',
      },
      {
        q: 'Humedad como variable de interferencia',
        a: 'Las curvas de calibración del datasheet MQ-135 se miden a T=20°C y HR=65%. A mayor humedad relativa, el vapor de agua compite por sitios de adsorción en el SnO₂, alterando Rs. El ESP32 puede recibir datos de un sensor DHT22 para compensar las lecturas de los MQ.',
      },
    ],
    formula:     'Q/t = k·A·ΔT/L',
    formulaNote: 'Ley de Fourier — conducción de calor en el sensor',
  },
  {
    id:       'cinetica',
    icon:     '◎',
    color:    '#00DF81',
    title:    '4. Teoría Cinética de los Gases',
    subtitle: 'Movimiento molecular y velocidad',
    badge:    'MECÁNICA',
    topics: [
      {
        q: 'Velocidad cuadrática media y respuesta del sensor',
        a: 'vrms = √(3RT/M). A mayor temperatura ambiental, las moléculas viajan más rápido y colisionan con mayor frecuencia con el SnO₂. Esto aumenta la tasa de adsorción y hace que el sensor responda más rápido. Cada gas (CO, NH₃, LPG) tiene masa molar M diferente → velocidades distintas.',
      },
      {
        q: 'Presión parcial en mezclas de gas',
        a: 'En el aire (mezcla de N₂, O₂ y contaminantes), cada gas ejerce su presión parcial Pi = niKT. El MQ-135 responde a la presión parcial de cada contaminante. Si coexisten NH₃ y CO₂, ambos afectan Rs simultáneamente → la respuesta del sensor es la suma de los efectos → baja selectividad.',
      },
      {
        q: 'Distribución de Maxwell-Boltzmann',
        a: 'Las velocidades moleculares siguen esta distribución estadística: no todas tienen la misma energía. Solo las moléculas con energía suficiente superan la barrera de activación para quimisorberse en el SnO₂. El calefactor interno eleva T° y con ello el número de moléculas con energía suficiente.',
      },
      {
        q: 'Libre recorrido medio λ',
        a: 'λ = kT/(√2·π·d²·P). A presión atmosférica normal (1 atm, 20°C), λ ≈ 68 nm para N₂. El libre recorrido medio determina la frecuencia de colisiones entre moléculas de gas. Moléculas más ligeras (H₂) tienen mayor λ → llegan antes al sensor → MQ-2 responde más rápido al H₂ que al LPG.',
      },
    ],
    formula:     'v_rms = √(3RT/M)',
    formulaNote: 'Mayor T → mayor vrms → mayor tasa de adsorción',
  },
  {
    id:       'difusion',
    icon:     '~',
    color:    '#00DF81',
    title:    '5. Difusión y Mecánica de Fluidos',
    subtitle: 'Transporte molecular al sensor',
    badge:    'FLUIDOS',
    topics: [
      {
        q: 'Primera Ley de Fick — flujo de masa',
        a: 'J = -D·(dC/dx). El flujo de moléculas de gas es proporcional al gradiente de concentración. Los gases fluyen de alta concentración (fuente de contaminación) a baja concentración (alrededor del sensor). D para CO en aire ≈ 0.208 cm²/s; para NH₃ ≈ 0.198 cm²/s a 25°C.',
      },
      {
        q: 'Segunda Ley de Fick — lag time del sensor',
        a: '∂C/∂t = D·(∂²C/∂x²). Explica el retardo (lag time) observable entre la exposición al gas y la respuesta del sensor. La concentración dentro del housing del sensor tarda en equilibrarse con el exterior. Este retraso es importante al calibrar la frecuencia de muestreo del ESP32.',
      },
      {
        q: 'Flujo laminar vs turbulento en la baliza exterior',
        a: 'Re = ρvL/μ determina el régimen de flujo. En condiciones de viento (baliza exterior), predomina flujo turbulento que aumenta el transporte convectivo de gas al sensor. Esto acelera la respuesta pero puede crear lecturas ruidosas. El diseño de los orificios de ventilación de la carcasa es clave.',
      },
      {
        q: 'Difusión y diseño de la carcasa de la baliza',
        a: 'La ubicación y tamaño de los orificios de ventilación afecta el tiempo de respuesta: orificios grandes → más difusión → respuesta rápida pero más exposición al ambiente. Orificios pequeños → protección contra lluvia/polvo pero respuesta lenta. Es un compromiso ingenieril basado en física de fluidos.',
      },
    ],
    formula:     'J = -D · (dC/dx)',
    formulaNote: 'Primera Ley de Fick — transporte molecular al sensor',
  },
  {
    id:       'transductor',
    icon:     '↺',
    color:    '#00DF81',
    title:    '6. El Sensor como Transductor',
    subtitle: 'De adsorción a señal digital',
    badge:    'INTEGRADOR',
    topics: [
      {
        q: 'Definición de transductor quimioresistivo',
        a: 'Un transductor convierte una forma de energía o fenómeno en otro. Los MQ son quimioresistivos: la adsorción de moléculas (fenómeno químico-físico) produce un cambio en Rs del SnO₂ (señal eléctrica), que se convierte en voltaje (Ohm) y luego en un número digital en el ESP32 (señal discreta).',
      },
      {
        q: 'Fisisorción vs Quimisorción',
        a: 'Fisisorción: adherencia por fuerzas de Van der Waals, débil y reversible, no cambia significativamente Rs. Quimisorción: formación de enlace químico con transferencia de electrones, fuerte y reversible al calentar, es la que genera el cambio medible en Rs. El calefactor favorece la quimisorción.',
      },
      {
        q: 'Calibración Rs/R0 y cálculo de ppm',
        a: 'R0 es la resistencia medida en aire limpio (calibración inicial). Rs es la resistencia con gas. El ESP32 calcula Rs/R0 a partir del voltaje ADC: Rs = RL × (Vcc - Vout)/Vout. Luego aplica regresión: ppm = a·(Rs/R0)^b, donde a y b son constantes del datasheet específicas por gas.',
      },
      {
        q: 'Cadena completa de conversión',
        a: 'Gas en ambiente → Difusión (Fick) → Colisión con SnO₂ → Quimisorción → Cambio en Rs → Cambio en Vout (Ohm) → ADC ESP32 12 bits → Cálculo Rs/R0 → ppm → WiFi HTTP/MQTT → Servidor → Página web con gráficas en tiempo real.',
      },
    ],
    formula:     'ppm = a · (Rs/R0)^b',
    formulaNote: 'Regresión logarítmica del datasheet MQ',
  },
  {
    id:       'esp32',
    icon:     '□',
    color:    '#00DF81',
    title:    '7. ESP32 — Microcontrolador IoT',
    subtitle: 'Cerebro del sistema de la baliza',
    badge:    'IOT',
    topics: [
      {
        q: 'Características físicas del ESP32',
        a: 'Procesador dual-core Xtensa LX6 a 240 MHz. WiFi 802.11 b/g/n integrado a 2.4 GHz (no soporta 5 GHz) y Bluetooth 4.2/BLE. ADC de 12 bits (0–4095). Opera a 3.3V lógica. Consumo: ~160 mA en transmisión WiFi, ~30 mA en recepción. Costo: USD 5–15 por unidad.',
      },
      {
        q: 'Lectura de los sensores MQ con ADC',
        a: 'Los sensores MQ funcionan a 5V pero los pines ADC del ESP32 soportan máximo 3.3V. Solución: alimentar Rs y RL con 3.3V del ESP32, o usar un divisor resistivo para reducir Vout. Pines ADC: GPIO 32–39. La librería MQUnifiedsensor simplifica el cálculo de Rs, R0 y ppm.',
      },
      {
        q: 'WiFi y protocolos de envío de datos',
        a: 'Con las librerías WiFi.h y HTTPClient.h, el ESP32 se conecta a la red local y envía datos al servidor mediante HTTP GET/POST. Alternativa: protocolo MQTT (librería PubSubClient.h): el ESP32 publica en topics como "baliza/mq7/co" y el servidor se suscribe. MQTT es más eficiente energéticamente.',
      },
      {
        q: 'Ciclo de medición y frecuencia de muestreo',
        a: 'El ESP32 lee los 3 sensores en cada iteración del loop(): lee ADC → calcula Rs/R0 → calcula ppm → formatea JSON → envía por WiFi. Período recomendado: cada 10–30 segundos para no saturar el servidor. El MQ-7 necesita lógica de ciclo de calentamiento (60s a 5V + 90s a 1.4V) implementada en el firmware.',
      },
    ],
    formula:     'ADC_valor = (Vout / 3.3V) × 4095',
    formulaNote: 'Conversión analógico-digital de 12 bits del ESP32',
  },
  {
    id:       'servidor',
    icon:     '◉',
    color:    '#00DF81',
    title:    '8. Servidor Web y Visualización',
    subtitle: 'De datos a información en tiempo real',
    badge:    'SOFTWARE',
    topics: [
      {
        q: 'Arquitectura cliente-servidor del sistema',
        a: 'El ESP32 actúa como cliente IoT que envía datos. El servidor recibe y almacena las lecturas. El navegador web es el cliente de visualización: consulta el servidor para mostrar gráficas de ppm en tiempo real sin necesidad de recargar la página.',
      },
      {
        q: 'Opciones de virtualización del servidor',
        a: 'Local: XAMPP o Node.js en PC de la red. Nube: ThingSpeak (gratuito, hasta 3M mensajes/año), Heroku, Railway. El propio ESP32 puede ser servidor web: levanta un WebServer en su IP local, sirve HTML/JavaScript desde flash y actualiza datos cada segundo con Ajax.',
      },
      {
        q: 'Actualización en tiempo real — WebSocket y Ajax',
        a: 'Para mostrar datos sin recargar la página se usan WebSockets (conexión persistente bidireccional) o Ajax polling (el navegador solicita datos cada N segundos). El servidor empuja (push) nuevos datos cada vez que el ESP32 los envía. La interfaz actualiza gráficas de ppm y estado AQI automáticamente.',
      },
      {
        q: 'Índice de Calidad del Aire (AQI)',
        a: 'La web calcula y muestra AQI combinando los 3 sensores: Excelente (0–50), Bueno (51–100), Moderado (101–150), Malo (151–200), Muy malo (201–300), Peligroso (>300). Cada nivel tiene un color distintivo. El servidor puede enviar alertas por email o notificación push cuando se supera un umbral.',
      },
    ],
    formula:     'AQI = f(ppm_CO, ppm_LPG, ppm_NH₃)',
    formulaNote: 'Índice compuesto calculado en el servidor web',
  },
  {
    id:       'sensores',
    icon:     '◈',
    color:    '#00DF81',
    title:    '9. Los Sensores MQ: Comparativa',
    subtitle: 'MQ-2, MQ-7 y MQ-135 en detalle',
    badge:    'APLICADO',
    topics: [
      {
        q: 'MQ-2 — Gas inflamable y Humo',
        a: 'Tipo: MOS / chemiresistor. Detecta: LPG, propano, hidrógeno, metano, humo. Rango: 300–10,000 ppm. Temperatura operación: 200–300°C. Contiene cerámica Al₂O₃ + capa SnO₂ + electrodo + calefactor + malla protectora de acero. Aplicación en baliza: detección de fugas de gas e incendios.',
      },
      {
        q: 'MQ-7 — Monóxido de Carbono (CO)',
        a: 'Detecta: CO principalmente. Rango: 20–2,000 ppm. Ciclo especial: 60s a 5V (alta T°, quema residuos en superficie) + 90s a 1.4V (baja T°, adsorbe CO nuevo). El CO es tóxico porque bloquea la hemoglobina. El ESP32 controla este ciclo con PWM o transistor.',
      },
      {
        q: 'MQ-135 — Calidad del Aire (AQI)',
        a: 'Material sensible: SnO₂. Alta sensibilidad a NH₃, sulfuro, vapores de benceno, humo y CO₂. Rango: 10–1,000 ppm. Calibrar: R0 medido a 100 ppm NH₃ o 50 ppm alcohol, RL ≈ 20kΩ. Temperatura operación: 20–200°C. Es el sensor más versátil de la baliza: genera el índice general AQI.',
      },
      {
        q: 'Tiempo de precalentamiento y calibración',
        a: 'Primera calibración: 24–48 horas de warm-up para que el SnO₂ se estabilice. En cada encendido: mínimo 20 minutos. El ESP32 puede esperar antes de enviar datos al servidor. La calibración consiste en medir R0 en aire limpio certificado y almacenarla en la memoria flash (EEPROM / NVS del ESP32).',
      },
    ],
    formula:     'Rs/R0 = f(ppm, T°C, HR%)',
    formulaNote: 'Función de calibración — curvas de sensibilidad del datasheet',
  },
]

export const preguntas: Pregunta[] = [
  { q: '¿Qué es un semiconductor y cómo difiere de un conductor?', tema: 'Semiconductores' },
  { q: '¿Por qué se usa SnO₂ como material sensible en los sensores MQ?', tema: 'Semiconductores' },
  { q: 'Explica la Ley de Ohm en el contexto del circuito divisor de voltaje del sensor MQ', tema: 'Ley de Ohm' },
  { q: '¿Cómo convierte el ESP32 la señal analógica del sensor en un número digital?', tema: 'ESP32 IoT' },
  { q: '¿Qué protocolos usa el ESP32 para enviar datos al servidor? ¿HTTP o MQTT? ¿Cuál es más eficiente?', tema: 'ESP32 IoT' },
  { q: '¿Cómo afecta la temperatura la velocidad de las partículas de gas y la respuesta del sensor?', tema: 'Teoría Cinética' },
  { q: '¿Qué es la difusión (Leyes de Fick) y por qué hay un lag time en la respuesta del sensor?', tema: 'Difusión' },
  { q: '¿Cuál es la diferencia entre conducción y convección en el contexto del sensor MQ?', tema: 'Calor' },
  { q: 'Describe el proceso completo de transducción desde el gas hasta la página web', tema: 'Sistema completo' },
  { q: '¿Por qué los sensores necesitan tiempo de precalentamiento?', tema: 'Sensores MQ' },
  { q: '¿Cómo se calcula la concentración en ppm a partir del voltaje leído por el ADC?', tema: 'Calibración' },
  { q: '¿Por qué los sensores MQ tienen baja selectividad? ¿Cómo se compensa usando 3 sensores?', tema: 'Sensores MQ' },
]

export const flujoSistema: FlujoStep[] = [
  { label: 'GAS EN AMBIENTE',    color: '#00DF81', icon: '', desc: 'CO, LPG, NH₃, humo, benceno' },
  { label: 'DIFUSIÓN (Fick)',    color: '#00DF81', icon: '', desc: 'J = -D·dC/dx → lag time' },
  { label: 'ADSORCIÓN SnO₂',    color: '#00DF81', icon: '', desc: 'Quimisorción → e⁻ libres' },
  { label: 'CAMBIO EN Rs (Ohm)', color: '#00DF81', icon: '', desc: 'Rs↓ → Vout↑ (divisor voltaje)' },
  { label: 'ADC ESP32 12 bits',  color: '#00DF81', icon: '', desc: '0–3.3V → 0–4095' },
  { label: 'CÁLCULO ppm',        color: '#00DF81', icon: '', desc: 'ppm = a·(Rs/R0)^b' },
  { label: 'WiFi HTTP / MQTT',   color: '#00DF81', icon: '', desc: 'ESP32 → Servidor (cada 10–30s)' },
  { label: 'PÁGINA WEB (AQI)',   color: '#00DF81', icon: '', desc: 'Dashboard · Gráficas · Alertas' },
]

export const fuentes: Fuente[] = [
  {
    icon:    '',
    color:   '#00DF81',
    titulo:  'Tutorial MQ2, MQ7, MQ135 — Naylamp Mechatronics',
    url:     'naylampmechatronics.com/blog/42_tutorial-sensores-de-gas',
    aporte:  'Tutorial práctico en español sobre la conexión y programación de los sensores MQ con microcontroladores. Explica el divisor de voltaje con RL, la calibración de R0, cómo obtener lecturas en ppm y cómo conectar los sensores a Arduino/ESP32.',
    conceptos: ['Divisor de voltaje con RL', 'Calibración de R0', 'Curvas de sensibilidad', 'Código ESP32'],
  },
  {
    icon:    '',
    color:   '#00DF81',
    titulo:  'Air Quality Monitoring Using MQ135 & Arduino — ResearchGate 2025',
    url:     'researchgate.net/publication/393126306',
    aporte:  'Publicación académica que valida el uso del MQ-135 en sistemas de monitoreo de calidad del aire. Confirma el uso de SnO₂, la curva logarítmica Rs/R0 vs ppm, y la importancia de la temperatura y humedad como factores de interferencia.',
    conceptos: ['Rs/R0 vs ppm (log)', 'Compensación T° y HR%', 'Validación experimental', 'Sistema IoT'],
  },
  {
    icon:    '',
    color:   '#00DF81',
    titulo:  'Metal Oxide Semiconductor Sensors — ScienceDirect 2025',
    url:     'sciencedirect.com/article/pii/S1369800125010194',
    aporte:  'Artículo sobre sensores MOS. Explica el mecanismo de detección a nivel molecular: la interacción de los gases con la superficie del SnO₂ involucra complejos enlazados a 3 átomos de carbono. Confirma que los sensores MQ son de tipo MOS/chemiresistor.',
    conceptos: ['Mecanismo MOS molecular', 'Quimisorción en SnO₂', 'Enlace gas-superficie', 'Zona de depleción'],
  },
  {
    icon:    '',
    color:   '#00DF81',
    titulo:  'ESP32-Based IoT Air Quality Monitoring — ResearchGate 2026',
    url:     'researchgate.net/publication/399856873',
    aporte:  'Estudio sobre sistemas ESP32 para monitoreo ambiental IoT. El ESP32 (dual-core 240 MHz, WiFi integrado, USD 5–15) es la plataforma estándar para redes distribuidas. Se reportó 94.2% de disponibilidad en 9 estaciones durante 36 meses.',
    conceptos: ['ESP32 dual-core 240 MHz', 'WiFi 802.11 b/g/n', 'Redes distribuidas', 'MQTT protocolo IoT'],
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
