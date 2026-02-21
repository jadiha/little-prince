import { Suspense, lazy } from 'react'
import { useAppStore } from '@/store/appStore'
import OnboardingFlow from '@/components/Onboarding/OnboardingFlow'
import MainUI from '@/components/MainUI'
import Sidebar from '@/components/Navigation/Sidebar'
import LittlePrinceSprite from '@/components/UI/LittlePrinceSprite'

// Lazy-load the heavy Three.js canvas so the onboarding screen
// can render immediately while Three.js initialises in the background
const UniverseCanvas = lazy(() => import('@/components/Universe/UniverseCanvas'))

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
  const isOnboarding = activeView === 'onboarding'

  return (
    <div className="w-screen h-screen bg-space-dark overflow-hidden relative">
      {/* 3D Universe — always rendered in background (except during onboarding) */}
      {!isOnboarding && (
        <Suspense fallback={<StarsFallback />}>
          <UniverseCanvas />
        </Suspense>
      )}

      {isOnboarding ? (
        <OnboardingFlow />
      ) : (
        <>
          <Sidebar />
          <LittlePrinceSprite />
          <MainUI />
        </>
      )}
    </div>
  )
}
