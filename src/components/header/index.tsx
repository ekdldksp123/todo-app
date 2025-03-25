import { FC } from 'react'
import { SearchTodoForm } from './SearchTodoForm'

const Header: FC = () => {
  return (
    <header className="grow align-middle">
      <SearchTodoForm />
    </header>
  )
}

export default Header
