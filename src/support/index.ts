import { deleteTodo, getAllTodos, postTodo } from '../api'
import { worker } from '../mocks/browser'
import { ToDo } from '../types'

const fetchTodos = async () => {
  try {
    const todos = await getAllTodos()
    return todos ?? []
  } catch (error) {
    console.error(error)
    return []
  }
}

const checkAndDeleteAllData = async (data: ToDo[]) => {
  if (data.length > 100) return false
  for (const { id } of data) {
    try {
      await deleteTodo(id)
    } catch (error) {
      console.error(error)
    }
  }
  return true
}

const insertDummyTodos = async () => {
  for (let i = 0; i < 100; i++) {
    const today = new Date()
    if (i < 10) {
      await postTodo({
        text: `test data ${i + 1}`,
        done: true,
        deadline: today.getTime(),
      })
    } else if (i < 70) {
      today.setDate(today.getDate() + 3)
      await postTodo({
        text: `test data ${i + 1}`,
        done: false,
        deadline: today.getTime(),
      })
    } else {
      today.setDate(today.getDate() + 7)
      await postTodo({
        text: `test data ${i + 1}`,
        done: false,
        deadline: today.getTime(),
      })
    }
  }
}

const setupTodos = async () => {
  await worker.start({
    quiet: true,
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })
  // data fetch
  const todos = await fetchTodos()

  console.log({ todos })
  const needToInsert = await checkAndDeleteAllData(todos)

  console.log({ needToInsert })

  if (needToInsert) {
    await insertDummyTodos()
  }
  const newTodos = await fetchTodos()

  console.log(`setupTodos complete :: ${newTodos.length}`)

  worker.stop()
}

setupTodos()
