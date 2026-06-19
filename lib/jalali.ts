import { toJalaali, toGregorian, jalaaliMonthLength } from "jalaali-js"

export const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
]

// Persian weekday names, ordered Saturday -> Friday (Iranian week start)
export const PERSIAN_WEEKDAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
]

export const PERSIAN_WEEKDAYS_SHORT = ["ش", "ی", "د", "س", "چ", "پ", "ج"]

export interface JalaliDate {
  jy: number
  jm: number // 1-12
  jd: number // 1-31
}

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]

/** Convert any number or numeric string to Persian digits. */
export function toPersianDigits(input: number | string): string {
  return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)])
}

/**
 * Build a timezone-safe date-only ISO string (YYYY-MM-DD) from Gregorian parts.
 * We never use the Date timezone for storage to avoid day-shift bugs.
 */
export function gregorianToISO(gy: number, gm: number, gd: number): string {
  const mm = String(gm).padStart(2, "0")
  const dd = String(gd).padStart(2, "0")
  return `${gy}-${mm}-${dd}`
}

/** Parse a date-only ISO string into its numeric parts. */
export function parseISO(iso: string): { gy: number; gm: number; gd: number } {
  const [gy, gm, gd] = iso.split("-").map(Number)
  return { gy, gm, gd }
}

/** Convert a date-only ISO string to a Jalali date object. */
export function isoToJalali(iso: string): JalaliDate {
  const { gy, gm, gd } = parseISO(iso)
  return toJalaali(gy, gm, gd)
}

/** Convert a Jalali date to a date-only ISO string. */
export function jalaliToISO(jy: number, jm: number, jd: number): string {
  const { gy, gm, gd } = toGregorian(jy, jm, jd)
  return gregorianToISO(gy, gm, gd)
}

/** Number of days in a Jalali month, accounting for leap years. */
export function getJalaliMonthLength(jy: number, jm: number): number {
  return jalaaliMonthLength(jy, jm)
}

/** Today's date as a date-only ISO string (local). */
export function todayISO(): string {
  const now = new Date()
  return gregorianToISO(now.getFullYear(), now.getMonth() + 1, now.getDate())
}

/** Today as a Jalali date. */
export function todayJalali(): JalaliDate {
  return isoToJalali(todayISO())
}

/** Safe date-only comparison. Returns -1, 0, or 1. */
export function compareISO(a: string, b: string): number {
  if (a === b) return 0
  return a < b ? -1 : 1
}

export function isSameISO(a: string, b: string): boolean {
  return a === b
}

/**
 * jalaali-js: g2d/d2g use the JS weekday formula. We compute the weekday index
 * (0 = Saturday ... 6 = Friday) for a given ISO date.
 */
export function jalaliWeekdayIndex(iso: string): number {
  const { gy, gm, gd } = parseISO(iso)
  // Date used only for weekday extraction at noon to avoid DST edge cases.
  const jsDay = new Date(gy, gm - 1, gd, 12).getDay() // 0=Sun..6=Sat
  // Map JS (Sun=0..Sat=6) to Persian (Sat=0..Fri=6)
  return (jsDay + 1) % 7
}

export interface CalendarDay {
  iso: string
  jy: number
  jm: number
  jd: number
  inCurrentMonth: boolean
}

/**
 * Returns the full grid of days for a given Jalali month, padded with leading
 * and trailing days so the grid starts on Saturday and is filled to full weeks.
 */
export function getMonthGrid(jy: number, jm: number): CalendarDay[] {
  const monthLength = jalaaliMonthLength(jy, jm)
  const days: CalendarDay[] = []

  // First day of month
  const firstISO = jalaliToISO(jy, jm, 1)
  const firstWeekday = jalaliWeekdayIndex(firstISO)

  // Leading days from previous month
  for (let i = firstWeekday; i > 0; i--) {
    const d = addDaysToJalali(jy, jm, 1, -i)
    days.push({ ...d, inCurrentMonth: false })
  }

  // Current month days
  for (let d = 1; d <= monthLength; d++) {
    const j = { jy, jm, jd: d }
    days.push({
      iso: jalaliToISO(jy, jm, d),
      ...j,
      inCurrentMonth: true,
    })
  }

  // Trailing days to fill complete weeks (6 rows x 7 = 42 for stability)
  while (days.length % 7 !== 0) {
    const last = days[days.length - 1]
    const next = addDaysToJalali(last.jy, last.jm, last.jd, 1)
    days.push({ ...next, inCurrentMonth: false })
  }

  return days
}

/** Add a number of days to a Jalali date, returning a CalendarDay-ish object. */
export function addDaysToJalali(
  jy: number,
  jm: number,
  jd: number,
  delta: number,
): { iso: string; jy: number; jm: number; jd: number } {
  const { gy, gm, gd } = toGregorian(jy, jm, jd)
  const date = new Date(gy, gm - 1, gd, 12)
  date.setDate(date.getDate() + delta)
  const iso = gregorianToISO(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  )
  const j = isoToJalali(iso)
  return { iso, jy: j.jy, jm: j.jm, jd: j.jd }
}

/** Get the 7 days (Sat -> Fri) of the week containing the given ISO date. */
export function getWeekDays(iso: string): CalendarDay[] {
  const weekday = jalaliWeekdayIndex(iso)
  const j = isoToJalali(iso)
  const start = addDaysToJalali(j.jy, j.jm, j.jd, -weekday)
  const days: CalendarDay[] = []
  for (let i = 0; i < 7; i++) {
    const d = addDaysToJalali(start.jy, start.jm, start.jd, i)
    days.push({ ...d, inCurrentMonth: true })
  }
  return days
}

/** Shift a Jalali year/month by a number of months. */
export function jalaaliMonthShift(
  jy: number,
  jm: number,
  delta: number,
): { jy: number; jm: number } {
  // Convert to a 0-based absolute month count.
  const total = jy * 12 + (jm - 1) + delta
  return { jy: Math.floor(total / 12), jm: (total % 12) + 1 }
}

/** "فروردین ۱۴۰۳" */
export function formatMonthYear(jy: number, jm: number): string {
  return `${PERSIAN_MONTHS[jm - 1]} ${toPersianDigits(jy)}`
}

/** A label for the current week range, e.g. "۵ – ۱۱ فروردین". */
export function formatWeekRange(days: CalendarDay[]): string {
  const first = days[0]
  const last = days[days.length - 1]
  if (first.jm === last.jm) {
    return `${toPersianDigits(first.jd)} – ${toPersianDigits(last.jd)} ${
      PERSIAN_MONTHS[first.jm - 1]
    } ${toPersianDigits(first.jy)}`
  }
  return `${toPersianDigits(first.jd)} ${PERSIAN_MONTHS[first.jm - 1]} – ${toPersianDigits(
    last.jd,
  )} ${PERSIAN_MONTHS[last.jm - 1]}`
}

/** Full readable Persian date, e.g. "شنبه ۵ فروردین ۱۴۰۳". */
export function formatFullDate(iso: string): string {
  const j = isoToJalali(iso)
  const weekday = PERSIAN_WEEKDAYS[jalaliWeekdayIndex(iso)]
  return `${weekday} ${toPersianDigits(j.jd)} ${PERSIAN_MONTHS[j.jm - 1]} ${toPersianDigits(
    j.jy,
  )}`
}
