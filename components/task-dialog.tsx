"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, X, Plus } from "lucide-react"
import type { Priority, Task, Tag } from "@/lib/tasks"
import {
  PRIORITY_LABELS,
  TAG_PRESETS,
  readableTextColor,
  createTagId,
} from "@/lib/tasks"
import { formatFullDate } from "@/lib/jalali"

export interface TaskDialogState {
  open: boolean
  date: string | null
  task: Task | null
}

interface TaskDialogProps {
  state: TaskDialogState
  onOpenChange: (open: boolean) => void
  onSave: (data: {
    title: string
    description?: string
    priority: Priority
    tags: Tag[]
  }) => void
  onDelete?: () => void
}

export function TaskDialog({
  state,
  onOpenChange,
  onSave,
  onDelete,
}: TaskDialogProps) {
  const isEdit = Boolean(state.task)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [tags, setTags] = useState<Tag[]>([])
  const [tagLabel, setTagLabel] = useState("")
  const [tagColor, setTagColor] = useState("#2563eb")
  const [error, setError] = useState("")

  useEffect(() => {
    if (state.open) {
      setTitle(state.task?.title ?? "")
      setDescription(state.task?.description ?? "")
      setPriority(state.task?.priority ?? "medium")
      setTags(state.task?.tags ?? [])
      setTagLabel("")
      setTagColor("#2563eb")
      setError("")
    }
  }, [state.open, state.task])

  const dateLabel = state.task?.date ?? state.date

  function addTag(label: string, color: string) {
    const trimmed = label.trim()
    if (!trimmed) return
    // Avoid duplicate labels.
    if (tags.some((t) => t.label === trimmed)) {
      setTagLabel("")
      return
    }
    setTags((prev) => [...prev, { id: createTagId(), label: trimmed, color }])
    setTagLabel("")
  }

  function removeTag(id: string) {
    setTags((prev) => prev.filter((t) => t.id !== id))
  }

  function handleSave() {
    if (!title.trim()) {
      setError("عنوان کار را وارد کنید.")
      return
    }
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      tags,
    })
  }

  return (
    <Dialog open={state.open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl" initialFocus={false}>
        <DialogHeader className="text-right">
          <DialogTitle>{isEdit ? "ویرایش کار" : "افزودن کار"}</DialogTitle>
          {dateLabel && (
            <DialogDescription className="text-right">
              {formatFullDate(dateLabel)}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-title">عنوان کار</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (error) setError("")
              }}
              placeholder="مثلاً جلسه با تیم"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave()
              }}
            />
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="task-desc">توضیحات (اختیاری)</Label>
            <Textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="جزئیات بیشتر..."
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="task-priority">اولویت</Label>
            <Select
              value={priority}
              onValueChange={(v) => setPriority(v as Priority)}
            >
              <SelectTrigger id="task-priority" className="w-full">
                <SelectValue>{PRIORITY_LABELS[priority]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
                  <SelectItem key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>برچسب‌ها</Label>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: t.color,
                      color: readableTextColor(t.color),
                    }}
                  >
                    {t.label}
                    <button
                      type="button"
                      onClick={() => removeTag(t.id)}
                      aria-label={`حذف برچسب ${t.label}`}
                      className="opacity-70 transition-opacity hover:opacity-100"
                    >
                      <X className="size-3" strokeWidth={3} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value)}
                aria-label="انتخاب رنگ برچسب"
                className="size-9 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
              />
              <Input
                value={tagLabel}
                onChange={(e) => setTagLabel(e.target.value)}
                placeholder="نام برچسب جدید"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag(tagLabel, tagColor)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0"
                aria-label="افزودن برچسب"
                onClick={() => addTag(tagLabel, tagColor)}
              >
                <Plus className="size-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {TAG_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => addTag(preset.label, preset.color)}
                  className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
                >
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: preset.color }}
                  />
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row-reverse justify-start gap-2 sm:justify-start">
          <Button onClick={handleSave}>ذخیره</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            انصراف
          </Button>
          {isEdit && onDelete && (
            <Button
              variant="ghost"
              className="me-auto text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="size-4" />
              حذف
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
