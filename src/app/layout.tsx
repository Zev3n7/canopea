// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:       'Canopea — Balizas Meteorológicas de Código Libre',
  description: 'Sistema de monitoreo de calidad del aire basado en balizas autónomas con sensores MQ y ESP32. Proyecto de investigación científica de código abierto.',
  keywords:    ['calidad del aire', 'sensores MQ', 'ESP32', 'monitoreo ambiental', 'código libre', 'Canopea'],
  authors:     [{ name: 'Proyecto Canopea' }],
  openGraph: {
    title:       'Canopea — Balizas Meteorológicas',
    description: 'Monitoreo de calidad del aire en tiempo real. Código libre.',
    type:        'website',
  },
}

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body className="antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
