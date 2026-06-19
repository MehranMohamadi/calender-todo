export type JalaliHoliday = {
  month: number
  day: number
  title: string
  recurring: boolean
}

/**
 * Fixed-date Iranian official holidays in the Jalali calendar.
 * These recur every year on the same Jalali month/day.
 */
export const JALALI_HOLIDAYS: JalaliHoliday[] = [
  { month: 1, day: 1, title: "نوروز", recurring: true },
  { month: 1, day: 2, title: "نوروز", recurring: true },
  { month: 1, day: 3, title: "نوروز", recurring: true },
  { month: 1, day: 4, title: "نوروز", recurring: true },
  { month: 1, day: 12, title: "روز جمهوری اسلامی", recurring: true },
  { month: 1, day: 13, title: "روز طبیعت", recurring: true },
  { month: 3, day: 14, title: "رحلت امام خمینی", recurring: true },
  { month: 3, day: 15, title: "قیام ۱۵ خرداد", recurring: true },
  { month: 11, day: 22, title: "پیروزی انقلاب اسلامی", recurring: true },
  { month: 12, day: 29, title: "ملی‌شدن صنعت نفت", recurring: true },
]

const holidayMap = new Map<string, JalaliHoliday>()
for (const h of JALALI_HOLIDAYS) {
  holidayMap.set(`${h.month}-${h.day}`, h)
}

/** Return the holiday for a given Jalali month/day, or null. */
export function getHoliday(jm: number, jd: number): JalaliHoliday | null {
  return holidayMap.get(`${jm}-${jd}`) ?? null
}

/** Friday (weekday index 6) is also a weekly holiday in Iran. */
export function isFriday(weekdayIndex: number): boolean {
  return weekdayIndex === 6
}
