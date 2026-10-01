import { Link } from 'react-router'
import { useNoteQuery } from '../queries/use-note-query'

export function NoteDetail({ id }: { id: string }) {
  const note = useNoteQuery(id)

  if (note.isPending)
    return <p className="text-sm text-muted-foreground">Loading note…</p>

  if (note.isError || !note.data) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-destructive">That note could not be found.</p>
        <Link className="text-sm underline" to="/notes">Back to notes</Link>
      </div>
    )
  }

  return (
    <article className="flex flex-col gap-3">
      <h2 className="text-xl font-medium">{note.data.title}</h2>
      <p className="whitespace-pre-wrap text-sm">{note.data.body}</p>
      <Link className="text-sm underline" to="/notes">Back to notes</Link>
    </article>
  )
}
