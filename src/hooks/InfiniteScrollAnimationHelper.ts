import React from 'react'

interface InfiniteScrollAnimationReturn {
  duplicatedCount: number
  animationStyle: React.CSSProperties
  pauseClassName: string | undefined
}

export function InfiniteScrollAnimation(): InfiniteScrollAnimationReturn {
  const duplicatedCount = 2

  const animationStyle: React.CSSProperties = {
    animationDuration: '25s',
    animationDirection: 'normal',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  }

  const pauseClassName = 'hover:[animation-play-state:paused]'

  return {
    duplicatedCount,
    animationStyle,
    pauseClassName,
  }
}
