import { useQuery } from '@tanstack/react-query'
import { FC, useCallback, useEffect, useLayoutEffect, useMemo } from 'react'
import { getAllTodos } from '../../api'
import { AddTodoForm, TaskList } from '../../components/pages/Home'
import {
  isWithinThreeDays,
  parseDate,
  sortTodosByDeadline,
} from '../../libs/utils'
import { SearchTodoForm } from '../../components/pages/Home/SearchTodoForm'

const Home: FC = () => {
  const filterTodos = useCallback(async () => {
    const data = (await getAllTodos()) ?? []
    // 마감 순으로 정렬
    const todos = sortTodosByDeadline(data)
    const searchInput = localStorage.getItem('searchInput')

    console.log({ todos, searchInput })

    if (!todos.length || !searchInput) return todos

    // const { keyword, status, period } = JSON.parse(searchInput)
    // console.log({ keyword, status, period })
    const condition = JSON.parse(searchInput)

    const keyword = condition.keyword?.toLowerCase() ?? null
    const periodTime = condition.period
      ? parseDate(condition.period).getTime()
      : null
    const status = condition.status ?? null

    console.log({ keyword, periodTime, status })

    return todos.filter(({ text, deadline, done }) => {
      // 키워드 필터링 (대소문자 무시)
      if (keyword && !text.toLowerCase().includes(keyword.toLowerCase())) {
        return false
      }
      // 상태 필터링
      if (status) {
        if (status === 'done' && done !== true) {
          return false
        } else if (status === 'imminent' && !isWithinThreeDays(deadline)) {
          return false
        } else if (status === 'todo' && done !== false) {
          return false
        }
      }

      // 기간 필터링
      if (periodTime && new Date(deadline).getTime() > periodTime) return false

      return true
    })
  }, [])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['getTodos'],
    queryFn: filterTodos,
    enabled: false,
  })

  // if(isLoading) {

  // }

  useLayoutEffect(() => {
    refetch()
  }, [refetch])

  const { todo, imminent, done } = useMemo(() => {
    const todo = []
    const imminent = []
    const done = []
    if (data?.length) {
      for (const task of data) {
        if (task.done) {
          done.push(task)
        } else if (isWithinThreeDays(task.deadline)) {
          imminent.push(task)
        } else {
          todo.push(task)
        }
      }
    }

    return { todo, imminent, done }
  }, [data])

  return (
    <main className="w-full h-full flex flex-col gap-4">
      <header className="grow align-middle">
        <SearchTodoForm refetch={refetch} />
      </header>
      <section className="flex flex-col gap-4 bg-muted rounded-2xl w-[100%] h-[100%] p-4">
        <AddTodoForm refetch={refetch} />
        {data ? (
          <div className="grid grid-cols-3 gap-2">
            <TaskList type="todo" tasks={todo} refetch={refetch} />
            <TaskList type="imminent" tasks={imminent} refetch={refetch} />
            <TaskList type="done" tasks={done} refetch={refetch} />
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default Home
