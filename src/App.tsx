import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './App.css'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'
import { SearchIcon } from 'lucide-react'
import Header from './components/header'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      {/* <section className="grow align-middle">
        <div className="flex items-center gap-2 p-4 bg-white shadow-md rounded-2xl">
          <SearchIcon className="w-6 h-6 text-gray-500" />
          <Input placeholder="To-Do 검색" className="w-1/3" />
          <Button className="cursor-pointer">Search</Button>
        </div>
      </section> */}
    </QueryClientProvider>
  )
}

export default App
