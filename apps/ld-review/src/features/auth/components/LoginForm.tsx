import type { LoginValues } from '../forms/login.schema'
import { getDirectusErrorMessage } from '@ld/directus'
import { LdForm, TextField } from '@ld/forms'
import { Button } from '@ld/ui'
import { useState } from 'react'
import { loginSchema } from '../forms/login.schema'

export function LoginForm({ onSubmit }: { onSubmit: (values: LoginValues) => Promise<void> }) {
  const [error, setError] = useState<string | null>(null)

  return (
    <LdForm
      schema={loginSchema}
      defaultValues={{ email: '', password: '' }}
      onSubmit={async (values) => {
        setError(null)

        try {
          await onSubmit(values)
        }
        catch (caught) {
          setError(getDirectusErrorMessage(caught))
        }
      }}
    >
      {form => (
        <>
          <TextField control={form.control} name="email" label="Email" type="email" />
          <TextField control={form.control} name="password" label="Password" type="password" />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit">Sign in</Button>
        </>
      )}
    </LdForm>
  )
}
