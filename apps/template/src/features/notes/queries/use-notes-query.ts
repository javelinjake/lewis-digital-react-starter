import { useQuery } from '@tanstack/react-query'
import { getNotesApi } from '../api'
import { notesKeys } from './notes.keys'

export function useNotesQuery() {
  return useQuery({
    queryKey: notesKeys.list(),
    queryFn: () => getNotesApi().list(),
  })
}
