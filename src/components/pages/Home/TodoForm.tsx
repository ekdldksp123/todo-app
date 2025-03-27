import { FC, useCallback, useMemo } from 'react'
import { Card, CardContent, CardFooter } from '../../ui/card'
import { Button } from '../../ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
} from '@tanstack/react-query'
import { postTodo, updateTodo } from '../../../api'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '../../ui/form'
import { Textarea } from '../../ui/textarea'
import { Input } from '../../ui/input'
import { ToDo } from '../../../types'
import { formatDate } from '../../../libs/utils'

const formSchema = z.object({
  text: z.string(),
  deadline: z.string(),
  done: z.boolean().optional(),
})

interface TodoFormProps {
  type: 'add' | 'update'
  todo?: ToDo
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<ToDo[] | undefined, unknown>>
}

const TodoForm: FC<TodoFormProps> = ({ type, todo, refetch }) => {
  const { mutate: addTodo } = useMutation({
    mutationKey: ['addTodo'],
    mutationFn: postTodo,
    onSuccess: async () => refetch(),
    onError: () => {
      //TODO toast 띄우기
    },
  })

  const { mutate: editTodo } = useMutation({
    mutationKey: ['updateTodo'],
    mutationFn: updateTodo,
    onSuccess: async () => refetch(),
    onError: () => {
      //TODO toast 띄우기
    },
  })

  const initFormValues = useCallback(() => {
    if (type === 'update' && todo) {
      return {
        text: todo.text,
        deadline: formatDate(todo.deadline),
        done: todo.done,
      }
    }

    return {
      text: '',
      deadline: '',
    }
  }, [type, todo])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValues(),
  })

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      console.log({ values })
      const { text, deadline } = values

      if (type === 'add') {
        addTodo({
          done: false,
          text,
          deadline: new Date(deadline).getTime(),
        })
      } else if (todo !== undefined) {
        editTodo({ ...todo, text, deadline: new Date(deadline).getTime() })
      }
    },
    [addTodo, editTodo, todo, type]
  )

  const onCancel = () => {
    form.reset()
  }

  const mainButtonName = useMemo(
    () => (type === 'add' ? 'Add Todo' : 'Update Todo'),
    [type]
  )

  const cardStyles = useMemo(
    () => (type === 'add' ? 'pt-5 pb-3' : 'border-none shadow-none pt-5 pb-3'),
    [type]
  )

  return (
    <Card className={cardStyles}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex gap-3 items-start pb-3">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormLabel>Task</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="w-[9rem]">
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-row-reverse gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{mainButtonName}</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

export default TodoForm
