// src/lib/constants.ts
import type { Baliza, ComponenteProyecto, Author, Umbrales } from '@/types'

export const UMBRALES: Umbrales = { mq2: 1000, mq7: 200, mq135: 150 }

export const AUTORES: Author[] = [
  {
    nombre: 'Logan Leonel Benitez Rojas',
    rol: 'Estudiante | Programador principal, diseñador web y analista de datos.',
    escuela: 'Preparatoria 2 de Octubre de 1968',
    bio: 'Interes por la fisica, ecologia y ciencia orientada a la resolución de problemas a traves del codigo.',
    github: 'https://github.com/Zev3n7',
  },
  {
    nombre: 'David Lezama Gonzales',
    rol: 'Estudiante | Programador y encargado de electronica.',
    escuela: 'Preparatoria 2 de Octubre de 1968',
    bio: 'Apasionado de la electronica y el diseño de circuitos orientados a la mecatrónica.',
  },
  {
    nombre: 'Aldo Gustavo Aponte Peña',
    rol: 'Maestro | Encargado de la guía del proyecto y asesoramiento.',
    escuela: 'Preparatoria 2 de Octubre de 1968',
    bio: 'Ingeniero Quimico en materiales muy pro.',
  },
]

export const COMPONENTES: ComponenteProyecto[] = [
  {
    id: 'esp32',
    titulo: 'Microcontrolador ESP32',
    categoria: 'hardware',
    descripcion: 'Cerebro del sistema de monitoreo.',
    detalles: [
      'Doble núcleo Xtensa LX6 a 240 MHz',
      '520 KB de SRAM integrada',
      'WiFi 802.11 b/g/n y Bluetooth integrados',
      'ADC de 12 bits para lectura de sensores',
      'Transmisión vía HTTP hacia Firebase',
    ],
  },
  {
    id: 'mq2',
    titulo: 'Sensor MQ-2',
    categoria: 'sensor',
    descripcion: 'Detección de GLP, metano, hidrógeno y humo.',
    detalles: [
      'Rango de detección: 300–10,000 ppm',
      'Sensible a GLP, metano, hidrógeno y humo',
      'Principio: semiconductor de óxido metálico (MOS)',
      'Señal de salida analógica (resistencia variable)',
      'Tiempo de calentamiento: ~60 segundos',
    ],
  },
  {
    id: 'mq7',
    titulo: 'Sensor MQ-7',
    categoria: 'sensor',
    descripcion: 'Detección de monóxido de carbono (CO).',
    detalles: [
      'Rango de detección: 20–2,000 ppm',
      'Alta sensibilidad al CO',
      'Ciclo de calefacción de alto/bajo voltaje',
      'Indicador de tráfico vehicular e industria',
      'Curva logarítmica de calibración',
    ],
  },
  {
    id: 'mq135',
    titulo: 'Sensor MQ-135',
    categoria: 'sensor',
    descripcion: 'Detección de NH₃, VOC, CO₂ y contaminantes urbanos.',
    detalles: [
      'Rango: 10–300 ppm (NH₃)',
      'Detecta NOx, alcohol, benceno y humo',
      'Indicador de contaminación urbana y agrícola',
      'Requiere calibración en aire limpio (Ro)',
      'Amplio espectro de detección de gases',
    ],
  },
  {
    id: 'servidor',
    titulo: 'Backend Firebase',
    categoria: 'software',
    descripcion: 'Infraestructura en la nube para almacenamiento en tiempo real.',
    detalles: [
      'Firestore NoSQL para historial de lecturas',
      'Listeners onSnapshot para tiempo real',
      'Cloud Functions para detección de alertas',
      'Reglas de seguridad por colección',
      'Exportación de datos en formato CSV',
    ],
  },
  {
    id: 'http',
    titulo: 'Protocolo HTTP / WiFi',
    categoria: 'comunicacion',
    descripcion: 'Canal de transmisión de datos entre baliza y servidor.',
    detalles: [
      'ESP32 actúa como cliente HTTP',
      'Peticiones POST en formato JSON',
      'Autenticación con Firebase REST API',
      'Transmisión cada 10 segundos',
      'Retry automático ante fallos de red',
    ],
  },
]

export const BALIZA_DEMO: Baliza = {
  id: 'baliza-001',
  nombre: 'Baliza Principal',
  lat: 20.049,
  lng: -102.052,
  activa: true,
  firmware: 'v1.0.0',
}

