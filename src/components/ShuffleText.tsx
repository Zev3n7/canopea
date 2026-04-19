// src/components/ShuffleText.tsx
import React, { ElementType } from 'react';

interface ShuffleTextProps {
  text: string;
  as?: ElementType;
  duration?: number;
  iterationsPerChar?: number;
  triggerOnMount?: boolean;
  triggerOnHover?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function ShuffleText({
  text,
  as: Component = 'span',
  className = '',
  style,
}: ShuffleTextProps) {
  // Animación tipo scramble eliminada para optimizar rendimiento.
  return (
    <Component className={className} style={style}>
      {text}
    </Component>
  );
}
