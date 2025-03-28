import { APIResponse, ToDo, ToDoRequest } from '../../types'
import instance from '../instance'

const API_PREFIX = '/api/todos'

export const getAllTodos = async () => {
  try {
    const { data } = await instance.get(API_PREFIX)
    const todos = (data as unknown as APIResponse<ToDo[]>).data
    //마감일 순으로 정렬
    if (todos) {
      todos.sort((a, b) => a.deadline - b.deadline)
    }
    return todos
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getSingleTodo = async (id: number) => {
  try {
    const { data } = await instance.get(`${API_PREFIX}/${id}`)
    return (data as unknown as APIResponse<ToDo[]>).data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const postTodo = async (newTodo: ToDoRequest) => {
  try {
    const { data } = await instance.post(API_PREFIX, newTodo)
    console.log({ data })
    return (data as unknown as APIResponse<ToDo[]>).data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateTodo = async (todo: ToDo) => {
  try {
    const { id } = todo
    const { data } = await instance.put(`${API_PREFIX}/${id}`, todo)
    return (data as unknown as APIResponse<ToDo[]>).data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteTodo = async (id: number) => {
  try {
    const { data } = await instance.delete(`${API_PREFIX}/${id}`)
    return (data as unknown as APIResponse<ToDo[]>).data
  } catch (error) {
    console.error(error)
    throw error
  }
}
