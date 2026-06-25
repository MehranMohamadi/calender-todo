"use client"

import { useEffect, useState } from "react"
import { Download, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PwaInstaller() {
  const [installPrompt, setInstallPrompt] =
    useState<InstallPromptEvent | null>(null)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    setOffline(!navigator.onLine)

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // The app remains usable if service worker registration is unavailable.
      })
    }

    const handlePrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
    }
    const handleInstalled = () => setInstallPrompt(null)
    const handleOnline = () => setOffline(false)
    const handleOffline = () => setOffline(true)

    window.addEventListener("beforeinstallprompt", handlePrompt)
    window.addEventListener("appinstalled", handleInstalled)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt)
      window.removeEventListener("appinstalled", handleInstalled)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  async function install() {
    if (!installPrompt) return
    await installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  if (!installPrompt && !offline) return null

  return (
    <div className="fixed bottom-3 left-3 z-40 flex items-center gap-1.5">
      {offline && (
        <div
          role="status"
          className="inline-flex h-7 items-center gap-1.5 rounded-md border bg-card px-2 text-[11px] font-medium text-muted-foreground shadow-sm"
        >
          <WifiOff className="size-3.5" />
          آفلاین
        </div>
      )}

      {installPrompt && (
        <Button
          type="button"
          size="sm"
          onClick={install}
          className="gap-1 shadow-sm"
          aria-label="نصب تقویم روی دستگاه"
        >
          <Download className="size-3.5" />
          نصب
        </Button>
      )}
    </div>
  )
}
