// src/hooks/useFirestore.ts
'use client'
import { useState, useEffect, useRef } from 'react'
import type { SensorReading } from '@/types'
import { generarLecturaDemo } from '@/lib/constants'

// ─── Utilidad: convierte cualquier valor a number seguro ─────────────────────
function toNum(val: unknown, fallback = 0): number {
  const n = Number(val)
  return isFinite(n) ? n : fallback
}

// ─── Normaliza un documento crudo de Firestore a SensorReading ───────────────
function normalizar(raw: Record<string, unknown>, id: string): SensorReading {
  return {
    id,
    timestamp:  (raw.timestamp as SensorReading['timestamp']) ?? new Date(),
    mq2_ppm:    toNum(raw.mq2_ppm),
    // mq7 acepta tanto mq7_ppm como mq6_ppm (nombre del ESP32 real)
    mq7_ppm:    toNum(raw.mq7_ppm   ?? raw.mq6_ppm),
    // mq135 acepta tanto mq135_ppm como mq145_ppm (nombre del ESP32 real)
    mq135_ppm:  toNum(raw.mq135_ppm ?? raw.mq145_ppm),
    fuente: (raw.fuente as SensorReading['fuente']) ?? 'esp32',
  }
}

// ─── Hook principal ──────────────────────────────────────────────────────────
export function useMonitoreo(balizaId: string) {
  const [lecturas, setLecturas]   = useState<SensorReading[]>([])
  const [conectado, setConectado] = useState(false)
  const [modoDemo,  setModoDemo]  = useState(true)
  const [cargando,  setCargando]  = useState(true)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const unsubRef    = useRef<(() => void) | null>(null)

  useEffect(() => {
    const iniciar = async () => {
      setCargando(true)

      try {
        const { isFirebaseConfigured, initFirebase } = await import('@/lib/firebase')
        if (isFirebaseConfigured()) {
          const fb = initFirebase()
          if (fb) {
            const { collection, query, orderBy, limit, onSnapshot } =
              await import('firebase/firestore')

            const q = query(
              collection(fb.db, 'balizas', balizaId, 'lecturas'),
              orderBy('timestamp', 'desc'),
              limit(50)
            )

            unsubRef.current = onSnapshot(
              q,
              (snap) => {
                const data = snap.docs.map(d =>
                  normalizar(
                    d.data({ serverTimestamps: 'estimate' }) as Record<string, unknown>,
                    d.id
                  )
                )
                setLecturas(data)
                setConectado(true)
                setModoDemo(false)
                setCargando(false)
              },
              (_err) => {
                // Si Firestore falla, caemos a demo
                iniciarDemo()
              }
            )
            return
          }
        }
      } catch (_) {
        // Credenciales no configuradas → demo
      }

      iniciarDemo()
    }

    const iniciarDemo = () => {
      const historial: SensorReading[] = Array.from({ length: 50 }, (_, i) =>
        generarLecturaDemo(i * 10)
      )
      setLecturas(historial)
      setModoDemo(true)
      setConectado(false)
      setCargando(false)

      intervalRef.current = setInterval(() => {
        setLecturas(prev => [generarLecturaDemo(0), ...prev.slice(0, 49)])
      }, 4000)
    }

    iniciar()

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (unsubRef.current)    unsubRef.current()
    }
  }, [balizaId])

  // ── Exportar CSV ────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const header = 'timestamp,baliza,mq2_ppm,mq7_ppm,mq135_ppm\n'
    const rows   = lecturas.map(l => {
      const ts =
        l.timestamp instanceof Date
          ? l.timestamp
          : new Date((l.timestamp as { seconds: number }).seconds * 1000)
      return [
        ts.toISOString(),
        balizaId,
        toNum(l.mq2_ppm).toFixed(2),
        toNum(l.mq7_ppm).toFixed(2),
        toNum(l.mq135_ppm).toFixed(2),
      ].join(',')
    }).join('\n')

    const blob = new Blob([header + rows], { type: 'text/csv' })
    const a    = document.createElement('a')
    a.href     = URL.createObjectURL(blob)
    a.download = `canopea_${balizaId}_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return { lecturas, conectado, modoDemo, cargando, exportCSV }
}
