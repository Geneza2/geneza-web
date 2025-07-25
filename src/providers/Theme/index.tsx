'use client'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

import _canUseDOM from '@/utilities/canUseDOM'
import {
  defaultTheme as _defaultTheme,
  getImplicitPreference as _getImplicitPreference,
  themeLocalStorageKey as _themeLocalStorageKey,
} from './shared'
import { themeIsValid as _themeIsValid } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light')

  const setTheme = useCallback((_themeToSet: Theme | null) => {
    setThemeState('light')
    document.documentElement.setAttribute('data-theme', 'light')
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')
    setThemeState('light')
  }, [])

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
