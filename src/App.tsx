import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './App.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      이곳에 To-Do App을 작성해주세요.
    </QueryClientProvider>
  )
}

export default App
