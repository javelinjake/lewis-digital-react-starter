import { useParams } from 'react-router'
import { NoteDetail } from '@/features/notes/components/NoteDetail'

export function NoteDetailPage() {
  const { id } = useParams()

  if (!id)
    return null

  return <NoteDetail id={id} />
}
