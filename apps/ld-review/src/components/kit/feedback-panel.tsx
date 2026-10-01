type PanelVariant = 'default' | 'selected' | 'empty' | 'loading' | 'success' | 'error'

const look: Record<PanelVariant, string> = {
  default: 'border-border bg-card',
  selected: 'border-[var(--selection)] bg-[var(--surface-selected)]',
  empty: 'border-border bg-card',
  loading: 'border-border bg-card',
  success: 'border-[var(--status-success)] bg-[var(--surface-success)]',
  error: 'border-[var(--status-error)] bg-[var(--surface-error)]',
}

const copy: Record<PanelVariant, { title: string, body: string }> = {
  default: {
    title: 'Follow paused',
    body: 'Automatic scrolling is paused while you browse. Resume follow to keep the current moment in view.',
  },
  selected: {
    title: 'Viewing moment',
    body: 'Loop this moment or return to the full session.',
  },
  empty: {
    title: 'No moments yet',
    body: 'Mark a technique or coaching point as you watch.',
  },
  loading: {
    title: 'Preparing your video',
    body: 'Your video will be available to review when playback is ready.',
  },
  success: {
    title: 'Moment saved',
    body: 'Your coaching feedback is ready to review and share.',
  },
  error: {
    title: 'Could not save',
    body: 'Your draft is still here. Try again.',
  },
}

export function FeedbackPanel({
  variant = 'default',
  title,
  body,
}: {
  variant?: PanelVariant
  title?: string
  body?: string
}) {
  const content = copy[variant]
  return (
    <div className={`flex flex-col gap-2 rounded-[var(--radius-panel)] border p-4 ${look[variant]} ${variant === 'empty' ? 'p-6' : ''}`}>
      <p className={variant === 'empty' ? 'text-lg font-bold' : 'text-sm font-medium'}>{title ?? content.title}</p>
      <p className="text-base leading-6 text-muted-foreground">{body ?? content.body}</p>
    </div>
  )
}
