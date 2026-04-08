'use client'

import { useState } from 'react'

type ReminderFormProps = {
  vehicles: { id: string; make: string; model: string; year: number }[]
  onSuccess: () => void
}

export default function ReminderForm({ vehicles, onSuccess }: ReminderFormProps) {
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || '')
  const [dueDate, setDueDate] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage(null)

    if (!vehicleId || !dueDate) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un véhicule et une date.' })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId, dueDate, description }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Rappel créé avec succès.' })
        setDueDate('')
        setDescription('')
        onSuccess()
      } else {
        const body = await response.json()
        setMessage({ type: 'error', text: body?.error || 'Impossible de créer le rappel.' })
      }
    } catch (error) {
      console.error('Reminder submit error', error)
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Véhicule</label>
        <select
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          className="w-full p-3 border rounded-lg"
        >
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date de rappel</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-3 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded-lg"
          rows={3}
          maxLength={200}
          placeholder="Entretien, changement d'huile, contrôle technique..."
        />
        <p className="text-xs text-gray-500 mt-1">{description.length}/200</p>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Enregistrement...' : 'Créer un rappel'}
      </button>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}
    </form>
  )
}
