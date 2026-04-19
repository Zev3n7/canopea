// src/components/ShuffleText.tsx
// Retro-terminal character shuffle animation
'use client'
import React, { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>?/\\|'

interface ShuffleTextProps {
  text: string
  className?: string
  duration?: number       // ms total
  iterationsPerChar?: number
  triggerOnMount?: boolean
  triggerOnHover?: boolean
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p'
}

export default function ShuffleText({
  text,
  className = '',
  duration = 900,
  iterationsPerChar = 5,
  triggerOnMount = true,
  triggerOnHover = false,
  as: Tag = 'span',
}: ShuffleTextProps) {
  const [display, setDisplay] = useState(triggerOnMount ? '' : text)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const shuffle = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    const totalChars = text.length
    const totalSteps = totalChars * iterationsPerChar
    let step = 0

    intervalRef.current = setInterval(() => {
      step++
      const revealedCount = Math.floor((step / totalSteps) * totalChars)

      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            if (i < revealedCount) return char
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )

      if (step >= totalSteps) {
        clearInterval(intervalRef.current!)
        setDisplay(text)
      }
    }, duration / totalSteps)
  }

  useEffect(() => {
    if (triggerOnMount) shuffle()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <Tag
      className={`font-mono ${className}`}
      onMouseEnter={triggerOnHover ? shuffle : undefined}
    >
      {display || text}
    </Tag>
  )
}
