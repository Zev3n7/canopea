// src/components/layout/Footer.tsx
import Link from 'next/link'
import { Github, Twitter, Instagram, Leaf, ExternalLink } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  const socials = [
    { icon: Github,    label: 'GitHub',    href: 'https://github.com', available: true },
    { icon: Twitter,   label: 'Twitter/X', href: '#',                  available: false },
    { icon: Instagram, label: 'Instagram', href: '#',                  available: false },
  ]

  return (
    <footer className="bg-bg-mid border-t border-border-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-lime/10 border border-lime/30 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-lime" />
              </div>
              <span className="font-display font-bold text-lg">
                <span className="text-lime">CANO</span><span className="text-cyan">PEA</span>
              </span>
            </div>
            <p className="text-text3 text-sm leading-relaxed max-w-xs">
              Sistema de monitoreo de calidad del aire de código libre basado en balizas meteorológicas autónomas con sensores MQ y ESP32.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-text3 font-mono">
              <span className="w-2 h-2 rounded-full bg-lime/60" />
              <span>Licencia MIT · Código Abierto</span>
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-text3 mb-4">Navegación</h4>
            <ul className="space-y-2">
              {[
                { href: '/',           label: 'Inicio' },
                { href: '/monitoring', label: 'Monitoreo' },
                { href: '/credits',    label: 'Créditos' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-text2 hover:text-lime transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-text3 mb-4">Redes Sociales</h4>
            <ul className="space-y-2">
              {socials.map(({ icon: Icon, label, href, available }) => (
                <li key={label}>
                  {available ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-text2 hover:text-lime transition-colors group"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <span className="flex items-center gap-2 text-sm text-text3 cursor-not-allowed">
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                      <span className="text-[10px] bg-surface border border-border-green px-1.5 py-0.5 rounded text-text3">
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
        <div className="pt-6 border-t border-border-green flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text3">
          <span>© {year} Proyecto Canopea · Todos los derechos reservados</span>
          <div className="flex items-center gap-4">
            <span className="font-mono">v1.0.0</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-lime transition-colors"
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
