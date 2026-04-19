// src/components/sections/About.tsx
import { BookOpen, Users, Leaf } from 'lucide-react'
import { AUTORES } from '@/lib/constants'

export default function About() {
  return (
    <section id="about" className="py-24 bg-bg-mid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-16 text-center">
          <span className="text-xs font-mono tracking-widest text-lime uppercase">01 · Acerca del proyecto</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold mt-3 mb-4">
            ¿Qué es <span className="gradient-text">Canopea</span>?
          </h2>
          <div className="section-sep mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Definición Canopea */}
          <div className="bg-surface border border-border-green rounded-2xl p-8 glow-box">
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
              El nombre refleja la misión del proyecto: construir una red de sensores que actúe como ese dosel invisible, monitoreando y protegiendo la calidad del aire en zonas urbanas, periurbanas y rurales.
            </p>
          </div>

          {/* Definición baliza */}
          <div className="bg-surface border border-border-green rounded-2xl p-8 glow-box-cyan">
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
          </div>
        </div>

        {/* Autores */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-5 h-5 text-lime" />
            <h3 className="text-xl font-display font-semibold">Equipo de investigación</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {AUTORES.map((autor, i) => (
              <div
                key={i}
                className="bg-surface border border-border-green rounded-2xl p-6 hover:border-lime/30 transition-colors"
              >
                {/* Avatar placeholder */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-olive to-teal border-2 border-lime/20 flex items-center justify-center mb-4 text-2xl font-bold text-lime">
                  {autor.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <h4 className="font-semibold text-lg">{autor.nombre}</h4>
                <p className="text-lime text-sm mb-1">{autor.rol}</p>
                <p className="text-text3 text-sm mb-3">{autor.escuela}</p>
                <p className="text-text2 text-sm leading-relaxed">{autor.bio}</p>
              </div>
            ))}
          </div>

          {/* Institución */}
          <div className="mt-8 p-6 rounded-2xl border border-dashed border-border-green text-center">
            <p className="text-text3 text-sm">
              <span className="text-text2">Institución:</span>{' '}
              <span className="font-mono text-lime">[Nombre de la Escuela / Institución]</span>
            </p>
            <p className="text-text3 text-xs mt-1">Nivel Preparatoria · Área de Física · Concurso de Investigación Científica · 2025</p>
          </div>
        </div>
      </div>
    </section>
  )
}
