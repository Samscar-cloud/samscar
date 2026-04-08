'use client'

import { useCallback, useEffect, useState } from 'react'

type Vehicle = {
  id: string
  make: string
  model: string
  year: number
  vin?: string
  user: { id: string; email: string; name?: string }
  createdAt: string
}

type PaginatedVehicles = {
  items: Vehicle[]
  total: number
  page: number
  limit: number
}

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState('')

  const loadVehicles = useCallback(async (pageNumber = 1, search = '') => {
    setLoading(true)
    const res = await fetch(
      `/api/admin/vehicles?page=${pageNumber}&limit=${limit}${search ? `&q=${encodeURIComponent(search)}` : ''}`
    )
    const data: PaginatedVehicles = await res.json()
    setVehicles(data.items)
    setTotal(data.total)
    setPage(data.page)
    setLoading(false)
  }, [limit])

  useEffect(() => {
    loadVehicles(page, query)
  }, [page, query, loadVehicles])

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce véhicule ?')) return

    const res = await fetch(`/api/admin/vehicles/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      alert(body?.error || 'Erreur lors de la suppression')
      return
    }

    loadVehicles(page, query)
  }

  const totalPages = Math.ceil(total / limit)
  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gestion des véhicules</h2>

      <div className="mb-6 p-6 bg-white rounded-xl shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">
              Total: <span className="font-semibold">{total}</span> véhicules
            </p>
            <p className="text-sm text-gray-600">
              Page {page} sur {totalPages || 1}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="btn-secondary"
              disabled={!canPrev}
              onClick={() => canPrev && setPage(page - 1)}
            >
              Précédent
            </button>
            <button
              className="btn-secondary"
              disabled={!canNext}
              onClick={() => canNext && setPage(page + 1)}
            >
              Suivant
            </button>
          </div>
        </div>

        <div className="mt-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Recherche par email, nom, VIN, marque..."
            className="w-full md:w-1/2 p-3 border rounded-lg"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="border-b pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="font-semibold">
                      {vehicle.make} {vehicle.model} ({vehicle.year})
                    </p>
                    {vehicle.vin && <p className="text-sm text-gray-600">VIN: {vehicle.vin}</p>}
                    <p className="text-sm text-gray-600">
                      Client: {vehicle.user.name || vehicle.user.email}
                    </p>
                  </div>
                  <button className="btn-accent" onClick={() => handleDelete(vehicle.id)}>
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
