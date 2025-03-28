import { FC, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  Button,
  Input,
  Textarea,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '../../ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
} from '@tanstack/react-query'
import { postTodo } from '../../../api'
import { ToDo } from '../../../types'
import { toast } from 'sonner'

const formSchema = z.object({
  text: z.string(),
  deadline: z.string(),
  done: z.boolean().optional(),
})

interface AddTodoFormProps {
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<ToDo[] | undefined, unknown>>
}

const AddTodoForm: FC<AddTodoFormProps> = ({ refetch }) => {
  const { mutate } = useMutation({
    mutationKey: ['addTodo'],
    mutationFn: postTodo,
    onSuccess: async () => refetch(),
    onError: () => {
      toast('오류 발생', {
        description:
          '데이터를 추가하는데 문제가 발생했습니다. 잠시후 다시 시도해주세요.',
        action: {
          label: '확인',
          onClick: () => console.log('Confirm'),
        },
      })
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      deadline: '',
    },
  })

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      console.log({ values })
      const { text, deadline } = values

      mutate({
        done: false,
        text,
        deadline: new Date(deadline).getTime(),
      })
    },
    [mutate]
  )

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
            <Button type="submit">Add Todo</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

export default AddTodoForm
