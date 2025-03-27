import { useQuery } from '@tanstack/react-query'
import { FC, useEffect, useLayoutEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllTodos } from '../../api'
import TaskList from '../../components/pages/Home/TaskList'
import { TodoForm } from '../../components/pages/Home'

const Home: FC = () => {
  const [searchParams] = useSearchParams()

  // const filterTodos = async () => {
  //   const todos = await getAllTodos()
  //   if(searchParams) {
  //     let filteredList = [...todos];
  //     searchParams.forEach((value, key) => {
  //       if(key === 'status') {
  //         filteredList = filteredList.filter(({done}) =>)
  //       }
  //     })
  //   }
  //   return todos;
  // }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['todos', searchParams],
    queryFn: getAllTodos,
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
        <TodoForm type="add" refetch={refetch} />
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
