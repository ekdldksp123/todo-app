import { FC, memo } from 'react'
import { MemoizedPaginationButton as PaginationButton } from './button'

interface PaginationProps {
  goToPage: (newPage: number) => void
  goToPrevGroup: () => void
  goToNextGroup: () => void
  totalPages: number
  currentPage: number
  startPage: number
  endPage: number
}

const Pagination: FC<PaginationProps> = ({
  goToPage,
  goToPrevGroup,
  goToNextGroup,
  totalPages,
  currentPage,
  startPage,
  endPage,
}) => {
  return totalPages ? (
    <footer className="absolute bottom-0">
      <div className="flex justify-between items-center py-2 px-6">
        <PaginationButton
          type="prev-more"
          onClick={goToPrevGroup}
          disabled={startPage === 1}
        />
        <PaginationButton
          type="prev"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        />

        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ).map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-3 py-1 rounded-md cursor-pointer ${
              currentPage === page ? 'text-white' : 'text-secondary-foreground'
            }`}
          >
            {page}
          </button>
        ))}

        <PaginationButton
          type="next"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <PaginationButton
          type="next-more"
          onClick={goToNextGroup}
          disabled={endPage === totalPages}
        />
      </div>
    </footer>
  ) : null
}

export default memo(Pagination)
