export interface User {
  userId: string
  username: string
  email: string
  fullName?: string | null
  roles: string[]
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: User
}

export interface Movie {
  id: string
  title: string
  description?: string | null
  durationMinutes: number
  posterUrl?: string | null
  releaseDate?: string | null
  unitPrice: number
  createdAt: string
  updatedAt: string
}

export interface PageResponse<T> {
  items: T[]
  page: number
  size: number
  total: number
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'FAILED'

export interface Booking {
  id: string
  userId: string
  movieId: string
  showtime: string
  seats: string[]
  unitPrice: number
  amount: number
  status: BookingStatus
  failedReason?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateBookingRequest {
  movieId: string
  showtime: string
  seats: string[]
  unitPrice: number
}

export interface ApiError {
  code: string
  message: string
  timestamp: string
  path: string
  details?: Array<{ field: string; message: string }>
}
