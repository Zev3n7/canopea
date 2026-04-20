// src/components/BentoCard.tsx
import React from 'react'

const CANOPEA_GLOW      = '0, 223, 129'    // Caribbean Green #00DF81
const CANOPEA_GLOW_CYAN = '44, 194, 149'   // Mountain Meadow #2CC295

export interface BentoCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  glowColor?: string
  particleCount?: number
  enableTilt?: boolean
  clickEffect?: boolean
  enableMagnetism?: boolean
  disableAnimations?: boolean
}

export function BentoCard({
  children,
  className = '',
  style,
  glowColor = CANOPEA_GLOW,
}: BentoCardProps) {
  return (
    <div
      className={`relative overflow-hidden ${className} hover:shadow-[0_0_15px_rgba(0,223,129,0.15)] transition-shadow duration-300`}
      style={{
        ...style,
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

export { CANOPEA_GLOW, CANOPEA_GLOW_CYAN }
