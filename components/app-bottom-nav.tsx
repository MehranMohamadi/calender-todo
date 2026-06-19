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
      className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-primary/15 bg-card/90 p-1.5 shadow-xl shadow-primary/10 backdrop-blur-xl"
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
              "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 motion-reduce:transition-none",
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
