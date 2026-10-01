import type { MomentType } from '@/types/session'
import { CircleCheck, Crosshair, MessageSquare, Timer } from 'lucide-react'

type CardVariant = 'default' | 'hover' | 'focus' | 'selected' | 'active'

const look: Record<CardVariant, string> = {
  default: 'border-border bg-card',
  hover: 'border-[var(--border-hover)] bg-[var(--surface-hover)]',
  focus: 'border-[var(--selection)] bg-card ring-2 ring-[var(--selection)]',
  selected: 'border-[var(--selection)] bg-[var(--surface-selected)]',
  active: 'border-[var(--selection)] bg-[var(--surface-selected)]',
}

const typeIcon = {
  positive: CircleCheck,
  technique: Crosshair,
  timing: Timer,
  note: MessageSquare,
} satisfies Record<MomentType, typeof CircleCheck>

export function MomentCard({
  title,
  meta,
  note,
  type,
  variant = 'default',
  playing = false,
  expanded = false,
  onSelect,
}: {
  title: string
  meta: string
  note: string
  type: MomentType
  variant?: CardVariant
  playing?: boolean
  expanded?: boolean
  onSelect?: () => void
}) {
  const Icon = typeIcon[type]

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex w-full gap-3 rounded-[var(--radius-panel)] border p-3 text-left ${look[variant]}`}
    >
      {playing
        ? (
            <span className="pointer-events-none absolute top-0 right-3 z-10 -translate-y-1/2 rounded-full bg-[var(--selection)] px-1.5 py-0.5 text-[10px] leading-none text-white/75">
              Playing
            </span>
          )
        : null}
      <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-[var(--radius-control)] bg-[var(--surface-canvas)]">
        <span className="absolute inset-0 bg-[linear-gradient(160deg,#1c3a2a,#0e1e2c_70%)]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Icon className="size-4 text-primary" aria-hidden="true" />
          {title}
        </span>
        <span className="mt-1 block text-xs text-muted-foreground">{meta}</span>
        {expanded ? <span className="mt-2 block text-sm leading-6 text-muted-foreground">{note}</span> : null}
      </span>
    </button>
  )
}
