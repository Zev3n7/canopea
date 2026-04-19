// src/components/FaultyTerminal.tsx
import React from 'react';

export interface FaultyTerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  scale?: number;
  gridMul?: [number, number];
  digitSize?: number;
  timeScale?: number;
  pause?: boolean;
  scanlineIntensity?: number;
  glitchAmount?: number;
  flickerAmount?: number;
  noiseAmp?: number;
  chromaticAberration?: number;
  dither?: number | boolean;
  curvature?: number;
  tint?: string;
  mouseReact?: boolean;
  mouseStrength?: number;
  dpr?: number;
  pageLoadAnimation?: boolean;
  brightness?: number;
}

export default function FaultyTerminal({
  className = '',
  style,
  ...rest
}: FaultyTerminalProps) {
  // Animación eliminada para optimizar rendimiento.
  // Reemplazado por un fondo estático simulando un grid tech-noir.
  return (
    <div
      className={`w-full h-full relative overflow-hidden ${className}`}
      style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(0, 223, 129, 0.08) 0%, rgba(3, 13, 9, 1) 100%)',
        backgroundImage: 'linear-gradient(rgba(0, 223, 129, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 223, 129, 0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        ...style
      }}
      {...rest}
    />
  );
}
