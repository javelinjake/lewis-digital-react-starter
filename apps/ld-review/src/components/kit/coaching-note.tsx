type NoteVariant = 'default' | 'focus' | 'error' | 'disabled'

const look: Record<NoteVariant, string> = {
  default: 'border-border bg-card text-foreground',
  focus: 'border-[var(--selection)] bg-[var(--surface-canvas)] text-foreground ring-2 ring-[var(--selection)]',
  error: 'border-[var(--status-error)] bg-[var(--surface-canvas)] text-foreground',
  disabled: 'border-border bg-[var(--surface-disabled)] text-[var(--text-disabled)]',
}

export function CoachingNote({
  label,
  body,
  variant = 'default',
}: {
  label: string
  body: string
  variant?: NoteVariant
}) {
  return (
    <div className={`flex flex-col gap-2 rounded-[var(--radius-control)] border p-4 ${look[variant]}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-base leading-6 text-muted-foreground">{body}</p>
    </div>
  )
}
