import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { ToDo, TodoStatus } from '../../../types'
import {
  Button,
  PaginationButton,
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
    pageSize,
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
      //TODO toast 띄우기
    },
  })

  const onDeleteTodos = useCallback(() => {
    if (selectedTaskIds.length) {
      mutate(selectedTaskIds)
    }
  }, [mutate, selectedTaskIds])

  useEffect(() => {
    console.log({ currentPage, totalPages })
  }, [currentPage, totalPages])

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
        <div className="flex flex-col gap-2">
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
        {totalPages ? (
          <footer className="absolute bottom-0">
            <div className="flex justify-between items-center py-2 px-6">
              <PaginationButton
                type="prev-more"
                onClick={goToPrevGroup}
                disabled={startPage === 1}
              />
              <PaginationButton
                type="prev"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              />

              {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 rounded-md cursor-pointer ${
                    currentPage === page
                      ? 'text-white'
                      : 'text-secondary-foreground'
                  }`}
                >
                  {page}
                </button>
              ))}

              <PaginationButton
                type="next"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <PaginationButton
                type="next-more"
                onClick={goToNextGroup}
                disabled={endPage === totalPages}
              />
            </div>
          </footer>
        ) : null}
      </CardFooter>
    </Card>
  )
}

export default memo(TaskList)
