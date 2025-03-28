import {
  Dispatch,
  FC,
  SetStateAction,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { ToDo } from '../../../types'
import { v4 as uuidv4 } from 'uuid'
import { formatDate } from '../../../libs/utils'
import { Button, Checkbox, Dialog, DialogContent } from '../../ui'
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
} from '@tanstack/react-query'
import UpdateTodoForm from './UpdateTodoForm'
import { updateTodo } from '../../../api'

interface TaskProps {
  task: ToDo
  setSelectedTaskIds: Dispatch<SetStateAction<number[]>>
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<ToDo[] | undefined, unknown>>
}

const Task: FC<TaskProps> = ({ task, setSelectedTaskIds, refetch }) => {
  const { id, text, deadline } = task
  const taskId = useMemo(() => id.toString(), [id])

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { mutate } = useMutation({
    mutationKey: ['updateTodo'],
    mutationFn: updateTodo,
    onSuccess: async () => {
      refetch()
      setIsOpen(false)
    },
    onError: () => {
      //TODO toast 띄우기
    },
  })

  const handleCompleteTodo = useCallback(() => {
    mutate({ ...task, done: true })
    refetch()
  }, [mutate, refetch, task])

  return (
    <div
      id={uuidv4()}
      className="flex items-center w-full p-4 bg-white shadow-md rounded-xl"
    >
      <div className="flex items-center space-x-2">
        <Checkbox
          id={taskId}
          onCheckedChange={(state) => {
            setSelectedTaskIds((prev) => {
              const id = Number(taskId)
              if (!prev.includes(id) && state === true) {
                return [...prev, id]
              } else if (prev.includes(id) && state === false) {
                return prev.filter((v) => v !== id)
              }
              return prev
            })
          }}
        />
        <label
          htmlFor={taskId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {text}
        </label>
      </div>

      <div className="grow" />
      <small> {formatDate(deadline)}</small>
      <div className="flex items-center gap-1 ml-2">
        <Button
          variant="secondary"
          size="sm"
          className="shadow-md"
          onClick={() => setIsOpen(true)}
        >
          수정
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="shadow-md"
          onClick={handleCompleteTodo}
        >
          완료
        </Button>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 min-w-3xl">
          <UpdateTodoForm todo={task} refetch={refetch} setIsOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default memo(Task)
