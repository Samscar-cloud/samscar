'use client'

import { useEffect, useState } from 'react'

type Service = {
  id: string
  name: string
  description?: string
  price?: number
  category: string
  slug: string
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', slug: '' })

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const loadServices = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/services')
    const data = await res.json()
    setServices(data)
    setLoading(false)
  }

  useEffect(() => {
    loadServices()
  }, [])

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', category: '', slug: '' })
    setEditingServiceId(null)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      alert('Le nom et le slug sont requis.')
      return
    }

    const rawPrice = form.price.trim()
    const price = rawPrice === '' ? null : Number(rawPrice)
    if (price !== null && Number.isNaN(price)) {
      alert('Prix invalide')
      return
    }

    setIsSaving(true)
    const method = editingServiceId ? 'PUT' : 'POST'
    const url = editingServiceId ? `/api/admin/services/${editingServiceId}` : '/api/admin/services'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price,
      }),
    })

    if (res.ok) {
      resetForm()
      loadServices()
    } else {
      const body = await res.json().catch(() => null)
      alert(body?.error || 'Erreur lors de la sauvegarde')
    }
    setIsSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return
    const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      alert(body?.error || 'Erreur lors de la suppression')
      return
    }
    loadServices()
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Gestion des services</h2>
      <div className="mb-6 p-6 bg-white rounded-xl shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h3 className="text-lg font-semibold">
            {editingServiceId ? 'Modifier le service' : 'Ajouter un service'}
          </h3>
          {editingServiceId && (
            <button onClick={resetForm} className="btn-secondary">
              Annuler
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Nom"
            className="p-3 border rounded-lg text-gray-900 bg-white placeholder:text-gray-400"
          />
          <input
            value={form.slug}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            placeholder="Slug (unique)"
            className="p-3 border rounded-lg text-gray-900 bg-white placeholder:text-gray-400"
          />
          <input
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            placeholder="Catégorie"
            className="p-3 border rounded-lg text-gray-900 bg-white placeholder:text-gray-400"
          />
          <input
            value={form.price}
            onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
            placeholder="Prix"
            type="number"
            className="p-3 border rounded-lg text-gray-900 bg-white placeholder:text-gray-400"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Description"
            className="p-3 border rounded-lg md:col-span-2 text-gray-900 bg-white placeholder:text-gray-400"
            rows={3}
          />
        </div>
        <button onClick={handleSave} disabled={isSaving} className="btn-primary mt-4">
          {isSaving ? 'Enregistrement...' : editingServiceId ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Liste des services</h3>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="flex flex-col gap-3 border-b pb-4">
                <div>
                  <p className="font-semibold text-gray-900">{service.name}</p>
                  <p className="text-sm text-gray-600">{service.category} — {service.price ? `${service.price} €` : '—'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingServiceId(service.id)
                      setForm({
                        name: service.name,
                        description: service.description ?? '',
                        price: service.price?.toString() ?? '',
                        category: service.category,
                        slug: service.slug,
                      })
                    }}
                    className="btn-secondary flex-1"
                  >
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(service.id)} className="btn-accent flex-1">
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
