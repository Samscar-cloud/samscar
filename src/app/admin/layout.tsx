import { ReactNode } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold">Panneau d&apos;administration</h1>
          <nav className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <a
              href="/admin/services"
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50"
            >
              Services
            </a>
            <a
              href="/admin/bookings"
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50"
            >
              Réservations
            </a>
            <a
              href="/admin/users"
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50"
            >
              Clients
            </a>
            <a
              href="/admin/listings"
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50"
            >
              Catalogue
            </a>
            <a
              href="/admin/vehicles"
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50"
            >
              Véhicules
            </a>
          </nav>
        </header>
        {children}
      </div>
    </div>
  )
}
