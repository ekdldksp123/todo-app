import { useQuery } from '@tanstack/react-query'
import { FC, useEffect, useLayoutEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllTodos } from '../../../api'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../ui/card'
import { Button } from '../../ui/button'
import { AddTodoForm } from './AddTodoForm'

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

  return (
    <main className="w-full h-full mt-4">
      <section className="bg-muted rounded-2xl w-[100%] h-[100%] p-4">
        <AddTodoForm refetch={refetch} />
      </section>
    </main>
  )
}

export default Home
