'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/utilities/ui'

type StatisticItem = {
  id?: string
  number: number
  suffix?: string
  label: string
}

export type StatisticsProps = {
  blockName?: string
  blockType: 'statistics'
  title?: string
  subtitle?: string
  statistics: StatisticItem[]
  animationDuration?: number
  className?: string
}

const useCountUp = (end: number, duration: number = 2000, start: number = 0) => {
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * (end - start) + start)

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration, start, isVisible])

  return { count, ref }
}

const getColorClasses = () => {
  return 'bg-gradient-to-br from-[#9BC273] to-[#8AB162] bg-clip-text text-transparent'
}

export const Statistics: React.FC<StatisticsProps> = ({
  title,
  subtitle,
  statistics,
  animationDuration = 2000,
  className,
}) => {
  return (
    <div className={cn('py-16 sm:py-20 lg:py-24', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12 lg:mb-16">
            {subtitle && (
              <p className="text-sm font-semibold text-[#9BC273] uppercase tracking-wide mb-3">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight flex items-center justify-center">
                <div className="w-8 h-0.5 bg-[#9BC273] mr-3"></div>
                {title}
                <div className="w-8 h-0.5 bg-[#9BC273] ml-3"></div>
              </h2>
            )}
          </div>
        )}

        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20">
          {statistics.map((stat, index) => (
            <StatisticCard
              key={stat.id || index}
              statistic={stat}
              animationDuration={animationDuration}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const StatisticCard: React.FC<{
  statistic: StatisticItem
  animationDuration: number
}> = ({ statistic, animationDuration }) => {
  const { count, ref } = useCountUp(statistic.number, animationDuration)
  const colorClass = getColorClasses()

  return (
    <div ref={ref} className="text-center">
      <div className={cn('text-4xl sm:text-5xl lg:text-6xl font-bold mb-3', colorClass)}>
        {count.toLocaleString()}
        {statistic.suffix && (
          <span className="text-3xl sm:text-4xl lg:text-5xl">{statistic.suffix}</span>
        )}
      </div>
      <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
        {statistic.label}
      </p>
    </div>
  )
}

export default Statistics
