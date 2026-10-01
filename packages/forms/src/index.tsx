import type { ReactNode } from 'react'
import type { Control, DefaultValues, FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'
import type { GenericSchema } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { Input, Label, Textarea } from '@ld/ui'
import { useEffect, useId, useSyncExternalStore } from 'react'
import { Controller, useForm } from 'react-hook-form'

const dirtyForms = new Set<string>()
const dirtyListeners = new Set<() => void>()
let dirtySnapshot = false

function publishDirty(id: string, dirty: boolean) {
  if (dirty)
    dirtyForms.add(id)
  else
    dirtyForms.delete(id)

  dirtySnapshot = dirtyForms.size > 0
  dirtyListeners.forEach(listener => listener())
}

export function hasDirtyForm() {
  return dirtySnapshot
}

function subscribeFormDirty(listener: () => void) {
  dirtyListeners.add(listener)
  return () => dirtyListeners.delete(listener)
}

export function useFormDirty() {
  return useSyncExternalStore(subscribeFormDirty, hasDirtyForm, () => false)
}

export function LdForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
}: {
  schema: GenericSchema
  defaultValues: DefaultValues<T>
  onSubmit: (values: T) => Promise<void> | void
  children: (form: UseFormReturn<T>) => ReactNode
}) {
  const form = useForm<T>({
    defaultValues,
    resolver: valibotResolver(schema as never),
  })
  const id = useId()
  const dirty = form.formState.isDirty

  useEffect(() => {
    publishDirty(id, dirty)
    return () => publishDirty(id, false)
  }, [dirty, id])

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values)
        form.reset(values)
      })}
    >
      {children(form)}
    </form>
  )
}

function FieldMessage({ message }: { message?: string }) {
  if (!message)
    return null

  return <p className="text-sm text-destructive">{message}</p>
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
}: {
  control: Control<T>
  name: FieldPath<T>
  label: string
  type?: 'text' | 'email' | 'password'
}) {
  const id = useId()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={id}>{label}</Label>
          <Input
            id={id}
            type={type}
            aria-invalid={fieldState.invalid || undefined}
            {...field}
          />
          <FieldMessage message={fieldState.error?.message} />
        </div>
      )}
    />
  )
}

export function TextAreaField<T extends FieldValues>({
  control,
  name,
  label,
}: {
  control: Control<T>
  name: FieldPath<T>
  label: string
}) {
  const id = useId()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={id}>{label}</Label>
          <Textarea
            id={id}
            aria-invalid={fieldState.invalid || undefined}
            {...field}
          />
          <FieldMessage message={fieldState.error?.message} />
        </div>
      )}
    />
  )
}
