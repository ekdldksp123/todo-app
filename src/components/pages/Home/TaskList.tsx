import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { ToDo, TodoStatus } from '../../../types'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import Task from './Task'
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
} from '@tanstack/react-query'
import { deleteTodo } from '../../../api'

interface TaskListProps {
  type: TodoStatus
  tasks: ToDo[]
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<ToDo[] | undefined, unknown>>
}
const TaskList: FC<TaskListProps> = ({ type, tasks, refetch }) => {
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([])
  const { title, background } = useMemo(() => {
    switch (type) {
      case 'todo':
        return { title: 'Todo', background: 'bg-[#ff4747]' }
      case 'imminent':
        return { title: '3 days left', background: 'bg-[#00bcb4]' }
      case 'done':
        return { title: 'Complete', background: 'bg-[#c4e86b]' }
    }
  }, [type])

  const { mutate } = useMutation({
    mutationKey: ['deleteTodo'],
    mutationFn: async (todoIds: number[]) => {
      // 여러 개의 삭제 요청을 병렬로 실행
      await Promise.all(todoIds.map((id) => deleteTodo(id)))
    },
    onSuccess: async () => refetch(),
    onError: () => {
      //TODO toast 띄우기
    },
  })

  const onDeleteTodos = useCallback(() => {
    if (selectedTaskIds.length) {
      mutate(selectedTaskIds)
    }
  }, [mutate, selectedTaskIds])

  useEffect(() => {
    console.log({ selectedTaskIds })
  }, [selectedTaskIds])

  return (
    <Card className={background}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="flex gap-1 justify-end">
          <Button variant="outline" onClick={onDeleteTodos}>
            삭제
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <Task
              task={task}
              refetch={refetch}
              setSelectedTaskIds={setSelectedTaskIds}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default memo(TaskList)
