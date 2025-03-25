import { zodResolver } from '@hookform/resolvers/zod'
import { SearchIcon } from 'lucide-react'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useSearchParams } from 'react-router-dom'
import { TodoStatusSchema } from '../../types'

const formSchema = z.object({
  keyword: z.string().min(1),
  period: z.string(),
  status: TodoStatusSchema,
})

export const SearchTodoForm: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: '',
      period: '',
      status: 'todo',
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    setSearchParams({ ...values })
    localStorage.setItem('searchInput', JSON.stringify(values))
  }

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
                  <Input className="w-[150px]" type="date" {...field} />
                </FormControl>
                <FormMessage />
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
                      <SelectValue
                        placeholder="Select a fruit"
                        defaultValue={field.value}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
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
