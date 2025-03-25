import { FC } from 'react'
import { Card, CardContent, CardFooter } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
} from '@tanstack/react-query'
import { postTodo } from '../../api'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '../../components/ui/form'
import { Textarea } from '../../components/ui/textarea'
import { Input } from '../../components/ui/input'
import { ToDo } from '../../types'

const formSchema = z.object({
  text: z.string(),
  deadline: z.string(),
})

interface AddTodoFormProps {
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<ToDo | undefined, unknown>>
}

export const AddTodoForm: FC<AddTodoFormProps> = ({ refetch }) => {
  const { mutate } = useMutation({
    mutationKey: ['addTodo'],
    mutationFn: postTodo,
    onSuccess: async () => refetch(),
    onError: () => {
      //TODO toast 띄우기
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      deadline: '',
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log({ values })
    const { text, deadline } = values
    mutate({ done: false, text, deadline: new Date(deadline).getTime() })
  }

  const onCancel = () => {
    form.reset()
  }

  return (
    <Card className="pt-5 pb-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex gap-3 items-start pb-3">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormLabel>New Task</FormLabel>
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
            <Button type="submit">Add Todo</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
