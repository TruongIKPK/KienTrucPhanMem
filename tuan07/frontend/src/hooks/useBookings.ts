import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { bookingsApi } from '@/api/bookings'
import { extractErrorMessage } from '@/api/client'
import type { CreateBookingRequest } from '@/types'

export function useCreateBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateBookingRequest) => bookingsApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
    onError: (e) => toast.error(extractErrorMessage(e)),
  })
}

export function useMyBookings() {
  return useQuery({
    queryKey: ['bookings', 'mine'],
    queryFn: () => bookingsApi.listMine(),
  })
}

/**
 * Poll booking status mỗi 1.5s tới khi không còn PENDING (max 10 lần ~ 15s).
 */
export function useBookingStatus(id?: string) {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => bookingsApi.getById(id!),
    enabled: !!id,
    refetchInterval: (q) => (q.state.data?.status === 'PENDING' ? 1500 : false),
    refetchIntervalInBackground: true,
  })
}
