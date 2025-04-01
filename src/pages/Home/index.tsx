import { useQuery } from '@tanstack/react-query'
import { FC, useMemo } from 'react'
import { AddTodoForm, TaskList } from '../../components/pages/Home'
import { isWithinThreeDays } from '../../libs/utils'
import { SearchTodoForm } from '../../components/pages/Home/SearchTodoForm'
import { toast } from 'sonner'
import { useTodoSearch } from '../../hooks'

const Home: FC = () => {
  const { filterTodos } = useTodoSearch()

  const { data, isError, refetch } = useQuery({
    queryKey: ['getTodos'],
    queryFn: filterTodos,
  })

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

  if (isError) {
    toast('오류 발생', {
      description:
        '데이터를 불러오는 데 문제가 발생했습니다. 잠시후 다시 접속해주세요.',
      action: {
        label: '확인',
        onClick: () => console.log('Confirm'),
      },
    })
  }

  return (
    <main className="w-full h-full flex flex-col gap-4">
      <header className="grow align-middle">
        <SearchTodoForm refetch={refetch} />
      </header>
      <section className="flex flex-col gap-4 bg-muted rounded-2xl w-[100%] h-[100%] p-4">
        <AddTodoForm refetch={refetch} />
        <div className="grid grid-cols-3 gap-2">
          {data ? (
            <>
              <TaskList type="todo" tasks={todo} refetch={refetch} />
              <TaskList type="imminent" tasks={imminent} refetch={refetch} />
              <TaskList type="done" tasks={done} refetch={refetch} />
            </>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export default Home
