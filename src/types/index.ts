import { z } from 'zod'

export * from './api'

export const TodoStatusSchema = z.enum(['todo', 'done', 'imminent'])

export const TodoFormSchema = z.object({
  keyword: z.string().min(1),
  period: z.string(),
  status: TodoStatusSchema,
})
