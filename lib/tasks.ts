"use client"

import { useCallback, useEffect, useState } from "react"
import { todayISO, addDaysToJalali, todayJalali } from "@/lib/jalali"

export type Priority = "low" | "medium" | "high"

export interface Tag {
  id: string
  label: string
  /** Any CSS color, typically a hex value like "#3b82f6". */
  color: string
}

export interface Task {
  id: string
  title: string
  description?: string
  /** Gregorian date-only ISO string, e.g. "2024-03-21" */
  date: string
  completed: boolean
  priority: Priority
  tags: Tag[]
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "کم",
  medium: "متوسط",
  high: "زیاد",
}

/** Predefined tag suggestions with sensible colors. */
export const TAG_PRESETS: { label: string; color: string }[] = [
  { label: "کاری", color: "#2563eb" },
  { label: "شخصی", color: "#0d9488" },
  { label: "فوری", color: "#dc2626" },
  { label: "خانه", color: "#d97706" },
  { label: "مالی", color: "#16a34a" },
  { label: "سلامت", color: "#db2777" },
]

/**
 * Decide whether tag text should be dark or light for readability,
 * based on the perceived luminance of the background color.
 */
export function readableTextColor(hex: string): string {
  const c = hex.replace("#", "")
  const full =
    c.length === 3
      ? c
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : c
  const r = parseInt(full.slice(0, 2), 16) || 0
  const g = parseInt(full.slice(2, 4), 16) || 0
  const b = parseInt(full.slice(4, 6), 16) || 0
  // Perceived luminance (sRGB).
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? "#1f2937" : "#ffffff"
}

export function createTagId(): string {
  return "tag-" + Math.random().toString(36).slice(2, 9)
}

const STORAGE_KEY = "jalali-calendar-tasks-v1"

function createId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function buildSampleTasks(): Task[] {
  const j = todayJalali()
  const offset = (delta: number) =>
    addDaysToJalali(j.jy, j.jm, j.jd, delta).iso

  const tag = (label: string, color: string): Tag => ({
    id: createTagId(),
    label,
    color,
  })

  return [
    {
      id: createId(),
      title: "جلسه با تیم طراحی",
      description: "بررسی نسخه جدید رابط کاربری و جمع‌بندی بازخوردها",
      date: offset(0),
      completed: false,
      priority: "high",
      tags: [tag("کاری", "#2563eb"), tag("فوری", "#dc2626")],
    },
    {
      id: createId(),
      title: "پرداخت قبض‌ها",
      description: "قبض برق و اینترنت",
      date: offset(0),
      completed: true,
      priority: "medium",
      tags: [tag("مالی", "#16a34a")],
    },
    {
      id: createId(),
      title: "مطالعه مستندات پروژه",
      date: offset(1),
      completed: false,
      priority: "low",
      tags: [tag("کاری", "#2563eb")],
    },
    {
      id: createId(),
      title: "خرید خانه",
      description: "میوه، نان و مواد شوینده",
      date: offset(2),
      completed: false,
      priority: "medium",
      tags: [tag("خانه", "#d97706")],
    },
    {
      id: createId(),
      title: "تمرین ورزشی",
      date: offset(-1),
      completed: true,
      priority: "low",
      tags: [tag("سلامت", "#db2777")],
    },
    {
      id: createId(),
      title: "تماس با مشتری",
      date: offset(3),
      completed: false,
      priority: "high",
      tags: [tag("کاری", "#2563eb"), tag("شخصی", "#0d9488")],
    },
  ]
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Task[]
        // Backward compatibility: ensure every task has a tags array.
        setTasks(
          parsed.map((t) => ({ ...t, tags: Array.isArray(t.tags) ? t.tags : [] })),
        )
      } else {
        const sample = buildSampleTasks()
        setTasks(sample)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sample))
      }
    } catch {
      setTasks(buildSampleTasks())
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }
  }, [tasks, loaded])

  const addTask = useCallback(
    (data: Omit<Task, "id" | "completed"> & { completed?: boolean }) => {
      setTasks((prev) => [
        ...prev,
        { ...data, id: createId(), completed: data.completed ?? false },
      ])
    },
    [],
  )

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }, [])

  return { tasks, loaded, addTask, updateTask, deleteTask, toggleTask }
}

export { todayISO }
