// src/components/sections/About.tsx
import { BookOpen, Users, Leaf } from 'lucide-react'
import { AUTORES } from '@/lib/constants'
import { BentoCard, CANOPEA_GLOW, CANOPEA_GLOW_CYAN } from '@/components/BentoCard'
import ScrollFloat from '@/components/ScrollFloat'

export default function About() {
  return (
    <section id="about" className="py-24 bg-bg-mid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-16 text-center">
          <span className="text-xs font-mono tracking-widest text-lime uppercase">01 · Acerca del proyecto</span>
          <ScrollFloat
            textClassName="text-2xl sm:text-3xl md:text-4xl font-display font-bold mt-3 mb-4 text-balance"
            animationDuration={0.9}
            stagger={0.025}
          >
            ¿Qué es el proyecto Canopea?
          </ScrollFloat>
          <div className="section-sep mx-auto" />
        </div>

        {/* Bento grid: 2 main cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-20">
          {/* Definición Canopea */}
          <BentoCard
            className="bg-surface border border-border-green rounded-2xl p-8 aspect-auto min-h-[260px] hover:-translate-y-1 transition-transform duration-300 glow-box"
            glowColor={CANOPEA_GLOW}
            enableTilt
            enableMagnetism={false}
            clickEffect
            particleCount={12}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-lime/10 border border-lime/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-lime" />
              </div>
              <h3 className="text-xl font-display font-semibold">La palabra «Canopea»</h3>
            </div>
            <p className="text-text2 leading-relaxed mb-4">
              <span className="text-lime font-semibold">Canopea</span> hace referencia al <em>dosel forestal</em> — la capa superior del bosque formada por el follaje de los árboles más altos. Este estrato actúa como filtro natural del aire, regulando la temperatura, la humedad y la calidad atmosférica del ecosistema subyacente.
            </p>
            <p className="text-text2 leading-relaxed">
              El nombre refleja la misión del proyecto: construir una red de sensores que actúe como ese dosel invisible, monitoreando y protegiendo la calidad del aire en zonas urbanas, periurbanas y rurales. A traves de la filosofia de codigo abierto, permitiendo a estudiantes de todos lados poder experimentar y aprender del uso practico de la Física.
            </p>
          </BentoCard>

          {/* Definición baliza */}
          <BentoCard
            className="bg-surface border border-border-green rounded-2xl p-8 aspect-auto min-h-[260px] hover:-translate-y-1 transition-transform duration-300 glow-box-cyan"
            glowColor={CANOPEA_GLOW_CYAN}
            enableTilt
            enableMagnetism={false}
            clickEffect
            particleCount={12}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-cyan" />
              </div>
              <h3 className="text-xl font-display font-semibold">¿Qué es una baliza meteorológica?</h3>
            </div>
            <p className="text-text2 leading-relaxed mb-4">
              Una <span className="text-cyan font-semibold">baliza meteorológica</span> es un dispositivo autónomo de monitoreo ambiental diseñado para recopilar datos atmosféricos en tiempo real. A diferencia de las estaciones meteorológicas convencionales, las balizas son compactas, portátiles y de bajo costo.
            </p>
            <p className="text-text2 leading-relaxed">
              Las balizas Canopea integran sensores electroquímicos MQ para medir concentraciones de gases contaminantes, un microcontrolador ESP32 para el procesamiento de datos, y conectividad WiFi para transmitir la información a un servidor central en la nube.
            </p>
          </BentoCard>
        </div>

        {/* Autores */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-5 h-5 text-lime" />
            <h3 className="text-xl font-display font-semibold">Equipo de investigación</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AUTORES.map((autor, i) => (
              <BentoCard
                key={i}
                className="bg-surface border border-border-green rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300"
                glowColor={i % 2 === 0 ? CANOPEA_GLOW : CANOPEA_GLOW_CYAN}
                enableTilt
                clickEffect
                particleCount={8}
              >
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-olive to-teal border-2 border-lime/20 flex items-center justify-center mb-4 text-2xl font-bold text-lime">
                  {autor.nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <h4 className="font-semibold text-lg">{autor.nombre}</h4>
                <p className="text-lime text-sm mb-1">{autor.rol}</p>
                <p className="text-text3 text-sm mb-3">{autor.escuela}</p>
                <p className="text-text2 text-sm leading-relaxed">{autor.bio}</p>
              </BentoCard>
            ))}
          </div>

          {/* Institución */}
          <div className="mt-6 p-6 rounded-2xl border border-dashed border-border-green text-center">
            <p className="text-text3 text-sm">
              <span className="text-text2">Institución:</span>{' '}
              <span className="font-mono text-lime">Preaparatoria 2 de Octubre de 1968</span>
            </p>
            <p className="text-text3 text-xs mt-1">Nivel Preparatoria · Área de Física · XXXV CONCURSO ESTATAL DE APARATOS Y EXPERIMENTOS DE FISICA · Dedicado a Julieta Norma Fierro Gossman</p>
          </div>
        </div>
      </div>
    </section>
  )
}
