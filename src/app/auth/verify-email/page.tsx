'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Vérification en cours...')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Jeton manquant.')
      return
    }

    async function verify() {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        if (response.ok) {
          setStatus('success')
          setMessage('Votre adresse e-mail est vérifiée. Vous pouvez maintenant vous connecter.')
        } else {
          const body = await response.json()
          setStatus('error')
          setMessage(body?.error || 'Impossible de vérifier l’email.')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Impossible de contacter le serveur.')
      }
    }

    verify()
  }, [token])

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow p-8">
          <h1 className="text-2xl font-bold mb-4">Vérification de l’e-mail</h1>
          <div className={`rounded-lg p-4 ${status === 'success' ? 'bg-green-50 text-green-800' : status === 'error' ? 'bg-red-50 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
            {message}
          </div>
          <p className="mt-6 text-sm text-gray-600">
            <Link href="/auth/signin" className="text-primary-600 hover:underline">
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
