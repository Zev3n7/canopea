// src/components/guia/TabProcedimiento.tsx
'use client'
import { Image as ImageIcon } from 'lucide-react'

const ACCENT     = '#00DF81'
const BORDER     = '#095544'
const BG_CARD    = '#032221'
const BG_EXPAND  = '#030D09'

export default function TabProcedimiento() {
  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div
        className="rounded-xl p-6"
        style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <ImageIcon className="w-5 h-5" style={{ color: ACCENT }} />
          <h2
            className="text-lg font-mono tracking-widest uppercase font-semibold"
            style={{ color: '#F1F7F6' }}
          >
            Proceso de Creación y Experimentación
          </h2>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: '#F1F7F6' }}>
          En esta sección se documenta el procedimiento paso a paso utilizado para el desarrollo de la baliza meteorológica Canopea. Puedes cargar imágenes para ilustrar el ensamblaje del hardware, la calibración de sensores y las pruebas de campo.
        </p>
      </div>

      {/* Image Gallery placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Placeholder 1 */}
        <div 
          className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-64 flex flex-col items-center justify-center relative group"
          style={{ background: BG_EXPAND, border: `1px dashed ${ACCENT}50` }}
        >
          <ImageIcon className="w-10 h-10 mb-2 opacity-50" style={{ color: ACCENT }} />
          <span className="text-sm font-mono" style={{ color: '#F1F7F6' }}>Imagen del Ensamblaje 1</span>
          <span className="text-xs mt-1" style={{ color: '#AAC8C4' }}>(Reemplazar en código)</span>
          {/* <img src="/tu-imagen-aqui.jpg" alt="Ensamblaje 1" className="absolute inset-0 w-full h-full object-cover z-10" /> */}
        </div>

        {/* Placeholder 2 */}
        <div 
          className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-64 flex flex-col items-center justify-center relative group"
          style={{ background: BG_EXPAND, border: `1px dashed ${ACCENT}50` }}
        >
          <ImageIcon className="w-10 h-10 mb-2 opacity-50" style={{ color: ACCENT }} />
          <span className="text-sm font-mono" style={{ color: '#F1F7F6' }}>Esquema de Conexiones</span>
          <span className="text-xs mt-1" style={{ color: '#AAC8C4' }}>(Reemplazar en código)</span>
          {/* <img src="/tu-imagen-aqui.jpg" alt="Conexiones" className="absolute inset-0 w-full h-full object-cover z-10" /> */}
        </div>
        
        {/* Placeholder 3 */}
        <div 
          className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-64 flex flex-col items-center justify-center relative group md:col-span-2"
          style={{ background: BG_EXPAND, border: `1px dashed ${ACCENT}50` }}
        >
          <ImageIcon className="w-10 h-10 mb-2 opacity-50" style={{ color: ACCENT }} />
          <span className="text-sm font-mono" style={{ color: '#F1F7F6' }}>Diagrama o Fotografía del Proceso</span>
          <span className="text-xs mt-1" style={{ color: '#AAC8C4' }}>(Reemplazar en código)</span>
          {/* <img src="/tu-imagen-aqui.jpg" alt="Proceso" className="absolute inset-0 w-full h-full object-cover z-10" /> */}
        </div>
      </div>
    </div>
  )
}
