import { Link } from 'react-router'
import { useNotesQuery } from '../queries/use-notes-query'
import { NoteComposer } from './NoteComposer'

export function NotesScreen() {
  const notes = useNotesQuery()

  return (
    <div className="flex flex-col gap-8">
      <NoteComposer />
      {notes.isPending ? <p className="text-sm text-muted-foreground">Loading notes…</p> : null}
      {notes.isError ? <p className="text-sm text-destructive">Notes could not be loaded.</p> : null}
      {notes.data?.length === 0 ? <p className="text-sm text-muted-foreground">No notes yet.</p> : null}
      {notes.data && notes.data.length > 0
        ? (
            <ul className="flex flex-col gap-2">
              {notes.data.map(note => (
                <li key={note.id}>
                  <Link className="block rounded-lg border px-3 py-2 hover:bg-muted" to={`/notes/${note.id}`}>
                    <span className="font-medium">{note.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{note.body}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )
        : null}
    </div>
  )
}
