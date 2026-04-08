'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Props = {
  makes: string[]
  years: number[]
}

export function CarFilters({ makes, years }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [make, setMake] = useState(searchParams.get('make') ?? '')
  const [year, setYear] = useState(searchParams.get('year') ?? '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')
  const [q, setQ] = useState(searchParams.get('q') ?? '')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (make) params.set('make', make)
    if (year) params.set('year', year)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)

    router.push(`/cars?${params.toString()}`)
  }

  const clearFilters = () => {
    setMake('')
    setYear('')
    setMinPrice('')
    setMaxPrice('')
    setQ('')
    router.push('/cars')
  }

  const yearOptions = useMemo(() => years.sort((a, b) => b - a), [years])

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold">Filtrer les véhicules</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Rechercher</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="Marque, modèle, mot clé..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Marque</label>
          <select
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Toutes</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Année</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Toutes</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Prix min (€)</label>
          <input
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            type="number"
            min={0}
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Prix max (€)</label>
          <input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            type="number"
            min={0}
            className="w-full p-3 border rounded-lg"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button type="submit" className="btn-primary">
          Appliquer
        </button>
        <button type="button" className="btn-secondary" onClick={clearFilters}>
          Réinitialiser
        </button>
      </div>
    </form>
  )
}
