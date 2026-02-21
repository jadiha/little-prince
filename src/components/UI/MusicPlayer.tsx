import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const MUTE_KEY = 'lp-music-muted'

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem(MUTE_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [started, setStarted] = useState(false)

  // Start audio on first user interaction if not muted
  useEffect(() => {
    const handleFirstClick = () => {
      if (!started && !muted && audioRef.current) {
        audioRef.current.volume = 0
        audioRef.current.play().then(() => {
          setStarted(true)
          fadeIn()
        }).catch(() => {/* autoplay blocked */})
      }
    }
    document.addEventListener('click', handleFirstClick, { once: true })
    return () => document.removeEventListener('click', handleFirstClick)
  }, [started, muted])

  const fadeIn = () => {
    if (!audioRef.current) return
    let vol = 0
    const interval = setInterval(() => {
      if (!audioRef.current) return clearInterval(interval)
      vol = Math.min(vol + 0.02, 0.25)
      audioRef.current.volume = vol
      if (vol >= 0.25) clearInterval(interval)
    }, 80)
  }

  const fadeOut = () => {
    if (!audioRef.current) return
    let vol = audioRef.current.volume
    const interval = setInterval(() => {
      if (!audioRef.current) return clearInterval(interval)
      vol = Math.max(vol - 0.02, 0)
      audioRef.current.volume = vol
      if (vol <= 0) {
        audioRef.current.pause()
        clearInterval(interval)
      }
    }, 80)
  }

  const toggle = () => {
    const next = !muted
    setMuted(next)
    localStorage.setItem(MUTE_KEY, String(next))

    if (next) {
      fadeOut()
    } else {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setStarted(true)
          fadeIn()
        }).catch(() => {/* blocked */})
      }
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/assets/music.mp3" loop preload="none" />
      <motion.button
        onClick={toggle}
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 50,
          background: 'rgba(10,10,26,0.6)',
          border: '1px solid rgba(244,208,63,0.3)',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: muted ? 'rgba(244,208,63,0.3)' : 'rgba(244,208,63,0.85)',
          fontSize: '15px',
          backdropFilter: 'blur(4px)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={muted ? 'Play music' : 'Mute music'}
      >
        {muted ? '♪̶' : '♪'}
      </motion.button>
    </>
  )
}
