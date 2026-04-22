// src/app/credits/page.tsx
'use client'
import Image from 'next/image'
import { Github, Linkedin, ExternalLink } from 'lucide-react'
import PageHeroBanner from '@/components/layout/PageHeroBanner'
import { AUTORES } from '@/lib/constants'

export default function CreditsPage() {
  return (
    <main className="min-h-screen bg-[#030D09]">

      {/* ── FaultyTerminal Hero Banner ── */}
      <PageHeroBanner
        tag="CANOPEA :: EQUIPO · INSTITUCIÓN"
        title="Créditos del proyecto"
        subtitle="Conoce al equipo de investigación y la institución detrás del desarrollo de Canopea."
      />

      {/* ── Institution Section ── */}
      <section className="py-20 bg-bg-dark border-b border-[#095544]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* School Logo Placeholder */}
          <div className="mx-auto w-32 h-32 md:w-40 md:h-40 rounded-full border border-[#00DF81] bg-[#032221] flex items-center justify-center p-2 mb-6 overflow-hidden relative">
            {
              <Image src="/logoprepa2oct.jpg" alt="Logo Preparatoria 2 de Octubre de 1968" fill className="object-contain" />
            }
          </div>

          <h2 className="text-3xl font-display font-bold text-[#F1F7F6] mb-3">
            Preparatoria 2 de Octubre de 1968
          </h2>
          <p className="text-sm font-mono tracking-widest text-[#00DF81] mb-6 uppercase">
            Benemérita Universidad Autónoma de Puebla
          </p>

          <div className="prose prose-invert max-w-none text-sm text-[#AAC8C4] leading-relaxed bg-[#032221] border border-[#095544] p-6 rounded-2xl">
            <p>
              Este proyecto fue desarrollado bajo el marco del <strong>XXXV Concurso Estatal de Aparatos y Experimentos de Física</strong>, área de Aparatos de Uso Didáctico y Tecnológico. Categoría nivel medio superior. Edición dedicada a la divulgadora científica <strong>Julieta Norma Fierro Gossman</strong>.
            </p>
            <p className="mt-4">
              El desarrollo de <strong className="text-[#00DF81]">Canopea</strong> representa un esfuerzo por llevar conceptos avanzados de termodinámica, electromagnetismo y cinemática de gases aplicados a la electrónica moderna y el Internet de las Cosas (IoT), para demostrar cómo la ciencia escolar puede resolver problemáticas medioambientales locales mediante la democratización de los datos.
            </p>
          </div>
        </div>
      </section>

      {/* ── Authors ── */}
      <section className="py-24 bg-bg-mid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-mono tracking-widest text-[#00DF81] uppercase">Equipo de Investigación</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mt-3 mb-4" style={{ color: '#F1F7F6' }}>
              Autores del <span style={{ color: '#00DF81' }}>proyecto</span>
            </h2>
            <div className="section-sep mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {AUTORES.map((autor, i) => (
              <article key={i} className="bg-[#030D09] border border-[#095544] rounded-2xl overflow-hidden hover:border-[#00DF81]/40 transition-colors">
                {/* Photo area */}
                <div className="relative h-56 bg-gradient-to-br from-[#030D09] to-[#0B453A] flex items-center justify-center border-b border-[#095544]">
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
                      <div className="w-24 h-24 rounded-full bg-[#032221] border-2 border-[#095544] flex items-center justify-center text-4xl font-bold text-[#00DF81]">
                        {autor.nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-xs text-[#707D7D] font-mono">Foto no disponible</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-[#030D09]/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-[#095544]/50">
                      <p className="text-[#00DF81] text-xs font-mono">{autor.rol}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-display font-bold mb-1 text-[#F1F7F6]">{autor.nombre}</h3>
                  <p className="text-[#707D7D] text-sm mb-4">{autor.escuela}</p>
                  <p className="text-[#AAC8C4] text-sm leading-relaxed mb-5">{autor.bio}</p>
                  <div className="flex items-center gap-3">
                    {autor.github && (
                      <a href={autor.github} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[#AAC8C4] hover:text-[#00DF81] transition-colors">
                        <Github className="w-4 h-4" /><span>GitHub</span>
                      </a>
                    )}
                    {autor.linkedin && (
                      <a href={autor.linkedin} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[#AAC8C4] hover:text-[#00DF81] transition-colors">
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

    </main>
  )
}
