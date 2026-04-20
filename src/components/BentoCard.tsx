// src/components/BentoCard.tsx
'use client'
import React, { useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'

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

const createParticle = (x: number, y: number, color: string): HTMLDivElement => {
  const el = document.createElement('div')
  el.style.cssText = `
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.7);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `
  return el
}

export function BentoCard({
  children,
  className = '',
  style,
  glowColor = CANOPEA_GLOW,
  particleCount = 10,
  enableTilt = true,
  clickEffect = true,
  enableMagnetism = false,
  disableAnimations = false,
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement[]>([])
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const isHoveredRef = useRef(false)

  const clearParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    particlesRef.current.forEach(p => {
      gsap.to(p, {
        scale: 0, opacity: 0, duration: 0.2,
        onComplete: () => p.parentNode?.removeChild(p),
      })
    })
    particlesRef.current = []
  }, [])

  const spawnParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return
    const { width, height } = cardRef.current.getBoundingClientRect()

    for (let i = 0; i < particleCount; i++) {
      const tid = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return
        const p = createParticle(Math.random() * width, Math.random() * height, glowColor)
        cardRef.current.appendChild(p)
        particlesRef.current.push(p)

        gsap.fromTo(p, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(1.7)' })
        gsap.to(p, {
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 80,
          duration: 2 + Math.random() * 2,
          ease: 'none', repeat: -1, yoyo: true,
        })
        gsap.to(p, { opacity: 0.25, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true })
      }, i * 80)
      timeoutsRef.current.push(tid)
    }
  }, [glowColor, particleCount])

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return
    const el = cardRef.current

    const onEnter = () => { isHoveredRef.current = true; spawnParticles() }
    const onLeave = () => {
      isHoveredRef.current = false
      clearParticles()
      if (enableTilt) gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.3, ease: 'power2.out' })
      if (enableMagnetism) gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' })
    }
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left; const y = e.clientY - rect.top
      const cx = rect.width / 2; const cy = rect.height / 2

      if (enableTilt) gsap.to(el, {
        rotateX: ((y - cy) / cy) * -8,
        rotateY: ((x - cx) / cx) * 8,
        duration: 0.1, ease: 'power2.out', transformPerspective: 1000,
      })
      if (enableMagnetism) gsap.to(el, {
        x: (x - cx) * 0.04, y: (y - cy) * 0.04,
        duration: 0.3, ease: 'power2.out',
      })
      // glow CSS vars
      el.style.setProperty('--glow-x', `${((x / rect.width) * 100)}%`)
      el.style.setProperty('--glow-y', `${((y / rect.height) * 100)}%`)
      el.style.setProperty('--glow-intensity', '1')
    }
    const onClick = (e: MouseEvent) => {
      if (!clickEffect) return
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left; const y = e.clientY - rect.top
      const d = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y), Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height))
      const ripple = document.createElement('div')
      ripple.style.cssText = `position:absolute;width:${d*2}px;height:${d*2}px;border-radius:50%;background:radial-gradient(circle,rgba(${glowColor},0.35) 0%,transparent 70%);left:${x-d}px;top:${y-d}px;pointer-events:none;z-index:999;`
      el.appendChild(ripple)
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => ripple.remove() })
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('click', onClick)
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('click', onClick)
      clearParticles()
    }
  }, [disableAnimations, enableTilt, enableMagnetism, clickEffect, spawnParticles, clearParticles])

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-intensity': '0',
        '--glow-radius': '200px',
        '--glow-color': glowColor,
        ...style,
      } as React.CSSProperties}
    >
      {/* Border glow effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-10 transition-opacity duration-300"
        style={{
          padding: '1px',
          background: `radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y), rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%, rgba(${glowColor}, calc(var(--glow-intensity) * 0.3)) 40%, transparent 60%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
        }}
      />
      {children}
    </div>
  )
}

export { CANOPEA_GLOW, CANOPEA_GLOW_CYAN }
