"use client"

import { CalendarDays, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ViewSwitcher, type CalendarView } from "@/components/view-switcher"

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
    <header className="persian-header relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-primary/10 bg-card/85 p-3 shadow-sm backdrop-blur-sm sm:px-4">
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/20">
            <CalendarDays className="size-4" />
          </span>
          <h1 className="truncate text-sm font-bold text-foreground sm:text-base">
            تقویم کارهای من
          </h1>
        </div>
        <ViewSwitcher view={view} onChange={onViewChange} />
      </div>

      <div className="relative z-10 flex items-center justify-between gap-3 border-t border-primary/10 pt-3">
        <h2 className="truncate text-base font-bold text-foreground sm:text-lg">
          {title}
        </h2>

        <div className="flex shrink-0 items-center gap-1">
          {/* In RTL, "next" sits on the left, "prev" on the right */}
          <Button
            variant="outline"
            size="icon-sm"
            onClick={onPrev}
            aria-label="قبلی"
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={onNext}
            aria-label="بعدی"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={onToday} className="ms-1">
            امروز
          </Button>
        </div>

      </div>
    </header>
  )
}
