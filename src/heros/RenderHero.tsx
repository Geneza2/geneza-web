import React from 'react'

import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  try {
    if (!props) {
      console.warn('RenderHero: No props provided')
      return null
    }

    const { type } = props

    if (!type || type === 'none') {
      return null
    }

    const HeroToRender = heroes[type as keyof typeof heroes]

    if (!HeroToRender) {
      console.error('Hero component not found for type:', type)
      return null
    }

    return <HeroToRender {...props} />
  } catch (error) {
    console.error('Error rendering hero:', error)
    return null
  }
}
