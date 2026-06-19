"use client"

import { PERSIAN_WEEKDAYS, getMonthGrid } from "@/lib/jalali"
import type { Task } from "@/lib/tasks"
import { DayCell } from "@/components/day-cell"

interface MonthlyCalendarProps {
  jy: number
  jm: number
  todayIso: string
  selectedIso: string | null
  tasksByDate: Map<string, Task[]>
  onSelectDay: (iso: string) => void
  onAddTask: (iso: string) => void
  onEditTask: (task: Task) => void
  onToggleTask: (id: string) => void
}

export function MonthlyCalendar({
  jy,
  jm,
  todayIso,
  selectedIso,
  tasksByDate,
  onSelectDay,
  onAddTask,
  onEditTask,
  onToggleTask,
}: MonthlyCalendarProps) {
  const days = getMonthGrid(jy, jm)

  return (
    <div className="flex min-w-0 animate-in flex-col gap-1.5 fade-in-0 slide-in-from-bottom-1 duration-200 ease-out motion-reduce:animate-none sm:gap-2">
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {PERSIAN_WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="min-w-0 truncate py-1 text-center text-[10px] font-medium text-muted-foreground sm:text-sm"
          >
            {wd}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((day) => (
          <DayCell
            key={day.iso}
            day={day}
            tasks={tasksByDate.get(day.iso) ?? []}
            isToday={day.iso === todayIso}
            isSelected={day.iso === selectedIso}
            onSelect={() => onSelectDay(day.iso)}
            onAddTask={() => onAddTask(day.iso)}
            onEditTask={onEditTask}
            onToggleTask={onToggleTask}
          />
        ))}
      </div>
    </div>
  )
}
