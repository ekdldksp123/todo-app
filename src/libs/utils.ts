import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const formatDate = (milliseconds: number) => {
  const date = new Date(milliseconds)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // month는 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const parseDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day) // month는 0부터 시작
}

export const isWithinThreeDays = (deadline: number): boolean => {
  const deadlineDate = new Date(deadline)
  const now = new Date()
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

  return deadlineDate <= threeDaysLater
}

export const isInDeadline = (date: Date, deadline: Date): boolean => {
  return date <= deadline
}
