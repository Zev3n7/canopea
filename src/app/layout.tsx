// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import 'katex/dist/katex.min.css'

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
        {/* Preconnect & preload fonts for faster LCP */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        {/* Leaflet CSS loaded only where needed via dynamic import, not globally */}
      </head>
      <body className="antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
