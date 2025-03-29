import { FC, memo, useCallback, useMemo, useState } from 'react'
import { ToDo, TodoStatus } from '../../../types'
import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Pagination,
} from '../../ui'
import Task from './Task'
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
} from '@tanstack/react-query'
import { deleteTodo } from '../../../api'
import { usePagination } from '../../../hooks'
import { cn } from '../../../libs/utils'
import { toast } from 'sonner'

interface TaskListProps {
  type: TodoStatus
  tasks: ToDo[]
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<ToDo[] | undefined, unknown>>
}
const TaskList: FC<TaskListProps> = ({ type, tasks, refetch }) => {
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([])

  const {
    paginatedData,
    goToPage,
    changePageSize,
    goToPrevGroup,
    goToNextGroup,
    totalPages,
    currentPage,
    startPage,
    endPage,
  } = usePagination({
    data: tasks,
  })

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
      toast('오류 발생', {
        description:
          '데이터를 삭제하는 데 문제가 발생했습니다. 잠시후 다시 시도해주세요.',
        action: {
          label: '확인',
          onClick: () => console.log('Confirm'),
        },
      })
    },
  })

  const onDeleteTodos = useCallback(() => {
    if (selectedTaskIds.length) {
      mutate(selectedTaskIds)
    }
  }, [mutate, selectedTaskIds])

  return (
    <Card className={cn(background, 'relative')}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="flex gap-1 justify-between">
          <Select
            defaultValue="10"
            onValueChange={(v) => changePageSize(Number(v))}
          >
            <SelectTrigger className="w-[9rem] bg-white">
              <SelectValue placeholder="페이지당 항목수" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectLabel>페이지당 항목수</SelectLabel>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={onDeleteTodos}>
            삭제
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-2 h-[25rem] overflow-y-auto">
          {paginatedData.map((task) => (
            <Task
              task={task}
              refetch={refetch}
              setSelectedTaskIds={setSelectedTaskIds}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center">
        <Pagination
          startPage={startPage}
          endPage={endPage}
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
          goToNextGroup={goToNextGroup}
          goToPrevGroup={goToPrevGroup}
        />
      </CardFooter>
    </Card>
  )
}

export default memo(TaskList)
