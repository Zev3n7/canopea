// src/app/guia/page.tsx
'use client'
import { useState } from 'react'
import { BookOpen, Cpu, FileText } from 'lucide-react'
import PageHeroBanner from '@/components/layout/PageHeroBanner'
import TabGuia        from '@/components/guia/TabGuia'
import TabSistema     from '@/components/guia/TabSistema'
import TabFuentes     from '@/components/guia/TabFuentes'

type Tab = 'guia' | 'mapa' | 'fuentes'

const tabs: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: 'guia',    label: 'Temas',   Icon: BookOpen  },
  { id: 'mapa',    label: 'Sistema', Icon: Cpu       },
  { id: 'fuentes', label: 'Fuentes', Icon: FileText  },
]

export default function GuiaPage() {
  const [activeTab, setActiveTab] = useState<Tab>('guia')

  return (
    <main className="min-h-screen bg-bg-dark">

        <PageHeroBanner
          tag="FÍSICA APLICADA · IOT · BALIZA METEOROLÓGICA"
          title="BALIZA METEOROLÓGICA"
          subtitle="Guía técnica completa del sistema Canopea: sensores MQ, microcontrolador ESP32, mapa del sistema IoT y fuentes de referencia científica."
        />

        {/* Tabs */}
        <div className="border-b border-border-green bg-bg-dark">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="flex overflow-x-auto">
              {tabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="flex items-center gap-2 px-5 py-3.5 text-[11px] font-mono tracking-widest uppercase whitespace-nowrap transition-all border-b-2"
                  style={{
                    borderColor: activeTab === id ? '#00DF81' : 'transparent',
                    color:       activeTab === id ? '#00DF81' : '#707D7D',
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {activeTab === 'guia'    && <TabGuia />}
          {activeTab === 'mapa'    && <TabSistema />}
          {activeTab === 'fuentes' && <TabFuentes />}
        </div>

        {/* Footer strip */}
        <div className="border-t border-border-green py-4 text-center">
          <p className="text-[9px] font-mono tracking-widest text-text3">
            BALIZA · MQ-2 · MQ-7 · MQ-135 · ESP32 · IOT · FÍSICA APLICADA
          </p>
        </div>
      </main>
  )
}
