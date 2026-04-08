'use client'

import { useState } from 'react'

type Props = {
  listingId: string
}

export function TestDriveForm({ listingId }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [preferredAt, setPreferredAt] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/test-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          name,
          email,
          phone,
          preferredAt: preferredAt || undefined,
          notes: notes || undefined,
        }),
      })

      const body = await res.json()
      if (!res.ok) {
        setError(body?.error || 'Une erreur est survenue')
        return
      }

      setSuccess('Votre demande de test-drive a été envoyée. Nous revenons vers vous rapidement.')
      setName('')
      setEmail('')
      setPhone('')
      setPreferredAt('')
      setNotes('')
    } catch (err) {
      console.error('Test drive request failed', err)
      setError('Une erreur est survenue. Réessayez plus tard.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold">Demande de test-drive / visite</h2>
      {success && <p className="text-green-700 bg-green-100 p-3 rounded-lg">{success}</p>}
      {error && <p className="text-red-700 bg-red-100 p-3 rounded-lg">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Téléphone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date préférée</label>
          <input
            value={preferredAt}
            onChange={(e) => setPreferredAt(e.target.value)}
            type="datetime-local"
            className="w-full p-3 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes (optionnel)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-3 border rounded-lg"
          rows={4}
        />
      </div>

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Envoi...' : 'Envoyer la demande'}
      </button>
    </form>
  )
}
