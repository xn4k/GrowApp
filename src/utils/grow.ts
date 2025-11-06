// src/utils/grow.ts
import { addDays } from 'date-fns'

export function harvestDateISO(start: string, veg = 0, flower = 0): string {
  const total = (veg ?? 0) + (flower ?? 0)
  const [y, m, d] = start.split('-').map(Number)
  const end = addDays(new Date(y, (m ?? 1) - 1, d ?? 1), total)
  const yyyy = end.getFullYear()
  const mm = String(end.getMonth() + 1).padStart(2, '0')
  const dd = String(end.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
