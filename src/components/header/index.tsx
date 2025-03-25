import { FC } from 'react'
import { SearchTodoForm } from './SearchTodoForm'

const Header: FC = () => {
  return (
    <section className="grow align-middle">
      <SearchTodoForm />
    </section>
  )
}

export default Header
