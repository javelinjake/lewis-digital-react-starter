import type { NoteValues } from '../forms/note.schema'
import { getDirectusErrorMessage } from '@ld/directus'
import { LdForm, TextAreaField, TextField } from '@ld/forms'
import { Button, toast } from '@ld/ui'
import { useState } from 'react'
import { noteSchema } from '../forms/note.schema'
import { useCreateNoteMutation } from '../mutations/use-create-note-mutation'

export function NoteComposer() {
  const createNote = useCreateNoteMutation()
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(values: NoteValues) {
    setError(null)

    try {
      await createNote.mutateAsync(values)
      toast.success('Note saved')
    }
    catch (caught) {
      setError(getDirectusErrorMessage(caught))
    }
  }

  return (
    <LdForm
      schema={noteSchema}
      defaultValues={{ title: '', body: '' }}
      onSubmit={onSubmit}
    >
      {form => (
        <>
          <TextField control={form.control} name="title" label="Title" />
          <TextAreaField control={form.control} name="body" label="Body" />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" disabled={createNote.isPending}>
            {createNote.isPending ? 'Saving…' : 'Add note'}
          </Button>
        </>
      )}
    </LdForm>
  )
}
