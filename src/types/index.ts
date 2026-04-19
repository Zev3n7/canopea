// src/types/index.ts

export interface SensorReading {
  id:          string
  timestamp:   { seconds: number; nanoseconds: number } | Date
  mq2_ppm:     number
  mq7_ppm:     number
  mq135_ppm:   number
  fuente:      'esp32' | 'demo' | 'sim'
}

export interface Baliza {
  id:       string
  nombre:   string
  lat:      number
  lng:      number
  activa:   boolean
  firmware: string
}

export interface Umbrales {
  mq2:   number
  mq7:   number
  mq135: number
}

export interface Author {
  nombre:    string
  rol:       string
  escuela:   string
  foto?:     string
  bio:       string
  github?:   string
  linkedin?: string
}

export interface ComponenteProyecto {
  id:          string
  titulo:      string
  descripcion: string
  imagen?:     string
  detalles:    string[]
  categoria:   'hardware' | 'software' | 'sensor' | 'comunicacion'
}
