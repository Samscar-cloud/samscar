'use client'

import { useEffect, useState } from 'react'

interface Review {
  id: string
  rating: number
  comment?: string
  user: {
    id: string
    name?: string
  }
  createdAt: string
}

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [currentReview, setCurrentReview] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews')
        if (response.ok) {
          const data = await response.json()
          // Filter reviews with at least a rating
          const validReviews = data.filter((r: Review) => r.rating)
          setReviews(validReviews)
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  // Default fallback reviews if none exist
  const displayReviews =
    reviews.length > 0
      ? reviews
      : [
          { id: '1', rating: 5, comment: 'Service excellent, très professionnel.', user: { id: '1', name: 'Jean Dupont' }, createdAt: new Date().toISOString() },
          { id: '2', rating: 5, comment: 'Rapide et efficace, je recommande.', user: { id: '2', name: 'Marie Martin' }, createdAt: new Date().toISOString() },
          { id: '3', rating: 4, comment: 'Bon travail, prix raisonnable.', user: { id: '3', name: 'Pierre Durand' }, createdAt: new Date().toISOString() },
        ]

  if (displayReviews.length === 0 && !loading) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Avis Clients</h2>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-2xl ${
                  i < (displayReviews[currentReview]?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-lg mb-4">
            &ldquo;{displayReviews[currentReview]?.comment || 'Un service de qualité.'}&rdquo;
          </p>
          <p className="font-semibold">- {displayReviews[currentReview]?.user?.name || 'Client'}</p>
        </div>
        <div className="flex justify-center mt-8">
          {displayReviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReview(index)}
              className={`w-3 h-3 rounded-full mx-1 ${
                index === currentReview ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}