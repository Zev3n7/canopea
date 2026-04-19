// src/components/guia/TabFuentes.tsx
import { fuentes, recursos } from '@/lib/guia-data'
import { ExternalLink } from 'lucide-react'

export default function TabFuentes() {
  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="rounded-xl border border-cyan/15 bg-cyan/5 p-4">
        <p className="text-[10px] font-mono tracking-widest text-cyan mb-1">📎 FUENTES Y APORTES</p>
        <p className="text-xs text-text3">
          Los sitios académicos (ResearchGate, ScienceDirect) pueden requerir acceso institucional.
          Se presentan los conceptos clave extraídos de cada fuente.
        </p>
      </div>

      {/* Sources */}
      {fuentes.map((f, i) => (
        <div
          key={i}
          className="rounded-xl border p-5"
          style={{ background: '#111E14', borderColor: f.color + '33' }}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">{f.icon}</span>
              <div>
                <p className="text-sm font-bold text-white mb-0.5">{f.titulo}</p>
              </div>
            </div>
            <a
              href={f.url.startsWith('http') ? f.url : `https://${f.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded bg-cyan/10 hover:bg-cyan/20 text-cyan transition-colors"
              title="Abrir enlace"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <p className="text-xs text-text2 leading-relaxed mb-3">{f.aporte}</p>

          <div className="flex flex-wrap gap-1.5">
            {f.conceptos.map((c, j) => (
              <span
                key={j}
                className="text-[9px] px-2 py-0.5 rounded font-mono"
                style={{
                  background:  f.color + '11',
                  border:      `1px solid ${f.color}33`,
                  color:       f.color,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* Additional resources */}
      <div className="rounded-xl border border-lime/20 bg-lime/5 p-5">
        <p className="text-[10px] font-mono tracking-widest text-lime mb-3">
          📚 RECURSOS ADICIONALES
        </p>
        <ul className="space-y-2">
          {recursos.map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-lime text-xs flex-shrink-0">›</span>
              <span className="text-xs text-text2 leading-relaxed">{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
