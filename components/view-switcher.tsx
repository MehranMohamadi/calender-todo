"use client"

import { cn } from "@/lib/utils"

export type CalendarView = "month" | "week"

interface ViewSwitcherProps {
  view: CalendarView
  onChange: (view: CalendarView) => void
}

const OPTIONS: { value: CalendarView; label: string }[] = [
  { value: "month", label: "ماهانه" },
  { value: "week", label: "هفتگی" },
]

export function ViewSwitcher({ view, onChange }: ViewSwitcherProps) {
  return (
    <div className="inline-flex shrink-0 rounded-lg border border-primary/10 bg-muted/60 p-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 sm:px-3",
            view === opt.value
              ? "bg-card text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
