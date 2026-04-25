import { useQuery } from '@tanstack/react-query'
import { moviesApi } from '@/api/movies'

export function useMovies(page = 0, size = 20) {
  return useQuery({
    queryKey: ['movies', page, size],
    queryFn: () => moviesApi.list(page, size),
  })
}

export function useMovie(id?: string) {
  return useQuery({
    queryKey: ['movies', id],
    queryFn: () => moviesApi.getById(id!),
    enabled: !!id,
  })
}
