// src/utils/grow.ts
import { addDays } from 'date-fns'

export function harvestDateISO(start: string, veg = 0, flower = 0): string {
  const total = (veg ?? 0) + (flower ?? 0)
  const parts = start.split('-').map(Number)

  const y = parts[0] ?? new Date().getFullYear()
  const m = parts[1] ?? 1
  const d = parts[2] ?? 1

  const startDate = new Date(y, m - 1, d)
  const end = addDays(startDate, total)

  const day = String(end.getDate()).padStart(2, '0')
  const month = String(end.getMonth() + 1).padStart(2, '0')
  const year = end.getFullYear()

  // deutsche Schreibweise: TT.MM.JJJJ
  return `${day}.${month}.${year}`
}
