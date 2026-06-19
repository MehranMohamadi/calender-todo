"use client"

import { useMemo, useState } from "react"
import {
  todayISO,
  todayJalali,
  isoToJalali,
  formatMonthYear,
  formatWeekRange,
  getWeekDays,
  jalaaliMonthShift,
  addDaysToJalali,
} from "@/lib/jalali"
import { useTasks, type Task, type Priority, type Tag } from "@/lib/tasks"
import { CalendarHeader } from "@/components/calendar-header"
import { MonthlyCalendar } from "@/components/monthly-calendar"
import { WeeklyCalendar } from "@/components/weekly-calendar"
import { TaskFilters, type TaskFilter } from "@/components/task-filters"
import { TaskDialog, type TaskDialogState } from "@/components/task-dialog"
import type { CalendarView } from "@/components/view-switcher"

export function CalendarApp() {
  const { tasks, loaded, addTask, updateTask, deleteTask, toggleTask } =
    useTasks()

  const today = todayISO()
  const todayJ = todayJalali()

  const [view, setView] = useState<CalendarView>("month")
  // Month view anchor (Jalali year + month)
  const [anchor, setAnchor] = useState({ jy: todayJ.jy, jm: todayJ.jm })
  // Week view anchor (any ISO date within the week)
  const [weekAnchor, setWeekAnchor] = useState(today)
  const [selectedIso, setSelectedIso] = useState<string | null>(today)

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<TaskFilter>("all")

  const [dialog, setDialog] = useState<TaskDialogState>({
    open: false,
    date: null,
    task: null,
  })

  // Filtered tasks grouped by date for fast cell lookup.
  const tasksByDate = useMemo(() => {
    const q = search.trim().toLowerCase()
    const map = new Map<string, Task[]>()
    for (const task of tasks) {
      if (filter === "done" && !task.completed) continue
      if (filter === "todo" && task.completed) continue
      if (
        q &&
        !task.title.toLowerCase().includes(q) &&
        !(task.description?.toLowerCase().includes(q) ?? false)
      ) {
        continue
      }
      const list = map.get(task.date) ?? []
      list.push(task)
      map.set(task.date, list)
    }
    // Stable order: incomplete first, then by priority weight.
    const weight: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
    for (const list of map.values()) {
      list.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1
        return weight[a.priority] - weight[b.priority]
      })
    }
    return map
  }, [tasks, search, filter])

  const title =
    view === "month"
      ? formatMonthYear(anchor.jy, anchor.jm)
      : formatWeekRange(getWeekDays(weekAnchor))

  function handlePrev() {
    if (view === "month") {
      setAnchor((a) => jalaaliMonthShift(a.jy, a.jm, -1))
    } else {
      const j = isoToJalali(weekAnchor)
      setWeekAnchor(addDaysToJalali(j.jy, j.jm, j.jd, -7).iso)
    }
  }

  function handleNext() {
    if (view === "month") {
      setAnchor((a) => jalaaliMonthShift(a.jy, a.jm, 1))
    } else {
      const j = isoToJalali(weekAnchor)
      setWeekAnchor(addDaysToJalali(j.jy, j.jm, j.jd, 7).iso)
    }
  }

  function handleToday() {
    setAnchor({ jy: todayJ.jy, jm: todayJ.jm })
    setWeekAnchor(today)
    setSelectedIso(today)
  }

  function openAdd(iso: string) {
    setSelectedIso(iso)
    setDialog({ open: true, date: iso, task: null })
  }

  function openEdit(task: Task) {
    setSelectedIso(task.date)
    setDialog({ open: true, date: task.date, task })
  }

  function handleSave(data: {
    title: string
    description?: string
    priority: Priority
    tags: Tag[]
  }) {
    if (dialog.task) {
      updateTask(dialog.task.id, data)
    } else if (dialog.date) {
      addTask({ ...data, date: dialog.date })
    }
    setDialog({ open: false, date: null, task: null })
  }

  function handleDelete() {
    if (dialog.task) deleteTask(dialog.task.id)
    setDialog({ open: false, date: null, task: null })
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-2 py-4 sm:gap-5 sm:px-6 sm:py-10">
      <CalendarHeader
        title={title}
        view={view}
        onViewChange={setView}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
      />

      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
      />

      <main className="min-w-0 rounded-xl border bg-card/40 p-1.5 shadow-sm sm:rounded-2xl sm:p-4">
        {!loaded ? (
          <div className="py-20 text-center text-muted-foreground">
            در حال بارگذاری...
          </div>
        ) : view === "month" ? (
          <MonthlyCalendar
            jy={anchor.jy}
            jm={anchor.jm}
            todayIso={today}
            selectedIso={selectedIso}
            tasksByDate={tasksByDate}
            onSelectDay={openAdd}
            onAddTask={openAdd}
            onEditTask={openEdit}
            onToggleTask={toggleTask}
          />
        ) : (
          <WeeklyCalendar
            anchorIso={weekAnchor}
            todayIso={today}
            selectedIso={selectedIso}
            tasksByDate={tasksByDate}
            onSelectDay={openAdd}
            onAddTask={openAdd}
            onEditTask={openEdit}
            onToggleTask={toggleTask}
          />
        )}
      </main>

      <TaskDialog
        state={dialog}
        onOpenChange={(open) =>
          setDialog((d) => ({ ...d, open }))
        }
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}
