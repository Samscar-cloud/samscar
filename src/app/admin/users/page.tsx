'use client'

import { useCallback, useEffect, useState } from 'react'

type User = {
  id: string
  email: string
  name?: string
  role: string
  createdAt: string
}

type PaginatedUsers = {
  items: User[]
  total: number
  page: number
  limit: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState('')

  const loadUsers = useCallback(async (pageNumber = 1, search = '') => {
    setLoading(true)
    const res = await fetch(
      `/api/admin/users?page=${pageNumber}&limit=${limit}${search ? `&q=${encodeURIComponent(search)}` : ''}`
    )
    const data: PaginatedUsers = await res.json()
    setUsers(data.items)
    setTotal(data.total)
    setPage(data.page)
    setLoading(false)
  }, [limit])

  useEffect(() => {
    loadUsers(page, query)
  }, [page, query, loadUsers])

  const totalPages = Math.ceil(total / limit)
  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gestion des clients</h2>

      <div className="mb-6 p-6 bg-white rounded-xl shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">
              Total: <span className="font-semibold">{total}</span> clients
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
            placeholder="Rechercher par email ou nom"
            className="w-full md:w-1/2 p-3 border rounded-lg"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border-b pb-4">
                <p className="font-semibold">{user.name || user.email}</p>
                <p className="text-sm text-gray-600">Role: {user.role}</p>
                <p className="text-sm text-gray-600">Créé le: {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
