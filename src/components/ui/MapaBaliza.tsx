// src/components/ui/MapaBaliza.tsx
import React from 'react'

export default function MapaBaliza() {
  return (
    <div className="w-full h-full min-h-[400px] bg-bg-dark rounded-xl overflow-hidden border border-border-green shadow-lg">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d915.9545429574147!2d-98.2310550304305!3d19.02560659888555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cfc0bf5ab7011d%3A0x29ef2b48a8354bb1!2sBUAP%20Preparatoria%202%20De%20Octubre%20de%201968!5e1!3m2!1ses-419!2smx!4v1776566744027!5m2!1ses-419!2smx" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen={false} 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Mapa estático de Google Maps"
      />
    </div>
  )
}