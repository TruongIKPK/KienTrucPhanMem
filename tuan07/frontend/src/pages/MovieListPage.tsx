import { MovieCard } from '@/components/MovieCard'
import { StoryStreamTile } from '@/components/StoryStreamTile'
import { useMovies } from '@/hooks/useMovies'

const ACCENTS = ['mint', 'ultraviolet', 'white', 'yellow', 'pink'] as const

export function MovieListPage() {
  const { data, isLoading, isError, error } = useMovies(0, 50)

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-10 flex flex-col gap-10">
      <StoryStreamTile
        accent="mint"
        kicker="NOW SHOWING / WEEK"
        timestamp="LIVE FEED"
        headline="Tonight is loud, here's what's playing"
        deck="Pick a film, pick your seats. Bookings publish BOOKING_CREATED to RabbitMQ; payment processes asynchronously. Watch your toast for status."
      />

      {isLoading && (
        <p className="kicker text-secondary">Loading feed…</p>
      )}
      {isError && (
        <p className="kicker text-ultraviolet">
          Failed to load movies: {(error as Error).message}
        </p>
      )}

      {data && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((m, i) => (
            <MovieCard
              key={m.id}
              movie={m}
              accent={ACCENTS[i % ACCENTS.length]}
            />
          ))}
        </section>
      )}

      {data && data.items.length === 0 && (
        <p className="kicker text-secondary text-center py-12">
          No movies yet. Use POST /api/movies (admin) to seed.
        </p>
      )}
    </div>
  )
}
