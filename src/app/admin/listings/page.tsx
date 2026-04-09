'use client'

import { useCallback, useEffect, useState } from 'react'

type Listing = {
  id: string
  make: string
  model: string
  year: number
  price: number
  mileage?: number | null
  status: string
  photos: string[]
  createdAt: string
}

type PaginatedListings = {
  items: Listing[]
  total: number
  page: number
  limit: number
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState('')

  const [form, setForm] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    status: 'AVAILABLE',
  })
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const loadListings = useCallback(
    async (pageNumber = 1, search = '') => {
      setLoading(true)
      const res = await fetch(
        `/api/admin/listings?page=${pageNumber}&limit=${limit}${
          search ? `&q=${encodeURIComponent(search)}` : ''
        }`
      )
      const data: PaginatedListings = await res.json()
      setListings(data.items)
      setTotal(data.total)
      setPage(data.page)
      setLoading(false)
    },
    [limit]
  )

  useEffect(() => {
    loadListings(page, query)
  }, [page, query, loadListings])

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)

    try {
      const method = editing ? 'PATCH' : 'POST'
      const url = editing ? `/api/admin/listings/${selectedListing!.id}` : '/api/admin/listings'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          make: form.make,
          model: form.model,
          year: Number(form.year),
          price: Number(form.price),
          mileage: form.mileage ? Number(form.mileage) : undefined,
          status: form.status,
          photos,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        alert(body?.error || 'Erreur lors de la sauvegarde')
        return
      }

      handleCancelEdit()
      loadListings(page, query)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette annonce ?')) return

    const res = await fetch(`/api/admin/listings/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      alert(body?.error || 'Erreur lors de la suppression')
      return
    }

    loadListings(page, query)
  }

  const handleEdit = (listing: Listing) => {
    setSelectedListing(listing)
    setForm({
      make: listing.make,
      model: listing.model,
      year: listing.year.toString(),
      price: listing.price.toString(),
      mileage: listing.mileage?.toString() || '',
      status: listing.status,
    })
    setPhotos(listing.photos)
    setEditing(true)
  }

  const handleCancelEdit = () => {
    setEditing(false)
    setSelectedListing(null)
    setForm({ make: '', model: '', year: '', price: '', mileage: '', status: 'AVAILABLE' })
    setPhotos([])
  }

  const handleUploadPhoto = async (file: File) => {
    if (photos.length >= 10) {
      alert('Maximum 10 photos allowed')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File too large (max 5MB)')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Only image files allowed')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('photo', file)

    const listingId = selectedListing?.id || 'temp' // For new listings, we'll handle differently

    try {
      const res = await fetch(`/api/admin/listings/${listingId}/photos`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        alert(body?.error || 'Upload failed')
        return
      }

      const data = await res.json()
      setPhotos(data.photos)
    } catch (error) {
      alert('Upload error')
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePhoto = async (url: string) => {
    const listingId = selectedListing?.id
    if (!listingId) return

    try {
      const res = await fetch(`/api/admin/listings/${listingId}/photos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        alert(body?.error || 'Delete failed')
        return
      }

      const data = await res.json()
      setPhotos(data.photos)
    } catch (error) {
      alert('Delete error')
    }
  }

  const totalPages = Math.ceil(total / limit)
  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Catalogue des véhicules</h2>

      <section className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {editing ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
          </h3>
          {editing && (
            <button onClick={handleCancelEdit} className="btn-secondary">
              Annuler
            </button>
          )}
        </div>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            value={form.make}
            onChange={(e) => setForm((prev) => ({ ...prev, make: e.target.value }))}
            placeholder="Marque"
            className="p-3 border rounded-lg text-gray-900 bg-white placeholder:text-gray-400"
            required
          />
          <input
            value={form.model}
            onChange={(e) => setForm((prev) => ({ ...prev, model: e.target.value }))}
            placeholder="Modèle"
            className="p-3 border rounded-lg text-gray-900 bg-white placeholder:text-gray-400"
            required
          />
          <input
            value={form.year}
            onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
            placeholder="Année"
            type="number"
            className="p-3 border rounded-lg text-gray-900 bg-white placeholder:text-gray-400"
            required
          />
          <input
            value={form.price}
            onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
            placeholder="Prix (€)"
            type="number"
            className="p-3 border rounded-lg text-gray-900 bg-white placeholder:text-gray-400"
            required
          />
          <input
            value={form.mileage}
            onChange={(e) => setForm((prev) => ({ ...prev, mileage: e.target.value }))}
            placeholder="Kilométrage"
            type="number"
            className="p-3 border rounded-lg text-gray-900 bg-white placeholder:text-gray-400"
          />
          <select
            value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
            className="p-3 border rounded-lg text-gray-900 bg-white placeholder:text-gray-400"
          >
            <option value="AVAILABLE">Disponible</option>
            <option value="RESERVED">Réservé</option>
            <option value="SOLD">Vendu</option>
          </select>

          <div className="md:col-span-4">
            <label className="block text-sm font-medium mb-2">Photos ({photos.length}/10)</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
              onDrop={(e) => {
                e.preventDefault()
                if (!editing) {
                  alert('Veuillez d\'abord créer l\'annonce, puis modifier pour ajouter des photos')
                  return
                }
                const files = Array.from(e.dataTransfer.files)
                files.forEach(handleUploadPhoto)
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (!editing) {
                    alert('Veuillez d\'abord créer l\'annonce, puis modifier pour ajouter des photos')
                    e.target.value = ''
                    return
                  }
                  const files = Array.from(e.target.files || [])
                  files.forEach(handleUploadPhoto)
                }}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="text-gray-500">
                  {uploading ? 'Téléchargement...' : editing ? 'Cliquez pour sélectionner ou glissez-déposez des images ici' : 'Créez d\'abord l\'annonce pour ajouter des photos'}
                </div>
                <div className="text-sm text-gray-400 mt-1">Max 10 photos, 5MB chacune</div>
              </label>
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {photos.map((url, index) => (
                  <div key={index} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Photo ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(url)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary md:col-span-4" disabled={saving}>
            {saving ? 'Enregistrement...' : editing ? 'Modifier' : 'Ajouter au catalogue'}
          </button>
        </form>
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">
              Total: <span className="font-semibold">{total}</span> annonces
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

        <div className="mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Recherche par marque, modèle, description..."
            className="w-full md:w-1/2 p-3 border rounded-lg text-gray-900 bg-white placeholder:text-gray-400"
          />
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing.id} className="border-b pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="font-semibold">
                      {listing.make} {listing.model} ({listing.year})
                    </p>
                    <p className="text-sm text-gray-600">Prix: {listing.price.toLocaleString()} €</p>
                    <p className="text-sm text-gray-600">Statut: {listing.status}</p>
                    <p className="text-sm text-gray-600">Créé le: {new Date(listing.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-secondary" onClick={() => handleEdit(listing)}>
                      Modifier
                    </button>
                    <button className="btn-accent" onClick={() => handleDelete(listing.id)}>
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
