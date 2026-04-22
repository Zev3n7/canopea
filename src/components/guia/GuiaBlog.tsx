// src/components/guia/GuiaBlog.tsx
'use client'
import { sections, flujoSistema, fuentes, recursos } from '@/lib/guia-data'
import { COMPONENTES } from '@/lib/constants'
import MathText from '@/components/ui/MathText'
import { ExternalLink, Terminal, GitFork, Network, Cpu, Code2, BookOpen } from 'lucide-react'

export default function GuiaBlog() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 py-10 relative">
      
      {/* ── Desktop TOC (Sticky Sidebar) ── */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-4">
          <p className="text-[10px] font-mono tracking-widest text-[#00DF81] uppercase font-semibold pl-3 border-l text-[#00DF81] border-[#00DF81]">Tabla de contenidos</p>
          <nav className="flex flex-col gap-1.5 border-l border-[#095544] pl-3">
            <a href="#intro" className="text-xs text-[#AAC8C4] hover:text-[#00DF81] transition-colors py-1">1. ¿Qué es Canopea?</a>
            <a href="#arquitectura" className="text-xs text-[#AAC8C4] hover:text-[#00DF81] transition-colors py-1">2. Arquitectura del Sistema</a>
            <a href="#componentes" className="text-xs text-[#AAC8C4] hover:text-[#00DF81] transition-colors py-1">3. Componentes de Hardware y Software</a>
            <a href="#fisica" className="text-xs text-[#AAC8C4] hover:text-[#00DF81] transition-colors py-1">4. Fundamentos Físicos Básicos</a>
            <a href="#codigo" className="text-xs text-[#AAC8C4] hover:text-[#00DF81] transition-colors py-1">5. Firmware (ESP32)</a>
            <a href="#fuentes" className="text-xs text-[#AAC8C4] hover:text-[#00DF81] transition-colors py-1">6. Fuentes y Bibliografía</a>
          </nav>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 max-w-3xl min-w-0 pb-20 space-y-20">

        {/* 1. Intro */}
        <section id="intro" className="scroll-mt-24">
          <div className="mb-6 border-b border-[#095544] pb-2">
            <h2 className="text-2xl font-display font-bold text-[#F1F7F6]">1. ¿Qué es Canopea?</h2>
          </div>
          <div className="prose prose-invert max-w-none text-sm text-[#AAC8C4] leading-relaxed">
            <p>
              <strong className="text-[#00DF81]">Canopea</strong> es un sistema de código abierto diseñado para el sensado y monitoreo de las concentraciones de gases ambientales mediante transductores <strong className="text-white">MQ de Óxido Metálico-Semiconductor (MOS)</strong>. La red permite procesar e interpretar variaciones analógicas desde una red estática de balizas meteorológicas transmitidas inalámbricamente a la nube y visualizadas en un panel central.
            </p>
            <p className="mt-4">
              Cada baliza lee los datos en partes por millón (ppm) midiendo resistencias variables en serie y determina un Índice de Calidad del Aire (AQI) propio basado en el algoritmo matemático general con escalas logarítmicas, ajustado y respaldado por la NOM-172-SEMARNAT-2019 de México.
            </p>
          </div>
        </section>


        {/* 2. Arquitectura */}
        <section id="arquitectura" className="scroll-mt-24">
          <div className="mb-6 border-b border-[#095544] pb-2">
            <h2 className="text-2xl font-display font-bold text-[#F1F7F6] flex items-center gap-3">
              <Network className="w-6 h-6 text-[#00DF81]" />
              2. Arquitectura del Sistema
            </h2>
          </div>

          <p className="text-sm text-[#AAC8C4] mb-6">
            Flujo completo de la información desde la detección del gas en el ambiente hasta la página web.
          </p>

          <div className="space-y-1">
            {flujoSistema.map((s, i) => (
              <div key={i}>
                <div className="flex items-center gap-3 rounded-xl px-4 py-3 border border-[#00DF81]/20 bg-[#032221]">
                  <span className="text-lg flex-shrink-0">{s.icon || '🔸'}</span>
                  <div className="flex-1">
                    <span className="text-xs font-bold tracking-wide text-[#00DF81]">{s.label}</span>
                    <p className="text-[10px] text-[#707D7D] mt-0.5">{s.desc}</p>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#00DF81]/10 border border-[#00DF81]/20 text-[#00DF81]">P{i + 1}</span>
                </div>
                {i < flujoSistema.length - 1 && (
                  <div className="text-center text-[#707D7D] text-base leading-4 py-1">↓</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 3. Componentes (Movido de Créditos) */}
        <section id="componentes" className="scroll-mt-24">
          <div className="mb-6 border-b border-[#095544] pb-2">
            <h2 className="text-2xl font-display font-bold text-[#F1F7F6] flex items-center gap-3">
              <Cpu className="w-6 h-6 text-[#00DF81]" />
              3. Componentes (Hardware y Software)
            </h2>
          </div>
          
          <p className="text-sm text-[#AAC8C4] mb-6">
            Componentes principales utilizados para construir la baliza Canopea.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COMPONENTES.map(c => (
              <div key={c.id} className="bg-[#032221] border border-[#095544] p-5 rounded-2xl hover:border-[#00DF81]/40 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-[#F1F7F6] text-sm">{c.titulo}</h3>
                  <span className="text-[9px] font-mono tracking-widest text-[#00DF81] uppercase bg-[#00DF81]/10 px-1.5 py-0.5 rounded-full">{c.categoria}</span>
                </div>
                <p className="text-xs text-[#AAC8C4] mb-3">{c.descripcion}</p>
                <ul className="space-y-1.5">
                  {c.detalles.map((d, i) => (
                    <li key={i} className="text-[11px] text-[#707D7D] flex gap-2"><span className="text-[#00DF81]">›</span> {d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>


        {/* 4. Física */}
        <section id="fisica" className="scroll-mt-24">
          <div className="mb-6 border-b border-[#095544] pb-2">
            <h2 className="text-2xl font-display font-bold text-[#F1F7F6] flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#00DF81]" />
              4. Fundamentos Físicos Básicos
            </h2>
          </div>

          <div className="rounded-xl p-4 mb-6 border border-[#095544] bg-[#032221]">
            <div className="flex items-center gap-2 mb-3">
              <GitFork className="w-3.5 h-3.5 text-[#00DF81]" />
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#00DF81]">Hilo Conductor (Sensado químico)</span>
            </div>
            <p className="text-sm leading-relaxed text-[#AAC8C4]">
              Los sensores MQ son <strong className="text-[#F1F7F6]">transductores quimioresistivos</strong>: la adsorción de gas en SnO₂ cambia su resistencia (Rs) → circuito en <strong className="text-[#00DF81]">divisor de voltaje</strong> genera Vout → el <strong className="text-[#00DF81]">ADC del ESP32</strong> lo digitaliza → se calcula ppm midiendo variaciones logarítmicas.
            </p>
          </div>

          <div className="space-y-6 mt-8">
            {sections.map((s, index) => (
              <div key={s.id} className="border border-[#095544] rounded-2xl overflow-hidden bg-[#032221]">
                <div className="bg-[#030D09]/50 p-4 border-b border-[#095544]">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-mono text-[#00DF81] bg-[#00DF81]/10 w-8 h-8 flex items-center justify-center rounded-lg border border-[#00DF81]/20">0{index + 1}</span>
                    <div>
                      <h3 className="font-semibold text-[#F1F7F6] text-sm">{s.title}</h3>
                      <p className="text-[#707D7D] text-xs">{s.subtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {/* Fórmulas */}
                  {s.formula && (
                    <div className="mb-5 rounded-lg py-3 px-4 text-center border border-[#00DF81]/20 bg-[#030D09]">
                      <MathText content={s.formula} className="text-sm font-bold font-mono tracking-wide mb-1 block" />
                      <MathText content={s.formulaNote} className="text-[10px] block" />
                    </div>
                  )}
                  {/* Preguntas/Conceptos */}
                  <div className="space-y-4">
                    {s.topics.map((t, i) => (
                      <div key={i} className="pl-3 border-l-2 border-[#00DF81]/40">
                        <p className="text-[10px] font-bold mb-1 uppercase tracking-wide text-[#00DF81]">{t.q}</p>
                        <MathText content={t.a} className="text-[13px] leading-relaxed text-[#AAC8C4]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Code / Firmware */}
        <section id="codigo" className="scroll-mt-24">
          <div className="mb-6 border-b border-[#095544] pb-2">
            <h2 className="text-2xl font-display font-bold text-[#F1F7F6] flex items-center gap-3">
              <Code2 className="w-6 h-6 text-[#00DF81]" />
              5. Código del Microcontrolador (ESP32)
            </h2>
          </div>

          <div className="prose prose-invert max-w-none text-sm text-[#AAC8C4] mb-6">
            <p>
              El código para programar la placa ESP32 (escrito en C++/Arduino) se encarga de:
            </p>
            <ul>
              <li>Conectarse al Wi-Fi especificado.</li>
              <li>Leer iterativamente los voltajes analógicos de los sensores MQ (pines GPIO-32, 33, 34).</li>
              <li>Calcular las ppm utilizando las constantes <code>a</code> y <code>b</code> de las hojas técnicas de Winsen.</li>
              <li>Armar una trama formato JSON con los datos.</li>
              <li>Realizar las peticiones (HTTP POST) al URL de nuestra base de datos de Firebase.</li>
            </ul>
            <p className="mt-4">
              <a href="https://github.com/Zev3n7/canopea" className="text-[#00DF81] hover:underline" target="_blank" rel="noopener noreferrer">Puedes ver el repositorio completo y los scripts de calibración en GitHub →</a>
            </p>
          </div>

          <div className="bg-[#030D09] border border-[#095544] rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-[#095544] bg-[#032221]">
              <Terminal className="w-4 h-4 text-[#707D7D]" />
              <span className="text-xs font-mono text-[#707D7D]">main.ino (Fragmento)</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="text-xs font-mono text-[#AAC8C4] leading-relaxed">
{`// Lectura Analógica ADC (ESP32: 0-4095)
int rawMQ2 = analogRead(pinMQ2);
int rawMQ7 = analogRead(pinMQ7);
int rawMQ135 = analogRead(pinMQ135);

// Conversión de ADC a Voltaje (ESP32 usa 3.3V)
float V2 = (rawMQ2 / 4095.0) * 3.3;

// Cálculo Resistivo (Ley de Ohm) - Rl = 10kOhm típica
float Rs2 = ((3.3 * 10.0) / V2) - 10.0;

// Relación sobre sensor en aire limpio (Calibrado previo)
float ratio2 = Rs2 / Ro2;
// Fórmula empírica gas (Logaritmos)
float ppmMQ2 = a2 * pow(ratio2, b2);`}
              </pre>
            </div>
          </div>
        </section>

        {/* 6. Fuentes */}
        <section id="fuentes" className="scroll-mt-24">
          <div className="mb-6 border-b border-[#095544] pb-2">
            <h2 className="text-2xl font-display font-bold text-[#F1F7F6]">6. Fuentes y Bibliografía</h2>
          </div>

          <p className="text-sm text-[#AAC8C4] mb-6">
            Documentación académica, normativa ambiental y referentes teóricos utilizados en el desarrollo de <strong>Canopea</strong>.
          </p>

          <div className="space-y-4">
            {fuentes.map((f, i) => (
              <div key={i} className="rounded-xl border border-[#095544] p-5 bg-[#032221]">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">{f.icon || '📄'}</span>
                    <div>
                      <p className="text-sm font-bold text-white mb-0.5">{f.titulo}</p>
                    </div>
                  </div>
                  <a href={f.url.startsWith('http') ? f.url : `https://${f.url}`} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded hover:bg-[#00DF81]/10 text-[#00DF81] transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-[#AAC8C4] leading-relaxed mb-3">{f.aporte}</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.conceptos.map((c, j) => (
                    <span key={j} className="text-[9px] px-2 py-0.5 rounded font-mono bg-[#00DF81]/10 border border-[#00DF81]/20 text-[#00DF81]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-[#00DF81]/20 bg-[#00DF81]/5 p-5">
            <p className="text-[10px] font-mono tracking-widest text-[#00DF81] mb-3">📚 DATASHEETS Y RECURSOS</p>
            <ul className="space-y-2">
              {recursos.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#00DF81] text-xs flex-shrink-0">›</span>
                  <span className="text-xs text-[#AAC8C4] leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

      </div>
    </div>
  )
}
