'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import ReviewForm from '@/components/ReviewForm'
import ReminderForm from '@/components/ReminderForm'

type Vehicle = {
  id: string
  make: string
  model: string
  year: number
  vin?: string
}

type Review = {
  id: string
  rating: number
  comment?: string
  createdAt: string
}

type Reminder = {
  id: string
  dueDate: string
  completed: boolean
  description?: string | null
  vehicle: {
    id: string
    make: string
    model: string
    year: number
  }
}

type Booking = {
  id: string
  date: string
  status: string
  notes?: string
  service: { name: string }
  vehicle?: Vehicle | null
  review?: Review | null
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [vehicleForm, setVehicleForm] = useState({ make: '', model: '', year: '', vin: '' })
  const [savingVehicle, setSavingVehicle] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const [vehiclesRes, bookingsRes, remindersRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/bookings'),
        fetch('/api/reminders'),
      ])

      if (vehiclesRes.ok) {
        setVehicles(await vehiclesRes.json())
      }

      if (bookingsRes.ok) {
        setBookings(await bookingsRes.json())
      }

      if (remindersRes.ok) {
        setReminders(await remindersRes.json())
      }
    } catch (error) {
      console.error('Failed to load account data', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      loadData()
    }
  }, [session])

  const handleAddVehicle = async (event: React.FormEvent) => {
    event.preventDefault()
    setSavingVehicle(true)

    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          make: vehicleForm.make,
          model: vehicleForm.model,
          year: Number(vehicleForm.year),
          vin: vehicleForm.vin,
        }),
      })

      if (res.ok) {
        setVehicleForm({ make: '', model: '', year: '', vin: '' })
        await loadData()
      } else {
        const body = await res.json()
        alert(body?.error || 'Échec de l’enregistrement du véhicule')
      }
    } catch (error) {
      console.error('Error adding vehicle', error)
      alert('Échec de l’enregistrement du véhicule')
    } finally {
      setSavingVehicle(false)
    }
  }

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Supprimer ce véhicule ?')) return
    await fetch(`/api/vehicles/${id}`, { method: 'DELETE' })
    loadData()
  }

  const handleCancelBooking = async (id: string) => {
    if (!confirm('Annuler cette réservation ?')) return
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
    loadData()
  }

  const handleCompleteReminder = async (id: string) => {
    await fetch(`/api/reminders/${id}`, { method: 'PATCH' })
    loadData()
  }

  const handleDeleteReminder = async (id: string) => {
    if (!confirm('Supprimer ce rappel ?')) return
    await fetch(`/api/reminders/${id}`, { method: 'DELETE' })
    loadData()
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      PENDING: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
      CONFIRMED: { label: 'Confirmé', className: 'bg-green-100 text-green-800' },
      COMPLETED: { label: 'Terminé', className: 'bg-blue-100 text-blue-800' },
      CANCELLED: { label: 'Annulé', className: 'bg-red-100 text-red-800' },
    }

    const badge = map[status] ?? { label: status, className: 'bg-gray-100 text-gray-700' }

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badge.className}`}>
        {badge.label}
      </span>
    )
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Mon compte</h1>
          <p className="mb-6">Vous devez vous connecter pour accéder à votre espace.</p>
          <Link href="/auth/signin" className="btn-primary">
            Se connecter
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 space-y-8">
        <section className="bg-white rounded-xl shadow p-6">
          <h1 className="text-3xl font-bold mb-4">Mon compte</h1>
          <p className="mb-2">Nom: {session.user?.name}</p>
          <p className="mb-2">Email: {session.user?.email}</p>
          <p className="mb-2">Rôle: {session.user?.role || 'USER'}</p>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Mes véhicules</h2>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <div className="space-y-4">
              {vehicles.length === 0 ? (
                <p className="text-sm text-gray-600">Aucun véhicule enregistrée.</p>
              ) : (
                <div className="space-y-3">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b pb-3">
                      <div>
                        <p className="font-semibold">
                          {vehicle.make} {vehicle.model} ({vehicle.year})
                        </p>
                        {vehicle.vin && <p className="text-sm text-gray-600">VIN: {vehicle.vin}</p>}
                      </div>
                      <button
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        className="btn-accent"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  value={vehicleForm.make}
                  onChange={(e) => setVehicleForm((prev) => ({ ...prev, make: e.target.value }))}
                  placeholder="Marque"
                  className="p-3 border rounded-lg"
                  required
                />
                <input
                  value={vehicleForm.model}
                  onChange={(e) => setVehicleForm((prev) => ({ ...prev, model: e.target.value }))}
                  placeholder="Modèle"
                  className="p-3 border rounded-lg"
                  required
                />
                <input
                  value={vehicleForm.year}
                  onChange={(e) => setVehicleForm((prev) => ({ ...prev, year: e.target.value }))}
                  placeholder="Année"
                  type="number"
                  className="p-3 border rounded-lg"
                  required
                />
                <input
                  value={vehicleForm.vin}
                  onChange={(e) => setVehicleForm((prev) => ({ ...prev, vin: e.target.value }))}
                  placeholder="VIN (optionnel)"
                  className="p-3 border rounded-lg"
                />
                <button
                  type="submit"
                  disabled={savingVehicle}
                  className="btn-primary w-full md:col-span-4"
                >
                  {savingVehicle ? 'Enregistrement...' : 'Ajouter un véhicule'}
                </button>
              </form>
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Mes réservations</h2>
          {loading ? (
            <p>Chargement...</p>
          ) : bookings.length === 0 ? (
            <p className="text-sm text-gray-600">Aucune réservation pour le moment.</p>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="border-b pb-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <p className="font-semibold">{booking.service.name}</p>
                      <p className="text-sm text-gray-600">Date: {new Date(booking.date).toLocaleString()}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        Statut: {getStatusBadge(booking.status)}
                      </p>
                      {booking.vehicle && (
                        <p className="text-sm text-gray-600">
                          Véhicule: {booking.vehicle.make} {booking.vehicle.model} ({booking.vehicle.year})
                        </p>
                      )}
                      {booking.notes && <p className="text-sm text-gray-600">Notes: {booking.notes}</p>}
                    </div>
                    <button
                      className="btn-accent self-start"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Annuler
                    </button>
                  </div>

                  {booking.status === 'COMPLETED' && (
                    <div className="mt-4 pt-4 border-t">
                      {booking.review ? (
                        <div className="space-y-2">
                          <p className="font-semibold">Votre avis:</p>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-lg ${i < booking.review!.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                          {booking.review.comment && <p className="text-sm text-gray-700">{booking.review.comment}</p>}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="font-semibold mb-3">Laisser un avis</p>
                          <ReviewForm
                            bookingId={booking.id}
                            onSuccess={() => loadData()}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Rappels d&apos;entretien</h2>
              <p className="text-sm text-gray-600">Gérez vos rappels pour vos véhicules.</p>
            </div>
          </div>

          {loading ? (
            <p>Chargement...</p>
          ) : vehicles.length === 0 ? (
            <p className="text-sm text-gray-600">Ajoutez un véhicule pour créer des rappels.</p>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="space-y-4">
                {reminders.length === 0 ? (
                  <div className="rounded-xl bg-gray-50 p-6 text-gray-700">Aucun rappel pour le moment.</div>
                ) : (
                  <div className="space-y-4">
                    {reminders.map((reminder) => (
                      <div key={reminder.id} className="rounded-xl border border-gray-200 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-semibold">{reminder.vehicle.make} {reminder.vehicle.model} ({reminder.vehicle.year})</p>
                            <p className="text-sm text-gray-600">Date de rappel: {new Date(reminder.dueDate).toLocaleDateString()}</p>
                            {reminder.description && <p className="text-sm text-gray-600 mt-2">{reminder.description}</p>}
                          </div>
                          <div className="flex flex-col items-start gap-2 text-right sm:items-end">
                            <span className={`text-xs font-semibold uppercase ${reminder.completed ? 'text-green-700' : 'text-yellow-700'}`}>
                              {reminder.completed ? 'Terminé' : 'À faire'}
                            </span>
                            {!reminder.completed && (
                              <button
                                type="button"
                                onClick={() => handleCompleteReminder(reminder.id)}
                                className="text-primary-600 hover:underline"
                              >
                                Marquer comme terminé
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteReminder(reminder.id)}
                              className="text-red-600 hover:underline"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                <h3 className="text-lg font-semibold mb-4">Créer un rappel</h3>
                <ReminderForm vehicles={vehicles} onSuccess={loadData} />
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
