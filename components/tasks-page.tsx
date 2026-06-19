"use client"

import { useMemo } from "react"
import { CalendarDays, Check, ClipboardList, Pencil, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskFilters, type TaskFilter } from "@/components/task-filters"
import { cn } from "@/lib/utils"
import { formatFullDate } from "@/lib/jalali"
import {
  PRIORITY_LABELS,
  readableTextColor,
  type Priority,
  type Task,
} from "@/lib/tasks"

interface TasksPageProps {
  tasks: Task[]
  loaded: boolean
  search: string
  filter: TaskFilter
  onSearchChange: (value: string) => void
  onFilterChange: (filter: TaskFilter) => void
  onAdd: () => void
  onEdit: (task: Task) => void
  onToggle: (id: string) => void
}

const PRIORITY_WEIGHT: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

export function TasksPage({
  tasks,
  loaded,
  search,
  filter,
  onSearchChange,
  onFilterChange,
  onAdd,
  onEdit,
  onToggle,
}: TasksPageProps) {
  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return tasks
      .filter((task) => {
        if (filter === "done" && !task.completed) return false
        if (filter === "todo" && task.completed) return false
        return (
          !query ||
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
        )
      })
      .sort((a, b) => {
        const byDate = a.date.localeCompare(b.date)
        if (byDate !== 0) return byDate
        if (a.completed !== b.completed) return a.completed ? 1 : -1
        return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
      })
  }, [filter, search, tasks])

  return (
    <section className="flex animate-in flex-col gap-4 fade-in-0 slide-in-from-left-2 duration-200 motion-reduce:animate-none">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">همهٔ کارها</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            مدیریت کارها فارغ از نمای تقویم
          </p>
        </div>
        <Button onClick={onAdd} className="gap-1.5">
          <Plus className="size-4" />
          افزودن کار
        </Button>
      </header>

      <TaskFilters
        search={search}
        onSearchChange={onSearchChange}
        filter={filter}
        onFilterChange={onFilterChange}
      />

      {!loaded ? (
        <div className="rounded-2xl border bg-card/60 py-20 text-center text-muted-foreground">
          در حال بارگذاری...
        </div>
      ) : visibleTasks.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card/50 px-4 py-16 text-center">
          <ClipboardList className="mb-3 size-9 text-primary/50" />
          <p className="font-medium text-foreground">کاری پیدا نشد</p>
          <p className="mt-1 text-sm text-muted-foreground">
            فیلتر یا عبارت جستجو را تغییر دهید.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTasks.map((task) => (
            <article
              key={task.id}
              className={cn(
                "group flex min-w-0 flex-col gap-3 rounded-2xl border bg-card/85 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none",
                task.completed && "bg-muted/55",
              )}
            >
              <div className="flex items-start gap-2.5">
                <button
                  type="button"
                  onClick={() => onToggle(task.id)}
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                    task.completed
                      ? "border-success bg-success text-white"
                      : "border-muted-foreground/40 text-transparent hover:border-primary",
                  )}
                  aria-label={task.completed ? "علامت‌گذاری به‌عنوان انجام‌نشده" : "انجام شد"}
                >
                  <Check className="size-3" strokeWidth={3} />
                </button>

                <div className="min-w-0 flex-1">
                  <h3
                    className={cn(
                      "font-semibold text-foreground",
                      task.completed && "text-muted-foreground line-through",
                    )}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {task.description}
                    </p>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEdit(task)}
                  aria-label={`ویرایش ${task.title}`}
                  className="shrink-0"
                >
                  <Pencil className="size-3.5" />
                </Button>
              </div>

              <div className="mt-auto flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2 py-1 text-[11px] font-medium text-primary">
                  <CalendarDays className="size-3" />
                  {formatFullDate(task.date)}
                </span>
                <span className="rounded-full bg-secondary px-2 py-1 text-[11px] text-secondary-foreground">
                  اولویت {PRIORITY_LABELS[task.priority]}
                </span>
                {task.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full px-2 py-1 text-[10px] font-medium"
                    style={{
                      backgroundColor: tag.color,
                      color: readableTextColor(tag.color),
                    }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
