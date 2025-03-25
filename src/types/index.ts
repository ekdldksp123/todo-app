import { z } from 'zod'

export * from './api'

export const TodoStatusSchema = z.enum(['todo', 'done', 'imminent'])
