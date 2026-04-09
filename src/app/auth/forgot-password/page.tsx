'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStatus('success')
        setMessage('Si cet email existe, un lien de réinitialisation a été envoyé.')
      } else {
        const body = await response.json()
        setStatus('error')
        setMessage(body?.error || 'Une erreur est survenue.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Impossible de contacter le serveur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow p-8">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Mot de passe oublié</h1>
          <p className="text-sm text-gray-600 mb-6">
            Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
            </button>
          </form>

          {status !== 'idle' && (
            <div className={`mt-6 rounded-lg p-4 ${status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message}
            </div>
          )}

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
