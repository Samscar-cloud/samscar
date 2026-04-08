'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { locales } from '@/lib/i18n'

export function LocaleSwitcher() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get('lng') || 'fr'

  return (
    <div className="flex gap-1">
      {Object.entries(locales).map(([locale, label]) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('lng', locale)
        return (
          <Link
            key={locale}
            href={`${pathname}?${params.toString()}`}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-all duration-200 ${
              locale === current
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
