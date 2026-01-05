// src/theme/ThemeProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react"
import { applyTheme, getSystemTheme, watchSystemTheme } from "../utils"
import { loadThemeMode, saveThemeMode } from "../storage"
import type { Theme } from "../types"

type ThemeContextValue = {
  theme: Theme
  setTheme: (mode: Theme) => void;
  currentTheme: 'light' | 'dark'; // The actual resolved theme (if system)
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system")
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    loadThemeMode().then(saved => {
      if (saved) setTheme(saved)
    })
  }, [])

  useEffect(() => {
    let cleanup: (() => void) | undefined

    if (theme === "system") {
      setCurrentTheme(getSystemTheme())
      applyTheme(getSystemTheme())
      cleanup = watchSystemTheme(applyTheme)
    } else {
      applyTheme(theme)
    }

    saveThemeMode(theme)
    return cleanup
  }, [theme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
