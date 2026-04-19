// src/app/credits/page.tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Github, Linkedin, ExternalLink, ChevronDown, ChevronUp, Cpu, Radio, Server, Wifi, Zap, FlaskConical } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { AUTORES, COMPONENTES } from '@/lib/constants'
import type { ComponenteProyecto } from '@/types'

const categoryIcons: Record<ComponenteProyecto['categoria'], React.ElementType> = {
  hardware:      Cpu,
  sensor:        FlaskConical,
  software:      Server,
  comunicacion:  Wifi,
}

const categoryColors: Record<ComponenteProyecto['categoria'], { text: string; border: string; bg: string }> = {
  hardware:     { text: 'text-lime',       border: 'border-lime/20',   bg: 'bg-lime/5'   },
  sensor:       { text: 'text-cyan',       border: 'border-cyan/20',   bg: 'bg-cyan/5'   },
  software:     { text: 'text-olive-light',border: 'border-olive/30',  bg: 'bg-olive/5'  },
  comunicacion: { text: 'text-teal-light', border: 'border-teal/30',   bg: 'bg-teal/5'   },
}

function ComponenteCard({ comp }: { comp: ComponenteProyecto }) {
  const [expanded, setExpanded] = useState(false)
  const Icon  = categoryIcons[comp.categoria]
  const color = categoryColors[comp.categoria]

  return (
    <article className={`bg-surface border ${color.border} rounded-2xl overflow-hidden hover:border-opacity-60 transition-all duration-300`}>
      {/* Image placeholder */}
      <div className={`h-40 ${color.bg} border-b border-border-green flex items-center justify-center relative`}>
        {comp.imagen ? (
          <Image src={comp.imagen} alt={comp.titulo} fill className="object-cover" loading="lazy" />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-30">
            <Icon className={`w-12 h-12 ${color.text}`} />
            <span className="text-xs font-mono text-text3">Sin imagen</span>
          </div>
        )}
        {/* Category badge */}
        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full border ${color.border} ${color.bg} ${color.text} uppercase tracking-wider`}>
          {comp.categoria}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-3 mb-2">
          <div className={`w-8 h-8 rounded-lg ${color.bg} border ${color.border} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-4 h-4 ${color.text}`} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-base">{comp.titulo}</h3>
            <p className="text-text3 text-xs mt-0.5">{comp.descripcion}</p>
          </div>
        </div>

        {/* Expandable details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-3 pt-3 border-t border-border-green flex items-center justify-between text-xs text-text3 hover:text-text2 transition-colors"
        >
          <span>{expanded ? 'Ocultar detalles' : 'Ver detalles técnicos'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {expanded && (
          <ul className="mt-3 space-y-1.5">
            {comp.detalles.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-text2">
                <span className={`w-1 h-1 rounded-full ${color.text} mt-1.5 flex-shrink-0`} />
                {d}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

export default function CreditsPage() {
  const [activeCategory, setActiveCategory] = useState<ComponenteProyecto['categoria'] | 'todos'>('todos')

  const categorias: Array<{ id: ComponenteProyecto['categoria'] | 'todos'; label: string }> = [
    { id: 'todos',       label: 'Todos' },
    { id: 'hardware',    label: 'Hardware' },
    { id: 'sensor',      label: 'Sensores' },
    { id: 'software',    label: 'Software' },
    { id: 'comunicacion',label: 'Comunicación' },
  ]

  const filtered = activeCategory === 'todos'
    ? COMPONENTES
    : COMPONENTES.filter(c => c.categoria === activeCategory)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-dark pt-16">

        {/* ── Authors ── */}
        <section className="py-24 bg-bg-mid border-b border-border-green">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-mono tracking-widest text-lime uppercase">Equipo</span>
              <h1 className="text-3xl sm:text-4xl font-display font-bold mt-3 mb-4">
                Autores del <span className="gradient-text">proyecto</span>
              </h1>
              <div className="section-sep mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {AUTORES.map((autor, i) => (
                <article key={i} className="bg-surface border border-border-green rounded-2xl overflow-hidden hover:border-lime/20 transition-colors">
                  {/* Photo area */}
                  <div className="relative h-56 bg-gradient-to-br from-bg-dark via-surface to-teal-dark flex items-center justify-center border-b border-border-green">
                    {autor.foto ? (
                      <Image
                        src={autor.foto}
                        alt={autor.nombre}
                        fill
                        className="object-cover object-center"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-olive to-teal border-2 border-lime/30 flex items-center justify-center text-4xl font-bold text-lime">
                          {autor.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-xs text-text3 font-mono">Foto no disponible</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-bg-dark/80 backdrop-blur-sm rounded-lg px-3 py-2">
                        <p className="text-lime text-xs font-mono">{autor.rol}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-display font-bold mb-1">{autor.nombre}</h2>
                    <p className="text-text3 text-sm mb-4">{autor.escuela}</p>
                    <p className="text-text2 text-sm leading-relaxed mb-5">{autor.bio}</p>
                    <div className="flex items-center gap-3">
                      {autor.github && (
                        <a href={autor.github} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-text3 hover:text-lime transition-colors">
                          <Github className="w-4 h-4" /><span>GitHub</span>
                        </a>
                      )}
                      {autor.linkedin && (
                        <a href={autor.linkedin} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-text3 hover:text-cyan transition-colors">
                          <Linkedin className="w-4 h-4" /><span>LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Component blog ── */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-mono tracking-widest text-lime uppercase">Documentación</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mt-3 mb-4">
                Componentes del <span className="gradient-text">sistema</span>
              </h2>
              <div className="section-sep mx-auto mb-4" />
              <p className="text-text2 text-sm max-w-lg mx-auto">
                Descripción técnica de cada elemento que conforma la red de balizas Canopea.
              </p>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {categorias.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === id
                      ? 'bg-lime text-bg-dark'
                      : 'bg-surface border border-border-green text-text2 hover:text-lime hover:border-lime/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Components grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(comp => (
                <ComponenteCard key={comp.id} comp={comp} />
              ))}
            </div>

            {/* Add component placeholder */}
            <div className="mt-8 rounded-2xl border border-dashed border-border-green p-8 text-center">
              <Zap className="w-8 h-8 text-text3 mx-auto mb-3" />
              <h3 className="font-semibold text-text2 mb-1">¿Faltan componentes?</h3>
              <p className="text-text3 text-sm mb-4">
                Agrega más entradas editando <code className="font-mono text-lime text-xs">src/lib/constants.ts</code> en la sección <code className="font-mono text-lime text-xs">COMPONENTES</code>.
              </p>
              <a
                href="https://github.com"
                className="inline-flex items-center gap-1.5 text-sm text-text3 hover:text-lime transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Contribuir al repositorio
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
