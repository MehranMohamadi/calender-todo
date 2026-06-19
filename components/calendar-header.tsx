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
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <CalendarDays className="size-5" />
          </span>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            تقویم کارهای من
          </h1>
        </div>
        <ViewSwitcher view={view} onChange={onViewChange} />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {/* In RTL, "next" sits on the left, "prev" on the right */}
          <Button
            variant="outline"
            size="icon"
            onClick={onPrev}
            aria-label="قبلی"
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            aria-label="بعدی"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="secondary" onClick={onToday} className="ms-1">
            امروز
          </Button>
        </div>

        <h2 className="text-lg font-bold text-foreground sm:text-xl">
          {title}
        </h2>
      </div>
    </header>
  )
}
