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
    <div className="flex min-w-0 flex-col gap-1">
      <div className="grid grid-cols-7 gap-1">
        {PERSIAN_WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="min-w-0 truncate py-0.5 text-center text-[10px] font-medium text-muted-foreground sm:text-xs"
          >
            {wd}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
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
