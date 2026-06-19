"use client"

import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  PERSIAN_WEEKDAYS,
  PERSIAN_MONTHS,
  getWeekDays,
  toPersianDigits,
  jalaliWeekdayIndex,
  parseISO,
} from "@/lib/jalali"
import { getHoliday, isFriday } from "@/lib/jalali-holidays"
import type { Task } from "@/lib/tasks"
import { TaskItem } from "@/components/task-item"

interface WeeklyCalendarProps {
  anchorIso: string
  todayIso: string
  selectedIso: string | null
  tasksByDate: Map<string, Task[]>
  onSelectDay: (iso: string) => void
  onAddTask: (iso: string) => void
  onEditTask: (task: Task) => void
  onToggleTask: (id: string) => void
}

export function WeeklyCalendar({
  anchorIso,
  todayIso,
  selectedIso,
  tasksByDate,
  onSelectDay,
  onAddTask,
  onEditTask,
  onToggleTask,
}: WeeklyCalendarProps) {
  const days = getWeekDays(anchorIso)

  return (
    <div className="flex min-h-[calc(100vh-180px)] animate-in flex-col gap-2.5 fade-in-0 slide-in-from-bottom-1 duration-200 ease-out motion-reduce:animate-none">
      {days.map((day, index) => {
        const tasks = tasksByDate.get(day.iso) ?? []
        const isToday = day.iso === todayIso
        const isSelected = day.iso === selectedIso
        const holiday = getHoliday(day.jm, day.jd)
        const friday = isFriday(jalaliWeekdayIndex(day.iso))
        const isHoliday = Boolean(holiday) || friday
        const { gy, gm, gd } = parseISO(day.iso)

        return (
          <div
            key={day.iso}
            role="button"
            tabIndex={0}
            onClick={() => onSelectDay(day.iso)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onSelectDay(day.iso)
              }
            }}
            className={cn(
              "group flex flex-1 cursor-pointer flex-col gap-2 rounded-xl border bg-card p-3 text-right transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.995] motion-reduce:transform-none motion-reduce:transition-none sm:flex-row sm:items-stretch sm:gap-4",
              isToday && "border-primary/40 bg-primary/5",
              isHoliday && !isToday && "border-destructive/30 bg-destructive/5",
              isSelected &&
                "border-2 border-primary ring-1 ring-primary/30",
            )}
          >
            {/* Day label column */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-border sm:w-44 sm:flex-col sm:items-start sm:justify-center sm:border-s sm:ps-4">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full text-base font-bold tabular-nums",
                    isToday
                      ? "bg-primary text-primary-foreground"
                      : isHoliday
                        ? "text-destructive"
                        : "text-foreground",
                  )}
                >
                  {toPersianDigits(day.jd)}
                </span>
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      isHoliday ? "text-destructive" : "text-foreground",
                    )}
                  >
                    {PERSIAN_WEEKDAYS[index]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {PERSIAN_MONTHS[day.jm - 1]} {toPersianDigits(day.jy)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-0.5 sm:items-start">
                <span className="text-[11px] text-muted-foreground/70 tabular-nums">
                  {`${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`}
                </span>
                {holiday && (
                  <span className="text-[11px] font-medium text-destructive">
                    {holiday.title}
                  </span>
                )}
              </div>
            </div>

            {/* Tasks area */}
            <div className="flex min-w-0 flex-1 flex-wrap content-start gap-2 overflow-y-auto">
              {tasks.length === 0 ? (
                <p className="flex items-center py-2 text-xs text-muted-foreground/70">
                  کاری ثبت نشده
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="w-full sm:w-auto sm:min-w-48 sm:max-w-64"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <TaskItem
                      task={task}
                      onToggle={() => onToggleTask(task.id)}
                      onEdit={() => onEditTask(task)}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Add button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onAddTask(day.iso)
              }}
              className="flex shrink-0 items-center justify-center gap-1 self-start rounded-md border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="size-3.5" />
              افزودن کار
            </button>
          </div>
        )
      })}
    </div>
  )
}
