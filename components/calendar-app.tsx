"use client"

import { useMemo, useRef, useState, type TouchEvent } from "react"
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
import { TasksPage } from "@/components/tasks-page"
import { TaskDialog, type TaskDialogState } from "@/components/task-dialog"
import { AppBottomNav, type AppPage } from "@/components/app-bottom-nav"
import type { TaskFilter } from "@/components/task-filters"
import type { CalendarView } from "@/components/view-switcher"

interface SwipeStart {
  x: number
  y: number
  nearLeftEdge: boolean
  nearRightEdge: boolean
}

const SWIPE_THRESHOLD = 56
const EDGE_SIZE = 32

export function CalendarApp() {
  const { tasks, loaded, addTask, updateTask, deleteTask, toggleTask } =
    useTasks()

  const today = todayISO()
  const todayJ = todayJalali()

  const [page, setPage] = useState<AppPage>("calendar")
  const [view, setView] = useState<CalendarView>("month")
  const [anchor, setAnchor] = useState({ jy: todayJ.jy, jm: todayJ.jm })
  const [weekAnchor, setWeekAnchor] = useState(today)
  const [selectedIso, setSelectedIso] = useState<string | null>(today)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<TaskFilter>("all")
  const swipeStart = useRef<SwipeStart | null>(null)

  const [dialog, setDialog] = useState<TaskDialogState>({
    open: false,
    date: null,
    task: null,
  })

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>()
    const weight: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

    for (const task of tasks) {
      const list = map.get(task.date) ?? []
      list.push(task)
      map.set(task.date, list)
    }

    for (const list of map.values()) {
      list.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1
        return weight[a.priority] - weight[b.priority]
      })
    }
    return map
  }, [tasks])

  const title =
    view === "month"
      ? formatMonthYear(anchor.jy, anchor.jm)
      : formatWeekRange(getWeekDays(weekAnchor))

  function handlePrev() {
    if (view === "month") {
      setAnchor((value) => jalaaliMonthShift(value.jy, value.jm, -1))
    } else {
      const jalali = isoToJalali(weekAnchor)
      setWeekAnchor(addDaysToJalali(jalali.jy, jalali.jm, jalali.jd, -7).iso)
    }
  }

  function handleNext() {
    if (view === "month") {
      setAnchor((value) => jalaaliMonthShift(value.jy, value.jm, 1))
    } else {
      const jalali = isoToJalali(weekAnchor)
      setWeekAnchor(addDaysToJalali(jalali.jy, jalali.jm, jalali.jd, 7).iso)
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
    date: string
  }) {
    if (dialog.task) {
      updateTask(dialog.task.id, data)
    } else {
      addTask(data)
    }
    setSelectedIso(data.date)
    setDialog({ open: false, date: null, task: null })
  }

  function handleDelete() {
    if (dialog.task) deleteTask(dialog.task.id)
    setDialog({ open: false, date: null, task: null })
  }

  function changePage(nextPage: AppPage) {
    if (nextPage === page) return
    setPage(nextPage)
  }

  function shouldIgnoreSwipe(target: EventTarget | null) {
    return (
      target instanceof Element &&
      Boolean(
        target.closest(
          "button, input, textarea, select, a, [role='dialog'], [data-swipe-ignore]",
        ),
      )
    )
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    if (dialog.open || shouldIgnoreSwipe(event.target)) {
      swipeStart.current = null
      return
    }

    const touch = event.touches[0]
    swipeStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      nearLeftEdge: touch.clientX <= EDGE_SIZE,
      nearRightEdge: touch.clientX >= window.innerWidth - EDGE_SIZE,
    }
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = swipeStart.current
    swipeStart.current = null
    if (!start) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y
    const horizontal =
      Math.abs(deltaX) >= SWIPE_THRESHOLD &&
      Math.abs(deltaX) > Math.abs(deltaY) * 1.25

    if (!horizontal) return

    if (page === "calendar" && start.nearRightEdge && deltaX < 0) {
      changePage("tasks")
      return
    }
    if (page === "tasks" && start.nearLeftEdge && deltaX > 0) {
      changePage("calendar")
      return
    }

    if (page === "calendar") {
      if (deltaX < 0) handleNext()
      else handlePrev()
    }
  }

  return (
    <div
      className="mx-auto flex w-full max-w-6xl touch-pan-y flex-col gap-3 px-2 py-3 pb-20 sm:gap-4 sm:px-4 sm:py-6 sm:pb-24"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex flex-col gap-3 sm:gap-4">
        {page === "calendar" ? (
          <>
            <CalendarHeader
              title={title}
              view={view}
              onViewChange={setView}
              onPrev={handlePrev}
              onNext={handleNext}
              onToday={handleToday}
            />

            <main className="min-w-0 rounded-lg border bg-card/40 p-1.5 shadow-sm sm:p-2.5">
              {!loaded ? (
                <div className="py-14 text-center text-xs text-muted-foreground">
                  در حال بارگذاری...
                </div>
              ) : view === "month" ? (
                <MonthlyCalendar
                  key={`month-${anchor.jy}-${anchor.jm}`}
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
                  key={`week-${weekAnchor}`}
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
          </>
        ) : (
          <TasksPage
            tasks={tasks}
            loaded={loaded}
            search={search}
            filter={filter}
            onSearchChange={setSearch}
            onFilterChange={setFilter}
            onAdd={() => openAdd(today)}
            onEdit={openEdit}
            onToggle={toggleTask}
          />
        )}
      </div>

      <AppBottomNav page={page} onChange={changePage} />

      <TaskDialog
        state={dialog}
        onOpenChange={(open) => setDialog((value) => ({ ...value, open }))}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}
