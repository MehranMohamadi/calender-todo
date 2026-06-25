"use client"

import { CalendarDays, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ViewSwitcher, type CalendarView } from "@/components/view-switcher"
import { ThemeToggle } from "@/components/theme-toggle"

interface CalendarHeaderProps {
  title: string
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export function CalendarHeader({
  title,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  return (
    <header className="persian-header relative flex flex-col gap-2 overflow-hidden rounded-lg border border-primary/10 bg-card/80 p-2.5 shadow-sm backdrop-blur-sm sm:px-3">
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm shadow-primary/15">
            <CalendarDays className="size-3.5" />
          </span>
          <h1 className="truncate text-xs font-semibold text-foreground sm:text-sm">
            تقویم کارهای من
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <ViewSwitcher view={view} onChange={onViewChange} />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between gap-2 border-t border-primary/10 pt-2">
        <h2 className="truncate text-sm font-semibold text-foreground sm:text-base">
          {title}
        </h2>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={onPrev}
            aria-label="قبلی"
          >
            <ChevronRight className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={onNext}
            aria-label="بعدی"
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          <Button variant="secondary" size="sm" onClick={onToday} className="ms-1">
            امروز
          </Button>
        </div>
      </div>
    </header>
  )
}
