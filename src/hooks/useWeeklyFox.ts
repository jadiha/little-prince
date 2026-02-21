import { useMemo } from 'react'
import { getDay, startOfWeek, format } from 'date-fns'
import { useAppStore } from '@/store/appStore'

export function useWeeklyFox() {
  const reflections = useAppStore((s) => s.weeklyReflections)

  const shouldShowFox = useMemo(() => {
    const today = new Date()
    const isFriday = getDay(today) === 5

    if (!isFriday) return false

    const thisWeekMonday = format(
      startOfWeek(today, { weekStartsOn: 1 }),
      'yyyy-MM-dd'
    )

    return !reflections.some((r) => r.weekOf === thisWeekMonday)
  }, [reflections])

  return { shouldShowFox }
}
