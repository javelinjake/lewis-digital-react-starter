import type { CreateNoteInput } from '../types/note'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotesApi } from '../api'
import { notesKeys } from '../queries/notes.keys'

export function useCreateNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateNoteInput) => getNotesApi().create(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notesKeys.all })
    },
  })
}
