import { useEffect, useState, useCallback } from 'react'
import { useAppStore } from '@/store/appStore'
import { usePrince } from '@/hooks/usePrince'
import { useWeeklyFox } from '@/hooks/useWeeklyFox'
import PrinceMessage from './UI/PrinceMessage'
import DailyCheckIn from './UI/DailyCheckIn'
import StoryPlanetPanel from './UI/StoryPlanetPanel'
import WeeklyFox from './UI/WeeklyFox'
import HUD from './UI/HUD'
import ShootingStars from './UI/ShootingStars'
import RosePanel from './UI/RosePanel'
import ExplorePage from './Explore/ExplorePage'
import MyGoalsPage from './Goals/MyGoalsPage'

export default function MainUI() {
  const { callPrince } = usePrince()
  const { shouldShowFox } = useWeeklyFox()
  const [foxOpen, setFoxOpen] = useState(false)
  const [showShooting, setShowShooting] = useState(false)
  const [shootingDone, setShootingDone] = useState(false)

  const activeView = useAppStore((s) => s.activeView)
  const recordVisit = useAppStore((s) => s.recordVisit)

  const handleShootingDone = useCallback(() => {
    setShowShooting(false)
    setShootingDone(true)
  }, [])

  // Morning greeting + shooting stars on daily return
  useEffect(() => {
    const isReturning = recordVisit()
    const delay = isReturning ? 600 : 0

    if (isReturning) {
      setShowShooting(true)
    }

    // Fire morning greeting after shooting stars (or immediately if first visit today)
    const greetDelay = isReturning ? 2600 : 1800
    const id = setTimeout(() => callPrince('morning'), greetDelay + delay)
    return () => clearTimeout(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Friday Fox reflection — delayed so it doesn't clash with morning greeting
  useEffect(() => {
    if (!shouldShowFox) return
    const id = setTimeout(() => setFoxOpen(true), 5000)
    return () => clearTimeout(id)
  }, [shouldShowFox])

  // Listen for Little Prince sprite click
  useEffect(() => {
    const handler = () => callPrince('morning')
    window.addEventListener('prince:clicked', handler)
    return () => window.removeEventListener('prince:clicked', handler)
  }, [callPrince])

  return (
    <>
      {/* Shooting stars on daily return */}
      {showShooting && <ShootingStars onDone={handleShootingDone} />}

      {/* Overlay pages */}
      {activeView === 'explore' && <ExplorePage />}
      {activeView === 'mygoals' && <MyGoalsPage />}

      {/* Rose health panel — visible when zoomed into the rose */}
      <RosePanel />

      {/* Core UI — always visible */}
      <HUD />
      <PrinceMessage />
      <DailyCheckIn />
      <StoryPlanetPanel />
      <WeeklyFox isOpen={foxOpen} onClose={() => setFoxOpen(false)} />
    </>
  )
}
