import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { PillTag } from '@/components/PillTag'
import { SeatPicker } from '@/components/SeatPicker'
import { StoryStreamTile } from '@/components/StoryStreamTile'
import { useMovie } from '@/hooks/useMovies'
import { useBookingStatus, useCreateBooking } from '@/hooks/useBookings'

function defaultShowtime(): string {
  const d = new Date()
  d.setHours(20, 0, 0, 0)
  if (d.getTime() < Date.now()) {
    d.setDate(d.getDate() + 1)
  }
  return d.toISOString().slice(0, 16)
}

export function BookingPage() {
  const { id: movieId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const movie = useMovie(movieId)

  const [showtime, setShowtime] = useState<string>(defaultShowtime())
  const [selected, setSelected] = useState<string[]>([])
  const [bookingId, setBookingId] = useState<string | null>(null)

  const createBooking = useCreateBooking()
  const status = useBookingStatus(bookingId ?? undefined)

  const totalPrice = useMemo(
    () => (movie.data ? movie.data.unitPrice * selected.length : 0),
    [movie.data, selected.length],
  )

  useEffect(() => {
    if (!status.data || status.data.status === 'PENDING') return
    if (status.data.status === 'CONFIRMED') {
      toast.success(`Booking #${status.data.id} CONFIRMED ✔`)
    } else if (status.data.status === 'FAILED') {
      toast.error(
        `Booking #${status.data.id} FAILED — ${status.data.failedReason ?? 'unknown'}`,
      )
    }
  }, [status.data])

  function toggleSeat(seat: string) {
    setSelected((curr) =>
      curr.includes(seat) ? curr.filter((s) => s !== seat) : [...curr, seat],
    )
  }

  function submit() {
    if (!movie.data || selected.length === 0) {
      toast.warning('Pick at least 1 seat')
      return
    }
    createBooking.mutate(
      {
        movieId: movie.data.id,
        showtime: new Date(showtime).toISOString(),
        seats: selected,
        unitPrice: movie.data.unitPrice,
      },
      {
        onSuccess: (b) => {
          setBookingId(b.id)
          toast.success(`Booking ${b.id} created — waiting payment…`)
        },
      },
    )
  }

  if (movie.isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <p className="kicker text-secondary">Loading movie…</p>
      </div>
    )
  }
  if (movie.isError || !movie.data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <p className="kicker text-ultraviolet">Movie not found.</p>
        <Button variant="ghost" size="sm" onClick={() => navigate('/movies')}>
          ← Back to feed
        </Button>
      </div>
    )
  }

  const m = movie.data
  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-10 flex flex-col gap-8">
      <StoryStreamTile
        accent="white"
        kicker="BOOK / SEATS"
        timestamp={new Date().toLocaleDateString('en-GB').toUpperCase()}
        headline={m.title}
        deck={`${m.durationMinutes} min · unit ${formatPrice(m.unitPrice)}đ. Chọn ghế bên dưới và submit. Booking sẽ ở trạng thái PENDING tới khi payment-service xử lý xong.`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6">
        <section className="rounded-card border border-purpleRule/40 p-6 bg-canvas">
          <SeatPicker
            selected={selected}
            onToggle={toggleSeat}
            takenSeats={[]}
          />
        </section>

        <aside className="rounded-card border border-purpleRule/40 p-6 bg-slate flex flex-col gap-4">
          <h3 className="kicker text-mint">ORDER SUMMARY</h3>
          <Input
            label="SHOWTIME"
            type="datetime-local"
            value={showtime}
            onChange={(e) => setShowtime(e.target.value)}
          />
          <SummaryRow label="Movie" value={m.title} />
          <SummaryRow label="Seats" value={selected.length === 0 ? '—' : selected.join(', ')} />
          <SummaryRow label="Unit" value={`${formatPrice(m.unitPrice)}đ`} />
          <SummaryRow label="Subtotal" value={`${formatPrice(totalPrice)}đ`} bold />

          <Button
            onClick={submit}
            variant="primaryMint"
            size="lg"
            disabled={createBooking.isPending || !!bookingId}
          >
            {createBooking.isPending ? 'Submitting…' : 'Submit booking →'}
          </Button>

          {bookingId && status.data && (
            <div className="border-t border-hazardWhite/20 pt-4 flex flex-col gap-2">
              <span className="kicker text-secondary">CURRENT BOOKING</span>
              <code className="font-mono text-xs break-all">{status.data.id}</code>
              <PillTag tone={statusTone(status.data.status)}>
                {status.data.status}
              </PillTag>
              {status.data.status !== 'PENDING' && (
                <Button
                  variant="outlinedMint"
                  size="sm"
                  onClick={() => navigate('/bookings')}
                >
                  View history →
                </Button>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="kicker text-current/70">{label}</span>
      <span className={['font-sans', bold && 'font-bold text-mint'].filter(Boolean).join(' ')}>
        {value}
      </span>
    </div>
  )
}

function statusTone(s: 'PENDING' | 'CONFIRMED' | 'FAILED'): 'slate' | 'mint' | 'ultraviolet' {
  if (s === 'CONFIRMED') return 'mint'
  if (s === 'FAILED') return 'ultraviolet'
  return 'slate'
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n)
}
