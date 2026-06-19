"use client"

import { CalendarDays, ListTodo } from "lucide-react"
import { cn } from "@/lib/utils"

export type AppPage = "calendar" | "tasks"

interface AppBottomNavProps {
  page: AppPage
  onChange: (page: AppPage) => void
}

const ITEMS = [
  { value: "calendar" as const, label: "تقویم", icon: CalendarDays },
  { value: "tasks" as const, label: "کارها", icon: ListTodo },
]

export function AppBottomNav({ page, onChange }: AppBottomNavProps) {
  return (
    <nav
      aria-label="ناوبری اصلی"
      className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-sm isolate rounded-2xl border border-primary/15 bg-card p-1.5 shadow-lg"
    >
      {ITEMS.map((item) => {
        const Icon = item.icon
        const active = page === item.value
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors duration-150 motion-reduce:transition-none",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4.5" />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
