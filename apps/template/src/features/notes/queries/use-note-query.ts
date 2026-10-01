import { useQuery } from '@tanstack/react-query'
import { getNotesApi } from '../api'
import { notesKeys } from './notes.keys'

export function useNoteQuery(id: string) {
  return useQuery({
    queryKey: notesKeys.detail(id),
    queryFn: () => getNotesApi().read(id),
  })
}
