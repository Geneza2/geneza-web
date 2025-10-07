'use client'

import React from 'react'
import { cn } from '@/utilities/ui'

type Props = {
  src: string
  className?: string
  type?: string
  startOffsetSeconds?: number // skip first N seconds to avoid intro frames
  cutoffSeconds?: number // skip last N seconds before restarting
  overlapSeconds?: number // overlap to hide seam
}

export const BackgroundVideo: React.FC<Props> = ({
  src,
  className,
  type = 'video/webm',
  startOffsetSeconds = 0.05,
  cutoffSeconds = 0.5,
  overlapSeconds = 0.3,
}) => {
  const v1 = React.useRef<HTMLVideoElement | null>(null)
  const v2 = React.useRef<HTMLVideoElement | null>(null)
  const [showB, setShowB] = React.useState(false)

  React.useEffect(() => {
    const a = v1.current
    const b = v2.current
    if (!a || !b) return

    const playFromStart = (el: HTMLVideoElement) => {
      try {
        el.currentTime = Math.max(0.001, startOffsetSeconds)
        void el.play()
      } catch {}
    }

    const handleA = () => {
      if (!a.duration) return
      const remaining = a.duration - a.currentTime
      if (remaining < cutoffSeconds) {
        b.currentTime = Math.max(0.001, startOffsetSeconds)
        void b.play()
        setShowB(true)
        window.setTimeout(
          () => {
            a.pause()
            a.currentTime = Math.max(0.001, startOffsetSeconds)
          },
          Math.max(10, overlapSeconds * 1000),
        )
      }
    }

    const handleB = () => {
      if (!b.duration) return
      const remaining = b.duration - b.currentTime
      if (remaining < cutoffSeconds) {
        a.currentTime = Math.max(0.001, startOffsetSeconds)
        void a.play()
        setShowB(false)
        window.setTimeout(
          () => {
            b.pause()
            b.currentTime = Math.max(0.001, startOffsetSeconds)
          },
          Math.max(10, overlapSeconds * 1000),
        )
      }
    }

    const onLoaded = () => {
      playFromStart(a)
      b.currentTime = Math.max(0.001, startOffsetSeconds)
    }

    a.addEventListener('timeupdate', handleA)
    b.addEventListener('timeupdate', handleB)
    a.addEventListener('loadedmetadata', onLoaded)
    return () => {
      a.removeEventListener('timeupdate', handleA)
      b.removeEventListener('timeupdate', handleB)
      a.removeEventListener('loadedmetadata', onLoaded)
    }
  }, [])

  return (
    <div className={cn('w-full h-full relative', className)}>
      <video
        ref={v1}
        className={cn(
          'absolute inset-0 w-full h-full object-cover transition-opacity duration-0 will-change-opacity',
          showB ? 'opacity-0' : 'opacity-100',
        )}
        autoPlay
        muted
        playsInline
        preload="auto"
      >
        <source src={src} type={type} />
      </video>
      <video
        ref={v2}
        className={cn(
          'absolute inset-0 w-full h-full object-cover transition-opacity duration-0 will-change-opacity',
          showB ? 'opacity-100' : 'opacity-0',
        )}
        autoPlay
        muted
        playsInline
        preload="auto"
      >
        <source src={src} type={type} />
      </video>
    </div>
  )
}
