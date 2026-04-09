'use client'

import { useState, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { BookingForm } from '@/components/BookingForm'

export default function BookingPage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Réserver un service</h1>
        <Suspense fallback={<div className="text-center py-12 text-gray-500">Chargement...</div>}>
          <BookingForm user={session?.user} />
        </Suspense>
      </div>
    </div>
  )
}