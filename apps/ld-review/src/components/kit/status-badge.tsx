type BadgeVariant = 'default' | 'selected' | 'success' | 'error' | 'processing'

const look: Record<BadgeVariant, string> = {
  default: 'border-border bg-card text-muted-foreground',
  selected: 'border-[var(--selection)] bg-[var(--surface-selected)] text-[var(--selection-text)]',
  success: 'border-[var(--status-success)] bg-[var(--surface-success)] text-[var(--status-success)]',
  error: 'border-[var(--status-error)] bg-[var(--surface-error)] text-[var(--status-error)]',
  processing: 'border-border bg-[var(--surface-hover)] text-muted-foreground',
}

export function StatusBadge({
  label,
  variant = 'default',
}: {
  label: string
  variant?: BadgeVariant
}) {
  return (
    <span className={`inline-flex items-center rounded-[var(--radius-pill)] border px-3 py-2 text-xs ${look[variant]}`}>
      {label}
    </span>
  )
}
