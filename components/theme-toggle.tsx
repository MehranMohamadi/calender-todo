"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

const THEME_KEY = "jalali-calendar-theme"

export function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY)
    const shouldUseDark = saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches

    document.documentElement.classList.toggle("dark", shouldUseDark)
    document.documentElement.classList.toggle("light", !shouldUseDark)
    setDark(shouldUseDark)
    setMounted(true)
  }, [])

  function toggleTheme() {
    const next = !dark
    document.documentElement.classList.toggle("dark", next)
    document.documentElement.classList.toggle("light", !next)
    localStorage.setItem(THEME_KEY, next ? "dark" : "light")
    setDark(next)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      aria-label={dark ? "فعال‌کردن تم روشن" : "فعال‌کردن تم تاریک"}
      title={dark ? "تم روشن" : "تم تاریک"}
    >
      {mounted && dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
