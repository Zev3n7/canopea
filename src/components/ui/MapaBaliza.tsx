// src/components/ui/MapaBaliza.tsx
// Must be imported with dynamic({ ssr: false })
'use client'
import { useEffect, useRef } from 'react'

interface MapaBalizaProps {
  lat:     number
  lng:     number
  onMove:  (lat: number, lng: number) => void
}

export default function MapaBaliza({ lat, lng, onMove }: MapaBalizaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<any>(null)
  const markerRef    = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return
    if (mapRef.current) return // already initialized

    // Dynamic import of leaflet (client-only)
    import('leaflet').then(L => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(containerRef.current!, {
        center:    [lat, lng],
        zoom:      14,
        zoomControl: true,
        attributionControl: false,
      })

      // Dark-style tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(map)

      // Custom green icon
      const greenIcon = L.divIcon({
        className: '',
        html: `
          <div style="
            width:36px;height:36px;border-radius:50% 50% 50% 0;
            background:linear-gradient(135deg,#84BD01,#0DD2EA);
            transform:rotate(-45deg);
            border:3px solid rgba(132,189,1,0.4);
            box-shadow:0 0 20px rgba(132,189,1,0.5);
            cursor:grab;
          ">
            <div style="
              width:12px;height:12px;border-radius:50%;background:#0D1710;
              position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
            "></div>
          </div>`,
        iconSize:   [36, 36],
        iconAnchor: [18, 36],
      })

      const marker = L.marker([lat, lng], { icon: greenIcon, draggable: true }).addTo(map)
      marker.on('dragend', () => {
        const pos = marker.getLatLng()
        onMove(pos.lat, pos.lng)
      })

      // Attribution
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('© OpenStreetMap · © CARTO')
        .addTo(map)

      mapRef.current    = map
      markerRef.current = marker
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current    = null
        markerRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update marker when coords change externally
  useEffect(() => {
    if (!markerRef.current || !mapRef.current) return
    markerRef.current.setLatLng([lat, lng])
    mapRef.current.panTo([lat, lng])
  }, [lat, lng])

  return <div ref={containerRef} className="w-full h-full" />
}
