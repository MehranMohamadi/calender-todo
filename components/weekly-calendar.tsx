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
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
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
              "group flex min-w-0 cursor-pointer flex-col gap-2 rounded-xl border bg-card p-2 text-right transition-shadow duration-150 hover:shadow-sm motion-reduce:transition-none sm:p-3",
              isToday && "border-primary/40 bg-primary/5",
              isHoliday && !isToday && "border-destructive/30 bg-destructive/5",
              isSelected &&
                "border-2 border-primary ring-1 ring-primary/30",
            )}
          >
            {/* Day label column */}
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-sm font-bold tabular-nums",
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

              <div className="flex min-w-0 flex-col items-end gap-0.5">
                <span className="hidden text-[10px] text-muted-foreground/70 tabular-nums sm:block">
                  {`${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`}
                </span>
                {holiday && (
                  <span className="max-w-24 truncate text-[10px] font-medium text-destructive" title={holiday.title}>
                    {holiday.title}
                  </span>
                )}
              </div>
            </div>

            {/* Tasks area */}
            <div className="flex max-h-28 min-h-10 min-w-0 flex-1 flex-col gap-1.5 overflow-y-auto">
              {tasks.length === 0 ? (
                <p className="flex items-center py-2 text-xs text-muted-foreground/70">
                  کاری ثبت نشده
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="w-full"
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
              className="flex w-full shrink-0 items-center justify-center gap-1 rounded-md border border-dashed border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
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
