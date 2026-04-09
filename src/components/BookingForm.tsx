'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'

const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Sélectionnez un service'),
  vehicleId: z.string().optional(),
  date: z.string().min(1, 'Sélectionnez une date'),
  time: z.string().min(1, 'Sélectionnez une heure'),
  notes: z.string().optional(),
  name: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Téléphone requis'),
})

type BookingFormData = z.infer<typeof bookingSchema>

type ServiceItem = {
  id: string
  name: string
  category: string
  price: number | null
}

interface BookingFormProps {
  user?: any
}

// Framer motion variants
const pageVariant = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export function BookingForm({ user }: BookingFormProps) {
  const [step, setStep] = useState(1)
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [csrfToken, setCsrfToken] = useState('')
  const [services, setServices] = useState<ServiceItem[]>([])
  const [vehicles, setVehicles] = useState<{ id: string; make: string; model: string; year: number }[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [loadingVehicles, setLoadingVehicles] = useState(true)
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null)
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<{ discountType: 'PERCENTAGE' | 'FIXED', discountValue: number, specialId: string } | null>(null)
  const [promoError, setPromoError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [confirmedDate, setConfirmedDate] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      vehicleId: '',
    },
  })

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch('/api/services')
        const data = await res.json()
        setServices(data)

        if (data && data.length > 0) {
          setSelectedService(data[0])
          setValue('serviceId', data[0].id)
        }
      } catch (error) {
        console.error('Failed to load services', error)
      } finally {
        setLoadingServices(false)
      }
    }

    async function loadVehicles() {
      if (!user?.id) {
        setLoadingVehicles(false)
        return
      }

      try {
        const res = await fetch('/api/vehicles')
        if (res.ok) {
          const data = await res.json()
          setVehicles(data)
          if (data && data.length > 0) {
            setValue('vehicleId', data[0].id)
          }
        }
      } catch (error) {
        console.error('Failed to load vehicles', error)
      } finally {
        setLoadingVehicles(false)
      }
    }

    loadServices()
    loadVehicles()
  }, [setValue, user?.id])

  useEffect(() => {
    const serviceIdFromUrl = searchParams.get('serviceId')
    if (!serviceIdFromUrl || services.length === 0) return

    const match = services.find((s) => s.id === serviceIdFromUrl)
    if (match) {
      setValue('serviceId', match.id)
      setStep(2)
    }
  }, [searchParams, services, setValue])

  useEffect(() => {
    async function loadCsrfToken() {
      try {
        const res = await fetch('/api/csrf')
        const json = await res.json()
        setCsrfToken(json?.csrfToken ?? '')
      } catch (error) {
        console.error('Failed to load CSRF token', error)
      }
    }

    loadCsrfToken()
  }, [])

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({
          ...data,
          vehicleId: data.vehicleId || undefined,
          date: `${data.date}T${data.time}`,
          specialId: appliedPromo?.specialId,
        }),
      })

      if (response.ok) {
        setConfirmedDate(`${data.date} à ${data.time}`)
        setBookingSuccess(true)
      } else {
        const result = await response.json()
        alert(result?.error || 'Erreur lors de la création de la réservation')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Erreur')
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

  if (bookingSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto glass-card p-8 md:p-12 rounded-2xl shadow-2xl bg-carbon-300 text-center"
      >
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40">
          <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-white mb-3">Réservation confirmée !</h2>
        <p className="text-gray-300 text-lg mb-2">
          Merci — nous vous attendons le <span className="text-primary-400 font-semibold">{confirmedDate}</span>.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Un email de confirmation vous a été envoyé. En cas de question, appelez-nous directement.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/" className="btn-secondary">
            Retour à l&apos;accueil
          </a>
          <a href="/account" className="btn-primary">
            Voir mes réservations
          </a>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto glass-card p-4 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden bg-carbon-300">
      
      {/* Progress Bar */}
      <div className="flex gap-2 mb-8 mt-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-300 ${step >= s ? 'bg-primary-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-carbon-100/50'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" variants={pageVariant} initial="initial" animate="animate" exit="exit" className="min-h-[300px] flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">Sélection du service</h2>
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-gray-300 uppercase tracking-widest">Type de réparation</label>
                <div className="relative">
                  <select 
                    {...register('serviceId')} 
                    onChange={(e) => {
                      register('serviceId').onChange(e)
                      const service = services.find(s => s.id === e.target.value)
                      setSelectedService(service || null)
                    }}
                    className="w-full p-4 bg-carbon-200 border border-carbon-100 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors cursor-pointer" 
                    disabled={loadingServices}
                  >
                    {loadingServices && <option>Chargement de nos services premium...</option>}
                    {!loadingServices && (
                      <>
                        <option value="">-- Choisir un service --</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name} / {service.category}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
                {errors.serviceId && <p className="text-secondary-500 text-sm mt-2">{errors.serviceId.message}</p>}
              </div>
            </div>
            <button type="button" onClick={() => setStep(2)} className="btn-primary w-full" disabled={loadingServices}>
              Confirmer le service
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" variants={pageVariant} initial="initial" animate="animate" exit="exit" className="min-h-[300px] flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">Disponibilités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-300 uppercase tracking-widest">Date prévue</label>
                  <input
                    type="date"
                    {...register('date')}
                    className="w-full p-4 bg-carbon-200 border border-carbon-100 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.date && <p className="text-secondary-500 text-sm mt-2">{errors.date.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-300 uppercase tracking-widest">Créneau horaire</label>
                  <select {...register('time')} className="w-full p-4 bg-carbon-200 border border-carbon-100 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors">
                    <option value="">Choisir une heure</option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {errors.time && <p className="text-secondary-500 text-sm mt-2">{errors.time.message}</p>}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-auto">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
                Retour
              </button>
              <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1">
                Valider
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" variants={pageVariant} initial="initial" animate="animate" exit="exit">
            <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">Vos Coordonnées</h2>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-2 text-gray-400 uppercase tracking-widest">Nom Complet</label>
                  <input {...register('name')} className="w-full p-3 bg-carbon-200 border border-carbon-100 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Jean Dupont"/>
                  {errors.name && <p className="text-secondary-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2 text-gray-400 uppercase tracking-widest">Téléphone</label>
                  <input {...register('phone')} className="w-full p-3 bg-carbon-200 border border-carbon-100 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="+33 6 12 34 56 78"/>
                  {errors.phone && <p className="text-secondary-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-gray-400 uppercase tracking-widest">Email</label>
                <input {...register('email')} type="email" className="w-full p-3 bg-carbon-200 border border-carbon-100 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none" placeholder="contact@exemple.com"/>
                {errors.email && <p className="text-secondary-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {user?.id && (
                <div>
                  <label className="block text-xs font-semibold mb-2 text-gray-400 uppercase tracking-widest">Véhicule concerné (optionnel)</label>
                  {loadingVehicles ? (
                    <p className="text-sm text-gray-400">Analyse de votre garage...</p>
                  ) : vehicles.length > 0 ? (
                    <select {...register('vehicleId')} className="w-full p-3 bg-carbon-200 border border-carbon-100 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none">
                      <option value="">Sélectionnez un véhicule dans votre garage</option>
                      {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.make} {vehicle.model} ({vehicle.year})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-400 bg-carbon-200 p-3 rounded-xl border border-carbon-100">
                      Ajoutez un véhicule via <a href="/account" className="text-primary-400 hover:text-primary-300 underline">votre espace The Garage</a> pour gagner du temps.
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-2 text-gray-400 uppercase tracking-widest">Notes complémentaires (optionnel)</label>
                <textarea {...register('notes')} className="w-full p-3 bg-carbon-200 border border-carbon-100 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none" rows={3} placeholder="Symptômes, bruits suspects, préférences..." />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-gray-400 uppercase tracking-widest">Code Promo (optionnel)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="flex-1 p-3 bg-carbon-200 border border-carbon-100 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="CODEPROMO"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!promoCode.trim()) return
                      try {
                        const res = await fetch('/api/validate-promo', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ code: promoCode.trim() }),
                        })
                        const data = await res.json()
                        if (res.ok) {
                          setAppliedPromo(data)
                          setPromoError('')
                        } else {
                          setPromoError(data.error || 'Code invalide')
                          setAppliedPromo(null)
                        }
                      } catch (error) {
                        setPromoError('Erreur de validation')
                        setAppliedPromo(null)
                      }
                    }}
                    className="btn-secondary px-4"
                  >
                    Appliquer
                  </button>
                </div>
                {promoError && <p className="text-secondary-500 text-xs mt-1">{promoError}</p>}
                {appliedPromo && selectedService?.price && (
                  <div className="mt-2 p-3 bg-green-900/20 border border-green-500/30 rounded-xl">
                    <p className="text-green-400 text-sm">
                      Code appliqué: {appliedPromo.discountType === 'PERCENTAGE' ? `${appliedPromo.discountValue}% de réduction` : `${appliedPromo.discountValue}€ de réduction`}
                    </p>
                    <p className="text-white text-sm mt-1">
                      Prix original: {selectedService.price}€
                      {appliedPromo.discountType === 'PERCENTAGE' ?
                        ` → ${(selectedService.price * (1 - appliedPromo.discountValue / 100)).toFixed(2)}€` :
                        ` → ${(selectedService.price - appliedPromo.discountValue).toFixed(2)}€`
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1">
                Retour
              </button>
              <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                {isSubmitting ? 'Finalisation...' : 'Confirmer le RDV'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
