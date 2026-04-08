import Image from 'next/image'
import Link from 'next/link'

type Props = {
  id: string
  make: string
  model: string
  year: number
  price: number
  mileage?: number | null
  color?: string | null
  fuel?: string | null
  transmission?: string | null
  photos?: string[]
  status?: string
}

export function CarCard({ id, make, model, year, price, mileage, color, fuel, transmission, photos, status }: Props) {
  const imageUrl = photos?.[0] || 'https://via.placeholder.com/640x360?text=No+Photo'

  return (
    <Link
      href={`/cars/${id}`}
      className="block bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition-shadow"
    >
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={`${make} ${model}`}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">
              {make} {model}
            </h3>
            <p className="text-sm text-gray-600">
              {year} · {mileage ? `${mileage.toLocaleString()} km` : 'Kilométrage inconnu'}
            </p>
          </div>
          <span className="text-xl font-bold text-primary-700">{price.toLocaleString()} €</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {mileage !== null && mileage !== undefined && (
            <span className="inline-flex flex-col text-xs bg-gray-50 border border-gray-100 rounded p-1.5 min-w-[70px] text-center">
              <span className="text-gray-400 mb-0.5">Kilométrage</span>
              <span className="font-semibold text-gray-700">{mileage.toLocaleString()} km</span>
            </span>
          )}
          {fuel && (
            <span className="inline-flex flex-col text-xs bg-gray-50 border border-gray-100 rounded p-1.5 min-w-[70px] text-center">
              <span className="text-gray-400 mb-0.5">Carburant</span>
              <span className="font-semibold text-gray-700">{fuel}</span>
            </span>
          )}
          {transmission && (
            <span className="inline-flex flex-col text-xs bg-gray-50 border border-gray-100 rounded p-1.5 min-w-[70px] text-center">
              <span className="text-gray-400 mb-0.5">Boîte</span>
              <span className="font-semibold text-gray-700">{transmission}</span>
            </span>
          )}
        </div>
        
        {color && <p className="mt-3 text-sm text-gray-600 flex items-center gap-1">Couleur: <span className="font-medium text-gray-800">{color}</span></p>}
        {status && (
          <span className="mt-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            {status}
          </span>
        )}
      </div>
    </Link>
  )
}
