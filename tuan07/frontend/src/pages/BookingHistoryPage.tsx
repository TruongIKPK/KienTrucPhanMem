import { Link } from 'react-router-dom'
import { PillTag } from '@/components/PillTag'
import { StoryStreamTile } from '@/components/StoryStreamTile'
import { useMyBookings } from '@/hooks/useBookings'
import type { Booking, BookingStatus } from '@/types'

export function BookingHistoryPage() {
  const { data, isLoading, isError } = useMyBookings()

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-10 flex flex-col gap-8">
      <StoryStreamTile
        accent="ultraviolet"
        kicker="HISTORY / BOOKINGS"
        timestamp="LATEST FIRST"
        headline="Your bookings"
        deck="Trạng thái cập nhật khi PAYMENT_COMPLETED hoặc BOOKING_FAILED chạy về booking-service."
      />

      {isLoading && <p className="kicker text-secondary">Loading…</p>}
      {isError && (
        <p className="kicker text-ultraviolet">Failed to load bookings.</p>
      )}

      {data && data.length === 0 && (
        <div className="rounded-card border border-purpleRule/40 p-8 text-center bg-slate">
          <p className="kicker text-secondary mb-3">No bookings yet</p>
          <Link to="/movies" className="text-mint hover:text-linkBlue kicker">
            Browse movies →
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {data?.map((b) => (
          <BookingRow key={b.id} booking={b} />
        ))}
      </div>
    </div>
  )
}

function BookingRow({ booking }: { booking: Booking }) {
  return (
    <article className="rounded-card border border-purpleRule/40 bg-slate p-5 flex flex-wrap items-center gap-4 justify-between">
      <div className="flex flex-col gap-1 min-w-0">
        <code className="font-mono text-xs text-secondary truncate">{booking.id}</code>
        <span className="font-sans text-base">
          Movie <code className="text-mint">{booking.movieId}</code> ·
          Showtime{' '}
          <code className="text-mint">
            {new Date(booking.showtime).toLocaleString('vi-VN')}
          </code>
        </span>
        <span className="kicker text-secondary">
          {booking.seats.length} seat(s) — {booking.seats.join(', ')} ·
          Total {new Intl.NumberFormat('vi-VN').format(booking.amount)}đ
        </span>
        {booking.failedReason && (
          <span className="font-mono text-[11px] text-ultraviolet">
            FAIL: {booking.failedReason}
          </span>
        )}
      </div>
      <PillTag tone={tone(booking.status)}>{booking.status}</PillTag>
    </article>
  )
}

function tone(s: BookingStatus): 'mint' | 'slate' | 'ultraviolet' {
  if (s === 'CONFIRMED') return 'mint'
  if (s === 'FAILED') return 'ultraviolet'
  return 'slate'
}
