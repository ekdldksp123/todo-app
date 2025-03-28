import { useState, useMemo } from 'react'

type UsePaginationProps<T> = {
  data: T[] // 제너릭 사용
  pageGroupSize?: number
}

export function usePagination<T>({
  data,
  pageGroupSize = 5,
}: UsePaginationProps<T>) {
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  // 현재 페이지 데이터
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, page, pageSize])

  // 전체 페이지
  const totalPages = Math.ceil(data.length / pageSize)

  // 현재 페이지가 속한 그룹
  const currentGroup = Math.ceil(page / pageGroupSize)
  const totalGroups = Math.ceil(totalPages / pageGroupSize)

  // 현재 페이지 그룹에서 표시할 시작/끝 페이지 번호
  const startPage = (currentGroup - 1) * pageGroupSize + 1
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages)

  // 페이지 이동
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  // 페이지 크기 변경
  const changePageSize = (newSize: number) => {
    setPageSize(newSize)
    setPage(1) // 페이지 크기 변경 시 첫 페이지로 이동
  }

  // 페이지단 이동
  const goToPrevGroup = () => goToPage(startPage - 1)
  const goToNextGroup = () => goToPage(endPage + 1)

  return {
    paginatedData,
    goToPage,
    changePageSize,
    goToPrevGroup,
    goToNextGroup,
    totalPages,
    currentPage: page,
    pageSize,
    currentGroup,
    totalGroups,
    startPage,
    endPage,
  }
}
