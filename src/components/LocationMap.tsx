'use client'

import { useEffect, useRef } from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'

const center = { lat: 50.2806, lng: 5.4561 } // Rue de Barvaux 25A, 6990 Hotton

function render(status: Status) {
  return <p className="text-sm text-gray-500">Map loading: {status}</p>
}

function MapContent() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const map = new window.google.maps.Map(ref.current, {
      center,
      zoom: 13,
      disableDefaultUI: true,
    })

    new window.google.maps.Marker({
      position: center,
      map,
      title: 'Notre atelier',
    })
  }, [])

  return <div ref={ref} className="h-80 w-full rounded-xl border border-gray-200" />
}

export function LocationMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <section className="rounded-2xl overflow-hidden my-8 border border-white/10">
        <div className="relative h-64 bg-carbon-200 flex flex-col items-center justify-center gap-4">
          <div className="text-center px-4">
            <p className="text-white font-semibold text-lg mb-1">Sam&apos;s Cars — Hotton, Belgique</p>
            <p className="text-gray-400 text-sm">Rue de Barvaux 25A, 6990 Hotton</p>
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm"
          >
            🧭 Voir sur Google Maps
          </a>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 my-8">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wider text-blue-600">Où nous trouver</p>
        <h2 className="text-2xl font-semibold">Visitez notre atelier</h2>
        <p className="text-gray-600 mt-1">Itinéraire direct et point de rendez-vous en temps réel.</p>
      </div>
      <Wrapper apiKey={apiKey} render={render}>
        <MapContent />
      </Wrapper>
      <div className="mt-4">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-5 rounded-lg transition-colors text-sm"
        >
          🧭 Itinéraire
        </a>
      </div>
    </section>
  )
}
