"use client"

import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { toPersianDigits, jalaliWeekdayIndex } from "@/lib/jalali"
import type { CalendarDay } from "@/lib/jalali"
import type { Task } from "@/lib/tasks"
import { getHoliday, isFriday } from "@/lib/jalali-holidays"
import { TaskItem } from "@/components/task-item"

const MAX_VISIBLE = 3

interface DayCellProps {
  day: CalendarDay
  tasks: Task[]
  isToday: boolean
  isSelected: boolean
  onSelect: () => void
  onAddTask: () => void
  onEditTask: (task: Task) => void
  onToggleTask: (id: string) => void
}

export function DayCell({
  day,
  tasks,
  isToday,
  isSelected,
  onSelect,
  onAddTask,
  onEditTask,
  onToggleTask,
}: DayCellProps) {
  const visible = tasks.slice(0, MAX_VISIBLE)
  const remaining = tasks.length - visible.length

  const holiday = getHoliday(day.jm, day.jd)
  const friday = isFriday(jalaliWeekdayIndex(day.iso))
  const isHoliday = Boolean(holiday) || friday

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      className={cn(
        "group relative flex min-h-16 min-w-0 cursor-pointer flex-col gap-0.5 rounded-lg border bg-card p-1 text-right transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none sm:min-h-32 sm:gap-1 sm:rounded-xl sm:p-2",
        day.inCurrentMonth ? "border-border" : "border-transparent bg-muted/40",
        isHoliday &&
          day.inCurrentMonth &&
          "border-destructive/30 bg-destructive/5",
        isSelected && "ring-2 ring-primary ring-offset-1 ring-offset-background",
      )}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onAddTask()
          }}
          aria-label="افزودن کار"
          className="hidden size-5 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-primary hover:text-primary-foreground group-hover:opacity-100 sm:flex"
        >
          <Plus className="size-3.5" />
        </button>

        <span
          className={cn(
            "flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums sm:size-7 sm:text-sm",
            isToday
              ? "bg-primary text-primary-foreground"
              : !day.inCurrentMonth
                ? "text-muted-foreground/60"
                : isHoliday
                  ? "text-destructive"
                  : "text-foreground",
          )}
        >
          {toPersianDigits(day.jd)}
        </span>
      </div>

      {holiday && day.inCurrentMonth && (
        <p
          className="hidden truncate text-[10px] leading-tight text-destructive sm:block"
          title={holiday.title}
        >
          {holiday.title}
        </p>
      )}

      {tasks.length > 0 && (
        <div
          className="mt-auto flex items-center justify-center gap-0.5 overflow-hidden sm:hidden"
          aria-label={`${toPersianDigits(tasks.length)} کار`}
        >
          {tasks.slice(0, 3).map((task) => (
            <span
              key={task.id}
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                task.completed
                  ? "bg-muted-foreground/40"
                  : task.priority === "high"
                    ? "bg-destructive"
                    : task.priority === "medium"
                      ? "bg-warning"
                      : "bg-success",
              )}
            />
          ))}
          {tasks.length > 3 && (
            <span className="text-[8px] leading-none text-muted-foreground">
              +{toPersianDigits(tasks.length - 3)}
            </span>
          )}
        </div>
      )}

      <div className="hidden flex-col gap-1 overflow-hidden sm:flex">
        {visible.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            compact
            onToggle={() => onToggleTask(task.id)}
            onEdit={() => onEditTask(task)}
          />
        ))}
        {remaining > 0 && (
          <span className="px-1 text-[11px] text-muted-foreground">
            {`+${toPersianDigits(remaining)} مورد دیگر`}
          </span>
        )}
      </div>
    </div>
  )
}
