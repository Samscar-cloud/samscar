export type User = {
  id: string
  email: string
  name?: string
  phone?: string
  role: 'USER' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

export type Service = {
  id: string
  name: string
  description?: string
  price?: number
  category: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

export type Vehicle = {
  id: string
  userId: string
  make: string
  model: string
  year: number
  vin?: string
  createdAt: Date
  updatedAt: Date
}

export type Booking = {
  id: string
  userId: string
  serviceId: string
  vehicleId?: string
  date: Date
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type Review = {
  id: string
  userId: string
  rating: number
  comment?: string
  createdAt: Date
}

export type Special = {
  id: string
  title: string
  description?: string
  discount?: number
  code: string
  expiresAt: Date
  createdAt: Date
}