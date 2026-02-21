import { Suspense, lazy } from 'react'
import { useAppStore } from '@/store/appStore'
import OnboardingFlow from '@/components/Onboarding/OnboardingFlow'
import MainUI from '@/components/MainUI'

// Lazy-load the heavy Three.js canvas so the onboarding screen
// can render immediately while Three.js initialises in the background
const UniverseCanvas = lazy(() => import('@/components/Universe/UniverseCanvas'))

// Minimal CSS star fallback shown while Three.js loads
function StarsFallback() {
  return (
    <div className="fixed inset-0 bg-space-dark flex items-center justify-center">
      <p className="font-handwriting text-star-gold text-lg opacity-60 animate-pulse">
        lighting the stars…
      </p>
    </div>
  )
}

export default function App() {
  const activeView = useAppStore((s) => s.activeView)

  return (
    <div className="w-screen h-screen bg-space-dark overflow-hidden relative">
      {/* 3D Universe — always rendered once loaded */}
      <Suspense fallback={<StarsFallback />}>
        <UniverseCanvas />
      </Suspense>

      {/* UI layer — stacked on top of the canvas */}
      {activeView === 'onboarding' ? <OnboardingFlow /> : <MainUI />}
    </div>
  )
}
