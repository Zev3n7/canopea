// src/components/ui/TextType.tsx
// Implementación propia de la animación "Text Type" de React Bits
'use client'
import { useState, useEffect, useRef } from 'react'

interface TextTypeProps {
  texts:              string[]
  typingSpeed?:       number
  deletingSpeed?:     number
  pauseDuration?:     number
  showCursor?:        boolean
  cursorCharacter?:   string
  className?:         string
  loop?:              boolean
}

export default function TextType({
  texts,
  typingSpeed     = 60,
  deletingSpeed   = 35,
  pauseDuration   = 1800,
  showCursor      = true,
  cursorCharacter = '|',
  className       = '',
  loop            = true,
}: TextTypeProps) {
  const [displayed,  setDisplayed]  = useState('')
  const [phase,      setPhase]      = useState<'typing'|'pause'|'deleting'>('typing')
  const [textIndex,  setTextIndex]  = useState(0)
  const [charIndex,  setCharIndex]  = useState(0)
  const [cursorOn,   setCursorOn]   = useState(true)

  // Cursor blink
  useEffect(() => {
    if (!showCursor) return
    const id = setInterval(() => setCursorOn(p => !p), 530)
    return () => clearInterval(id)
  }, [showCursor])

  useEffect(() => {
    const current = texts[textIndex] ?? ''

    if (phase === 'typing') {
      if (charIndex < current.length) {
        const id = setTimeout(() => {
          setDisplayed(current.slice(0, charIndex + 1))
          setCharIndex(c => c + 1)
        }, typingSpeed)
        return () => clearTimeout(id)
      } else {
        const id = setTimeout(() => setPhase('pause'), pauseDuration)
        return () => clearTimeout(id)
      }
    }

    if (phase === 'pause') {
      if (!loop && textIndex === texts.length - 1) return
      setPhase('deleting')
    }

    if (phase === 'deleting') {
      if (charIndex > 0) {
        const id = setTimeout(() => {
          setDisplayed(current.slice(0, charIndex - 1))
          setCharIndex(c => c - 1)
        }, deletingSpeed)
        return () => clearTimeout(id)
      } else {
        setTextIndex(i => (i + 1) % texts.length)
        setPhase('typing')
      }
    }
  }, [phase, charIndex, textIndex, texts, typingSpeed, deletingSpeed, pauseDuration, loop])

  return (
    <span className={className}>
      {displayed}
      {showCursor && (
        <span
          className="ml-0.5"
          style={{ opacity: cursorOn ? 1 : 0, transition: 'opacity 0.1s' }}
        >
          {cursorCharacter}
        </span>
      )}
    </span>
  )
}
