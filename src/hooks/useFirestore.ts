// src/hooks/useFirestore.ts
'use client'
import { useState, useEffect, useRef } from 'react'
import type { SensorReading } from '@/types'
import { generarLecturaDemo } from '@/lib/constants'

export function useMonitoreo(balizaId: string) {
  const [lecturas, setLecturas]       = useState<SensorReading[]>([])
  const [conectado, setConectado]     = useState(false)
  const [modoDemo,  setModoDemo]      = useState(true)
  const [cargando,  setCargando]      = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const unsubRef    = useRef<(() => void) | null>(null)

  useEffect(() => {
    const iniciar = async () => {
      setCargando(true)
      // Try Firebase
      try {
        const { isFirebaseConfigured, initFirebase } = await import('@/lib/firebase')
        if (isFirebaseConfigured()) {
          const fb = initFirebase()
          if (fb) {
            const { collection, query, orderBy, limit, onSnapshot } = await import('firebase/firestore')
            const q = query(
              collection(fb.db, 'balizas', balizaId, 'lecturas'),
              orderBy('timestamp', 'desc'),
              limit(50)
            )
            unsubRef.current = onSnapshot(q, (snap) => {
              const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as SensorReading))
              setLecturas(data)
              setConectado(true)
              setModoDemo(false)
              setCargando(false)
            }, () => iniciarDemo())
            return
          }
        }
      } catch (_) { /* fall through to demo */ }
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

  const exportCSV = () => {
    const header = 'timestamp,baliza,mq2_ppm,mq7_ppm,mq135_ppm\n'
    const rows   = lecturas.map(l => {
      const ts = l.timestamp instanceof Date ? l.timestamp : new Date((l.timestamp as any).seconds * 1000)
      return `${ts.toISOString()},${balizaId},${l.mq2_ppm.toFixed(2)},${l.mq7_ppm.toFixed(2)},${l.mq135_ppm.toFixed(2)}`
    }).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const a    = document.createElement('a')
    a.href     = URL.createObjectURL(blob)
    a.download = `canopea_${balizaId}_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }

  return { lecturas, conectado, modoDemo, cargando, exportCSV }
}
