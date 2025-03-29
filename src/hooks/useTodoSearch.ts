import { useCallback } from 'react'
import { getAllTodos } from '../api'
import { isWithinThreeDays, parseDate } from '../libs/utils'

export const useTodoSearch = () => {
  // const [searchParams] = useSearchParams()

  const filterTodos = useCallback(async () => {
    const data = (await getAllTodos()) ?? []

    const searchInput = localStorage.getItem('searchInput')

    // console.log({ data, searchInput })

    if (!data.length || !searchInput) return data

    const condition = JSON.parse(searchInput)

    const keyword = condition.keyword?.toLowerCase() ?? null
    const periodTime = condition.period
      ? parseDate(condition.period).getTime()
      : null
    const status = condition.status ?? null

    // console.log({ keyword, periodTime, status })

    return data.filter(({ text, deadline, done }) => {
      // 키워드 필터링 (대소문자 무시)
      if (keyword && !text.toLowerCase().includes(keyword.toLowerCase())) {
        return false
      }
      // 기간 필터링
      if (periodTime && new Date(deadline).getTime() > periodTime) return false
      // 상태 필터링
      if (status) {
        if (status === 'done' && done !== true) {
          return false
        } else if (status === 'imminent' && !isWithinThreeDays(deadline)) {
          return false
        } else if (status === 'todo' && done !== false) {
          return false
        }
      }
      return true
    })
  }, [])

  return { filterTodos }
}
