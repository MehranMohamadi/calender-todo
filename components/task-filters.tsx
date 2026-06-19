"use client"

import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    

      <div className="inline-flex rounded-lg border bg-muted/50 p-0.5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => onFilterChange(f.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              filter === f.value
                ? "bg-card text-foreground shadow-sm"
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
