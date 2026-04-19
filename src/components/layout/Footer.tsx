// src/components/layout/Footer.tsx
import Link from 'next/link'
import { Github, Twitter, Instagram, Leaf, ExternalLink } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  const socials = [
    { icon: Github,    label: 'GitHub',    href: 'https://github.com/Zev3n7/canopea', available: true },
    { icon: Twitter,   label: 'Twitter/X', href: '#',                  available: false },
    { icon: Instagram, label: 'Instagram', href: '#',                  available: false },
  ]

  return (
    <footer className="bg-[#030D09] border-t border-[#095544]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: '#032221', border: '1px solid #095544' }}
              >
                <Leaf className="w-4 h-4" style={{ color: '#00DF81' }} />
              </div>
              <span className="font-display font-bold text-lg text-[#F1F7F6] tracking-widest uppercase">
                CANOPEA
              </span>
            </div>
            <p className="text-[#AAC8C4] text-sm leading-relaxed max-w-xs font-light">
              Sistema de monitoreo de calidad del aire abierto, basado en balizas meteorológicas autónomas con sensores MQ y ESP32.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-[#707D7D] font-mono tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#00DF81]/60 border border-[#00DF81]" />
              <span>Licencia MIT · Código Abierto</span>
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-[10px] font-mono font-semibold tracking-widest uppercase text-[#00DF81] mb-4">Navegación</h4>
            <ul className="space-y-3">
              {[
                { href: '/',           label: 'Inicio' },
                { href: '/monitoring', label: 'Monitoreo' },
                { href: '/guia',       label: 'Guía' },
                { href: '/credits',    label: 'Créditos' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link 
                    href={href} 
                    className="text-sm font-light text-[#AAC8C4] hover:text-[#00DF81] transition-colors inline-block hover:translate-x-1"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes */}
          <div>
            <h4 className="text-[10px] font-mono font-semibold tracking-widest uppercase text-[#00DF81] mb-4">Redes Sociales</h4>
            <ul className="space-y-3">
              {socials.map(({ icon: Icon, label, href, available }) => (
                <li key={label}>
                  {available ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-light text-[#AAC8C4] hover:text-[#00DF81] transition-colors group inline-flex"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <span className="flex items-center gap-2 text-sm text-[#707D7D] cursor-not-allowed">
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                      <span className="text-[9px] font-mono bg-[#032221] border border-[#095544] px-1.5 py-0.5 rounded text-[#707D7D]">
                        Próximamente
                      </span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-[#095544] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="text-[#707D7D] tracking-wide">© {year} Proyecto Canopea · Todos los derechos reservados</span>
          <div className="flex items-center gap-4 text-[#AAC8C4]">
            <span className="font-mono text-[10px] bg-[#032221] border border-[#095544] px-2 py-1 rounded">v2.1.0</span>
            <a
              href="https://github.com/Zev3n7/canopea"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#00DF81] transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Ver código fuente</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

