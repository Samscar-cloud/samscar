'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!password) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer le mot de passe'
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!token) {
      setStatus('error')
      setMessage('Token manquant.')
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      if (response.ok) {
        setStatus('success')
        setMessage('Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter.')
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
          <h1 className="text-2xl font-bold mb-4">Réinitialiser le mot de passe</h1>

          {token ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-3 border rounded-lg ${errors.password ? 'border-red-500' : ''}`}
                  required
                />
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-3 border rounded-lg ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  required
                />
                {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Enregistrement...' : 'Réinitialiser'}
              </button>
            </form>
          ) : (
            <div className="rounded-lg bg-red-50 p-4 text-red-800">
              Jeton de réinitialisation manquant ou invalide.
            </div>
          )}

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
