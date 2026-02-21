import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'

const NAV_ITEMS = [
  {
    id: 'universe' as const,
    label: 'Your Universe',
    icon: '✦',
  },
  {
    id: 'explore' as const,
    label: "The Prince's Journey",
    icon: '◎',
  },
  {
    id: 'mygoals' as const,
    label: 'Your Goals',
    icon: '◈',
  },
]

export default function Sidebar() {
  const activeView = useAppStore((s) => s.activeView)
  const setActiveView = useAppStore((s) => s.setActiveView)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNav = (id: typeof NAV_ITEMS[number]['id']) => {
    setActiveView(id)
    setMobileOpen(false)
  }

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="sidebar-hamburger"
        onClick={() => setMobileOpen(true)}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 60,
          background: 'rgba(10,10,26,0.7)',
          border: '1px solid rgba(244,208,63,0.3)',
          borderRadius: '6px',
          width: '36px',
          height: '36px',
          cursor: 'pointer',
          color: 'rgba(244,208,63,0.85)',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}
      >
        ☰
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 70,
            }}
          />
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.nav
        className="sidebar-desktop"
        animate={{ width: collapsed ? 56 : 200 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          background: 'rgba(8,6,18,0.85)',
          borderRight: '1px solid rgba(244,208,63,0.12)',
          backdropFilter: 'blur(12px)',
          zIndex: 60,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '70px',
          overflow: 'hidden',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id ||
            (item.id === 'universe' && (activeView === 'goalPlanet' || activeView === 'storyPlanet' || activeView === 'roseView'))
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              title={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                background: isActive ? 'rgba(244,208,63,0.1)' : 'transparent',
                border: 'none',
                borderLeft: isActive ? '2px solid rgba(244,208,63,0.7)' : '2px solid transparent',
                cursor: 'pointer',
                color: isActive ? 'rgba(244,208,63,0.95)' : 'rgba(240,232,210,0.5)',
                fontSize: '14px',
                fontFamily: "'Cormorant Garamond', serif",
                textAlign: 'left',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                width: '100%',
              }}
            >
              <span style={{ fontSize: '18px', minWidth: '20px', textAlign: 'center' }}>
                {item.icon}
              </span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )
        })}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand' : 'Collapse'}
          style={{
            marginTop: 'auto',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(240,232,210,0.3)',
            fontSize: '16px',
          }}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </motion.nav>

      {/* Mobile slide-in sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ x: -220 }}
            animate={{ x: 0 }}
            exit={{ x: -220 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100vh',
              width: '220px',
              background: 'rgba(8,6,18,0.97)',
              borderRight: '1px solid rgba(244,208,63,0.15)',
              zIndex: 80,
              display: 'flex',
              flexDirection: 'column',
              paddingTop: '70px',
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 20px',
                    background: isActive ? 'rgba(244,208,63,0.1)' : 'transparent',
                    border: 'none',
                    borderLeft: isActive ? '2px solid rgba(244,208,63,0.7)' : '2px solid transparent',
                    cursor: 'pointer',
                    color: isActive ? 'rgba(244,208,63,0.95)' : 'rgba(240,232,210,0.6)',
                    fontSize: '15px',
                    fontFamily: "'Cormorant Garamond', serif",
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '18px', minWidth: '20px' }}>{item.icon}</span>
                  {item.label}
                </button>
              )
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
