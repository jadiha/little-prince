import { useCallback } from 'react'
import { useAppStore, selectRoseState } from '@/store/appStore'
import { FALLBACK_QUOTES } from '@/data/quotes'
import type { PrinceContext, StoryPlanetId } from '@/types'

export function usePrince() {
  const goals = useAppStore((s) => s.goals)
  const stars = useAppStore((s) => s.stars)
  const roseState = useAppStore(selectRoseState)
  const setPrinceMessage = useAppStore((s) => s.setPrinceMessage)
  const setIsPrinceTyping = useAppStore((s) => s.setIsPrinceTyping)

  // Returns the prince's message (also sets it in the store for display)
  const callPrince = useCallback(async (
    context: PrinceContext,
    goalName?: string,
    note?: string,
    storyPlanetId?: StoryPlanetId,
  ): Promise<string | null> => {
    setIsPrinceTyping(true)
    setPrinceMessage(null)

    const goalSummaries = goals.map((g) => ({
      name: g.name,
      logCount: g.logs.length,
    }))

    try {
      const response = await fetch('/api/prince', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(8000),
        body: JSON.stringify({
          context,
          goals: goalSummaries,
          roseState,
          totalStars: stars.length,
          payload: { goalName, note, storyPlanetId },
        }),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json() as { message: string }
      setPrinceMessage(data.message)
      setIsPrinceTyping(false)
      return data.message
    } catch {
      // Graceful fallback — never show an error to the user
      const quote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]
      setPrinceMessage(quote)
      setIsPrinceTyping(false)
      return quote
    }
  }, [goals, stars.length, roseState, setPrinceMessage, setIsPrinceTyping])

  return { callPrince }
}
