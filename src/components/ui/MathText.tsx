// src/components/ui/MathText.tsx
'use client'
import React from 'react'
import { InlineMath, BlockMath } from 'react-katex'

export default function MathText({ content, className = '' }: { content: string; className?: string }) {
  // If the content is purely a block formula (starts and ends with $$ after trimming)
  const trimmed = content.trim()
  if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
    const math = trimmed.slice(2, -2).trim()
    return (
      <div className={className}>
        <BlockMath math={math} />
      </div>
    )
  }

  // Otherwise, split by inline math $ ... $
  // Regex to match $...$
  const parts = content.split(/(\$[^$]+\$)/g)

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1)
          return <InlineMath key={i} math={math} />
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}
