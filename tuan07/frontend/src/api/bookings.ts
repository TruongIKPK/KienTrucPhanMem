import { apiClient } from './client'
import type { Booking, CreateBookingRequest } from '@/types'

export const bookingsApi = {
  create: (input: CreateBookingRequest) =>
    apiClient.post<Booking>('/api/bookings', input).then((r) => r.data),

  listMine: () => apiClient.get<Booking[]>('/api/bookings').then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Booking>(`/api/bookings/${id}`).then((r) => r.data),
}
