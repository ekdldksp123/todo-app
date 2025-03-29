import { z } from 'zod'

export * from './api'

export type TodoStatus = 'todo' | 'done' | 'imminent'

export const TodoStatusSchema = z.enum(['todo', 'done', 'imminent', 'all'])

export const TodoFormSchema = z.object({
  keyword: z.string().min(1),
  period: z.string(),
  status: TodoStatusSchema,
})
