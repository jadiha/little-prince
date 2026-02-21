import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useAppStore } from '@/store/appStore'
import { usePrince } from '@/hooks/usePrince'
import { useWeeklyFox } from '@/hooks/useWeeklyFox'
import PrinceMessage from './UI/PrinceMessage'
import DailyCheckIn from './UI/DailyCheckIn'
import StoryPlanetPanel from './UI/StoryPlanetPanel'
import WeeklyFox from './UI/WeeklyFox'
import HUD from './UI/HUD'

const LAST_VISIT_KEY = 'lp-last-visit'

export default function MainUI() {
  const { callPrince } = usePrince()
  const { shouldShowFox } = useWeeklyFox()
  const [foxOpen, setFoxOpen] = useState(false)

  // Morning greeting — fires once on first visit of the day
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY)

    if (lastVisit !== today) {
      localStorage.setItem(LAST_VISIT_KEY, today)
      // Small delay so the universe has time to render
      const id = setTimeout(() => callPrince('morning'), 1800)
      return () => clearTimeout(id)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Friday Fox reflection — delayed so it doesn't clash with morning greeting
  useEffect(() => {
    if (!shouldShowFox) return
    const id = setTimeout(() => setFoxOpen(true), 5000)
    return () => clearTimeout(id)
  }, [shouldShowFox])

  // Listen for Little Prince click from the canvas
  useEffect(() => {
    const handler = () => callPrince('morning')
    window.addEventListener('prince:clicked', handler)
    return () => window.removeEventListener('prince:clicked', handler)
  }, [callPrince])

  return (
    <>
      <HUD />
      <PrinceMessage />
      <DailyCheckIn />
      <StoryPlanetPanel />
      <WeeklyFox isOpen={foxOpen} onClose={() => setFoxOpen(false)} />
    </>
  )
}
