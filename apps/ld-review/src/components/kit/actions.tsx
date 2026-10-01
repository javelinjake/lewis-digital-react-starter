import type { ReactNode } from 'react'
import { Button } from '@ld/ui'

type ActionVariant = 'default' | 'hover' | 'pressed' | 'focus' | 'disabled'

const control = 'h-11 min-h-11 rounded-[var(--radius-control)] px-4 text-sm font-medium disabled:opacity-100'

const primaryLook: Record<ActionVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-[var(--action-hover)] active:bg-[var(--action-pressed)] focus-visible:border-[var(--focus-on-action)] focus-visible:ring-[var(--focus-on-action)]',
  hover: 'bg-[var(--action-hover)] text-primary-foreground',
  pressed: 'bg-[var(--action-pressed)] text-primary-foreground',
  focus: 'bg-primary text-primary-foreground ring-2 ring-[var(--focus-on-action)]',
  disabled: 'bg-[var(--surface-disabled)] text-[var(--text-disabled)]',
}

const secondaryLook: Record<ActionVariant, string> = {
  default: 'border border-border bg-card text-foreground hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]',
  hover: 'border border-[var(--border-hover)] bg-[var(--surface-hover)] text-foreground',
  pressed: 'border border-border bg-[var(--surface-hover)] text-foreground',
  focus: 'border border-[var(--selection)] bg-card text-foreground ring-2 ring-[var(--selection)]',
  disabled: 'border border-border bg-[var(--surface-disabled)] text-[var(--text-disabled)]',
}

const destructiveLook: Record<ActionVariant, string> = {
  default: 'border border-[var(--status-error)] bg-[var(--surface-error)] text-[var(--status-error)] hover:border-[var(--action-destructive-hover)] hover:bg-[var(--action-destructive-hover)] hover:text-primary-foreground',
  hover: 'border border-[var(--action-destructive-hover)] bg-[var(--action-destructive-hover)] text-primary-foreground',
  pressed: 'border border-[var(--status-error)] bg-[var(--status-error)] text-primary-foreground',
  focus: 'border border-[var(--selection)] bg-[var(--surface-error)] text-[var(--status-error)] ring-2 ring-[var(--selection)]',
  disabled: 'border border-border bg-[var(--surface-disabled)] text-[var(--text-disabled)]',
}

function ActionButton({
  label,
  look,
  variant = 'default',
  onClick,
  children,
}: {
  label: string
  look: Record<ActionVariant, string>
  variant?: ActionVariant
  onClick?: () => void
  children?: ReactNode
}) {
  return (
    <Button
      type="button"
      disabled={variant === 'disabled'}
      onClick={onClick}
      className={`${control} ${look[variant]}`}
    >
      {children}
      {label}
    </Button>
  )
}

export function PrimaryAction({
  label,
  variant = 'default',
  onClick,
  children,
}: {
  label: string
  variant?: ActionVariant
  onClick?: () => void
  children?: ReactNode
}) {
  return <ActionButton label={label} look={primaryLook} variant={variant} onClick={onClick}>{children}</ActionButton>
}

export function SecondaryAction({
  label,
  variant = 'default',
  onClick,
}: {
  label: string
  variant?: ActionVariant
  onClick?: () => void
}) {
  return <ActionButton label={label} look={secondaryLook} variant={variant} onClick={onClick} />
}

export function DestructiveAction({
  label,
  variant = 'default',
  onClick,
}: {
  label: string
  variant?: ActionVariant
  onClick?: () => void
}) {
  return <ActionButton label={label} look={destructiveLook} variant={variant} onClick={onClick} />
}
