"use client"

import { cn } from "@/lib/utils"

export type TaskFilter = "all" | "done" | "todo"

interface TaskFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  filter: TaskFilter
  onFilterChange: (filter: TaskFilter) => void
}

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "همه" },
  { value: "done", label: "انجام‌شده" },
  { value: "todo", label: "انجام‌نشده" },
]

export function TaskFilters({
  search,
  onSearchChange,
  filter,
  onFilterChange,
}: TaskFiltersProps) {
  return (
    <div className="flex items-center">
      <div className="inline-flex rounded-lg border border-primary/10 bg-card/70 p-0.5 shadow-xs backdrop-blur-sm">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => onFilterChange(f.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
              filter === f.value
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}
