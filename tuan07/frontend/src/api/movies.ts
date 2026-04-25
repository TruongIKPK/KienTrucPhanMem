import { apiClient } from './client'
import type { Movie, PageResponse } from '@/types'

export const moviesApi = {
  list: (page = 0, size = 20) =>
    apiClient
      .get<PageResponse<Movie>>('/api/movies', { params: { page, size } })
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Movie>(`/api/movies/${id}`).then((r) => r.data),
}
