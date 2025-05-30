import { zodResolver } from '@hookform/resolvers/zod'
import { SearchIcon } from 'lucide-react'
import { FC, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui'

import { ToDo, TodoStatusSchema } from '../../../types'
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from '@tanstack/react-query'

const formSchema = z.object({
  keyword: z.string().optional(),
  period: z.string().optional(),
  status: TodoStatusSchema.optional(),
})

interface SearchTodoFormProps {
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<ToDo[] | undefined, unknown>>
}

export const SearchTodoForm: FC<SearchTodoFormProps> = ({ refetch }) => {
  // const [_, setSearchParams] = useSearchParams()

  const initFormValues = useCallback(() => {
    const searchInput = localStorage.getItem('searchInput')
    if (searchInput) {
      const { keyword, status, period } = JSON.parse(searchInput)

      return { keyword, status, period }
    }
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initFormValues(),
  })

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      // setSearchParams(values)
      localStorage.setItem('searchInput', JSON.stringify(values))
      refetch()
    },
    [refetch]
  )

  return (
    <div className="flex items-center w-full p-4 bg-white shadow-md rounded-2xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-fit items-center gap-2"
        >
          <FormField
            control={form.control}
            name="keyword"
            render={({ field }) => (
              <FormItem className="flex w-[20rem] items-center">
                <FormLabel>
                  <SearchIcon className="w-6 h-6 text-gray-500" />
                </FormLabel>
                <FormControl>
                  <Input
                    id="keyword"
                    placeholder="To-Do 검색"
                    className="w-[100%]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem className="flex w-[9rem] items-center">
                <FormControl>
                  <Input
                    id="period"
                    className="w-[150px]"
                    type="date"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex w-[9rem] items-center">
                <Select onValueChange={field.onChange} {...field}>
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue id="status" placeholder="Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="todo">Todo</SelectItem>
                      <SelectItem value="imminent">Imminent</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button type="submit">Search</Button>
        </form>
      </Form>
    </div>
  )
}
