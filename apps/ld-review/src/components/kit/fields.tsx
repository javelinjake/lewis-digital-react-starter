import { Input, Label } from '@ld/ui'

type FieldVariant = 'default' | 'hover' | 'focus' | 'open' | 'disabled' | 'error' | 'boundary'

const fieldLook: Record<FieldVariant, string> = {
  default: 'border-border bg-[var(--surface-canvas)] text-foreground',
  hover: 'border-[var(--border-hover)] bg-[var(--surface-canvas)] text-foreground',
  focus: 'border-[var(--selection)] bg-[var(--surface-canvas)] text-foreground ring-2 ring-[var(--selection)]',
  open: 'border-[var(--selection)] bg-[var(--surface-hover)] text-foreground',
  disabled: 'border-border bg-[var(--surface-disabled)] text-[var(--text-disabled)]',
  error: 'border-[var(--status-error)] bg-[var(--surface-canvas)] text-foreground',
  boundary: 'border-[var(--trim)] bg-[var(--trim-surface)] text-foreground',
}

const control = 'h-11 min-h-11 w-full rounded-[var(--radius-control)] px-3 text-base'

export function TextField({
  label,
  value,
  variant = 'default',
  onChange,
}: {
  label: string
  value: string
  variant?: 'default' | 'focus' | 'disabled' | 'error'
  onChange?: (value: string) => void
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return (
    <div className="flex w-full flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">{label}</Label>
      <Input
        id={id}
        value={value}
        disabled={variant === 'disabled'}
        aria-invalid={variant === 'error'}
        onChange={event => onChange?.(event.target.value)}
        className={`${control} md:text-base ${fieldLook[variant]}`}
      />
    </div>
  )
}

export function SelectField({
  label,
  value,
  options,
  variant = 'default',
  onChange,
}: {
  label: string
  value: string
  options: string[]
  variant?: 'default' | 'hover' | 'focus' | 'open' | 'disabled'
  onChange?: (value: string) => void
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return (
    <div className="flex w-full flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">{label}</Label>
      <select
        id={id}
        value={value}
        disabled={variant === 'disabled'}
        onChange={event => onChange?.(event.target.value)}
        className={`${control} border ${fieldLook[variant]}`}
      >
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  )
}

export function TimeField({
  label,
  value,
  variant = 'default',
}: {
  label: string
  value: string
  variant?: 'default' | 'focus' | 'boundary' | 'error' | 'disabled'
}) {
  const id = `time-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  return (
    <div className="flex w-full flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">{label}</Label>
      <Input
        id={id}
        value={value}
        readOnly
        disabled={variant === 'disabled'}
        aria-invalid={variant === 'error'}
        className={`${control} md:text-base ${fieldLook[variant]}`}
      />
    </div>
  )
}
