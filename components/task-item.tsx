"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/tasks"
import { readableTextColor } from "@/lib/tasks"

const PRIORITY_STYLES: Record<
  Task["priority"],
  { bar: string; dot: string }
> = {
  high: { bar: "border-s-destructive", dot: "bg-destructive" },
  medium: { bar: "border-s-warning", dot: "bg-warning" },
  low: { bar: "border-s-success", dot: "bg-success" },
}

interface TaskItemProps {
  task: Task
  onToggle: () => void
  onEdit: () => void
  /** Compact variant used inside month cells. */
  compact?: boolean
}

export function TaskItem({ task, onToggle, onEdit, compact }: TaskItemProps) {
  const styles = PRIORITY_STYLES[task.priority]

  const tags = task.tags ?? []

  return (
    <div
      className={cn(
        "group flex flex-col gap-1 rounded-md border-s-2 bg-secondary/60 transition-colors hover:bg-secondary",
        styles.bar,
        compact ? "px-1.5 py-1" : "px-2 py-1.5",
      )}
    >
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
          aria-label={
            task.completed ? "علامت‌گذاری به‌عنوان انجام‌نشده" : "انجام شد"
          }
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full border transition-colors",
            compact ? "size-3.5" : "size-4",
            task.completed
              ? "border-success bg-success text-white"
              : "border-muted-foreground/40 text-transparent hover:border-primary",
          )}
        >
          <Check className={compact ? "size-2.5" : "size-3"} strokeWidth={3} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          className={cn(
            "min-w-0 flex-1 truncate text-start",
            compact ? "text-[11px]" : "text-sm",
            task.completed
              ? "text-muted-foreground line-through opacity-60"
              : "text-foreground",
          )}
          title={task.title}
        >
          {task.title}
        </button>

        {!compact && (
          <span className={cn("size-1.5 shrink-0 rounded-full", styles.dot)} />
        )}
      </div>

      {tags.length > 0 && (
        <div
          className={cn(
            "flex flex-wrap gap-1",
            compact ? "ps-5" : "ps-5.5",
            task.completed && "opacity-60",
          )}
        >
          {tags.map((tag) => (
            <span
              key={tag.id}
              className={cn(
                "inline-flex items-center rounded-full font-medium leading-none",
                compact ? "px-1 py-0.5 text-[9px]" : "px-1.5 py-0.5 text-[10px]",
              )}
              style={{
                backgroundColor: tag.color,
                color: readableTextColor(tag.color),
              }}
              title={tag.label}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
