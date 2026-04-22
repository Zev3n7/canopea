'use client'
import { useState, useEffect, useRef } from 'react'
import type { SensorReading } from '@/types'

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
  const [cargando,  setCargando]  = useState(true)

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
              limit(100)
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
                setCargando(false)
              },
              (_err) => {
                // Error al conectar
                setConectado(false)
                setCargando(false)
              }
            )
            return
          }
        }
      } catch (_) {
        // Credenciales no configuradas
      }

      setConectado(false)
      setCargando(false)
    }

    iniciar()

    return () => {
      if (unsubRef.current) unsubRef.current()
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

  return { lecturas, conectado, cargando, exportCSV }
}
