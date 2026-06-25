"use client"

import { useCallback, useEffect, useState } from "react"

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
const SAMPLE_CLEANUP_KEY = "jalali-calendar-samples-cleaned-v1"
const LEGACY_SAMPLE_TITLES = new Set([
  "جلسه با تیم طراحی",
  "پرداخت قبض‌ها",
  "مطالعه مستندات پروژه",
  "خرید خانه",
  "تمرین ورزشی",
  "تماس با مشتری",
])

function createId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function isPriority(value: unknown): value is Priority {
  return value === "low" || value === "medium" || value === "high"
}

function isTag(value: unknown): value is Tag {
  if (!value || typeof value !== "object") return false
  const tag = value as Partial<Tag>
  return (
    typeof tag.id === "string" &&
    typeof tag.label === "string" &&
    typeof tag.color === "string"
  )
}

function normalizeTask(value: unknown): Task | null {
  if (!value || typeof value !== "object") return null
  const task = value as Partial<Task>
  if (
    typeof task.id !== "string" ||
    typeof task.title !== "string" ||
    typeof task.date !== "string"
  ) {
    return null
  }

  return {
    id: task.id,
    title: task.title,
    description:
      typeof task.description === "string" ? task.description : undefined,
    date: task.date,
    completed: Boolean(task.completed),
    priority: isPriority(task.priority) ? task.priority : "medium",
    tags: Array.isArray(task.tags) ? task.tags.filter(isTag) : [],
  }
}

function readStoredTasks(): Task[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []

  const parsed = JSON.parse(raw)
  if (!Array.isArray(parsed)) return []

  return parsed.map(normalizeTask).filter((task): task is Task => Boolean(task))
}

function safeWrite(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Keep the in-memory state usable if storage is unavailable or full.
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = readStoredTasks()
      if (stored.length > 0 || localStorage.getItem(STORAGE_KEY)) {
        const shouldCleanSamples = !localStorage.getItem(SAMPLE_CLEANUP_KEY)
        const cleaned = shouldCleanSamples
          ? stored.filter((task) => !LEGACY_SAMPLE_TITLES.has(task.title))
          : stored
        setTasks(cleaned)
        if (shouldCleanSamples) {
          safeWrite(STORAGE_KEY, JSON.stringify(cleaned))
          safeWrite(SAMPLE_CLEANUP_KEY, "1")
        }
      } else {
        setTasks([])
        safeWrite(SAMPLE_CLEANUP_KEY, "1")
      }
    } catch {
      setTasks([])
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      safeWrite(STORAGE_KEY, JSON.stringify(tasks))
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
