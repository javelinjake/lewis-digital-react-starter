import * as v from 'valibot'

export const noteSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1, 'Title is required')),
  body: v.pipe(v.string(), v.minLength(1, 'Body is required')),
})

export type NoteValues = v.InferOutput<typeof noteSchema>
