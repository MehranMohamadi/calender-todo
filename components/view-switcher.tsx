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
    <div className="inline-flex rounded-lg border bg-muted/50 p-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
            view === opt.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
