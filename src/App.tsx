import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'
import Home from './pages/Home'
import { useLayoutEffect } from 'react'
import { getDummyTodos } from './libs/utils'

const queryClient = new QueryClient()

function App() {
  useLayoutEffect(() => {
    // 앱 시작시 최초 한번 todos 데이터 세팅
    const initFlag = localStorage.getItem('initTodos')
    if (!initFlag) {
      localStorage.removeItem('todos')
      localStorage.removeItem('searchInput')

      const todos = getDummyTodos()
      localStorage.setItem('todos', JSON.stringify(todos))
      localStorage.setItem('initTodos', 'true')
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/todo-app">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
