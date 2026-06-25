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
    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
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
              "group flex min-w-0 cursor-pointer flex-col gap-1.5 rounded-md border bg-card p-1.5 text-right transition-shadow duration-150 hover:shadow-sm motion-reduce:transition-none sm:p-2",
              isToday && "border-primary/40 bg-primary/5",
              isHoliday && !isToday && "border-destructive/30 bg-destructive/5",
              isSelected && "border-primary ring-1 ring-primary/30",
            )}
          >
            <div className="flex shrink-0 items-center justify-between gap-1.5 border-b border-border pb-1.5">
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                    isToday
                      ? "bg-primary text-primary-foreground"
                      : isHoliday
                        ? "text-destructive"
                        : "text-foreground",
                  )}
                >
                  {toPersianDigits(day.jd)}
                </span>
                <div className="flex min-w-0 flex-col">
                  <span
                    className={cn(
                      "truncate text-xs font-semibold",
                      isHoliday ? "text-destructive" : "text-foreground",
                    )}
                  >
                    {PERSIAN_WEEKDAYS[index]}
                  </span>
                  <span className="truncate text-[10px] text-muted-foreground">
                    {PERSIAN_MONTHS[day.jm - 1]} {toPersianDigits(day.jy)}
                  </span>
                </div>
              </div>

              <div className="flex min-w-0 flex-col items-end gap-0.5">
                <span className="hidden text-[9px] text-muted-foreground/70 tabular-nums sm:block">
                  {`${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`}
                </span>
                {holiday && (
                  <span
                    className="max-w-20 truncate text-[9px] font-medium text-destructive"
                    title={holiday.title}
                  >
                    {holiday.title}
                  </span>
                )}
              </div>
            </div>

            <div className="flex max-h-24 min-h-8 min-w-0 flex-1 flex-col gap-1 overflow-y-auto">
              {tasks.length === 0 ? (
                <p className="flex items-center py-1.5 text-[11px] text-muted-foreground/70">
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

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onAddTask(day.iso)
              }}
              className="flex w-full shrink-0 items-center justify-center gap-1 rounded-sm border border-dashed border-border px-2 py-1 text-[10px] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="size-3" />
              افزودن کار
            </button>
          </div>
        )
      })}
    </div>
  )
}
