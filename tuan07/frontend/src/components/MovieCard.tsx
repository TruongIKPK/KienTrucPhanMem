import { Link } from 'react-router-dom'
import type { Movie } from '@/types'
import { Button } from './Button'

interface MovieCardProps {
  movie: Movie
  accent: 'mint' | 'ultraviolet' | 'white' | 'yellow' | 'pink'
}

const ACCENT: Record<MovieCardProps['accent'], string> = {
  mint: 'bg-mint text-canvas',
  ultraviolet: 'bg-ultraviolet text-hazardWhite',
  white: 'bg-hazardWhite text-canvas',
  yellow: 'bg-tileYellow text-canvas',
  pink: 'bg-tilePink text-canvas',
}

export function MovieCard({ movie, accent }: MovieCardProps) {
  return (
    <article
      className={[
        'rounded-card overflow-hidden flex flex-col',
        ACCENT[accent],
      ].join(' ')}
    >
      {movie.posterUrl && (
        <div className="aspect-[2/3] overflow-hidden bg-canvas">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover rounded-img"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <span className="kicker text-current/70">
          {movie.durationMinutes} MIN · {formatPrice(movie.unitPrice)}đ / SEAT
        </span>
        <h3 className="font-sans font-bold text-2xl leading-tight">
          {movie.title}
        </h3>
        {movie.description && (
          <p className="text-sm text-current/80 line-clamp-3">
            {movie.description}
          </p>
        )}
        <div className="mt-auto pt-2">
          <Link to={`/book/${movie.id}`}>
            <Button variant="primaryMint" size="md">
              Book seats →
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n)
}
