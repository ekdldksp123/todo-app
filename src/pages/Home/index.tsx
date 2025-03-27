import { useQuery } from '@tanstack/react-query'
import { FC, useEffect, useLayoutEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllTodos } from '../../api'
import { AddTodoForm, TaskList } from '../../components/pages/Home'
import { isInDeadline, isWithinThreeDays, parseDate } from '../../libs/utils'

const Home: FC = () => {
  const [searchParams] = useSearchParams()

  const filterTodos = async () => {
    const todos = (await getAllTodos()) ?? []
    if (!todos.length) return todos

    if (searchParams) {
      const { keyword, status, period } = searchParams
      return todos.filter((todo) => {
        // 키워드 필터
        const matchesKeyword = !keyword ? true : todo.text.includes(keyword)

        let matchesStatus = true
        if (status === 'done') {
          matchesStatus = todo.done === true
        } else if (status === 'imminent') {
          matchesStatus = isWithinThreeDays(period)
        } else if (status === 'todo') {
          matchesStatus = todo.done === false
        }

        const matchesPeriod = !period
          ? true
          : isInDeadline(parseDate(period), new Date(todo.deadline))
        return matchesKeyword && matchesStatus && matchesPeriod
      })
    }
    return todos
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['todos', searchParams],
    queryFn: filterTodos,
  })

  useEffect(() => {
    console.log({ data })
  }, [data])

  // useLayoutEffect(() => {
  //   if (searchParams) {
  //     const { keyword, period, status } = searchParams
  //   }
  // }, [])

  // if(isLoading) {

  // }

  return (
    <main className="w-full h-full mt-4">
      <section className="flex flex-col gap-4 bg-muted rounded-2xl w-[100%] h-[100%] p-4">
        <AddTodoForm refetch={refetch} />
        {data ? (
          <div className="grid grid-cols-3 gap-2">
            <TaskList
              type="todo"
              tasks={data.filter(({ done }) => done === false)}
              refetch={refetch}
            />
            <TaskList type="imminent" tasks={[]} refetch={refetch} />
            <TaskList type="done" tasks={[]} refetch={refetch} />
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default Home
