
export function harvestDateISO(startISO: string, vegDays: number, flowerDays: number): string {
  const start = new Date(startISO)
  const total = (vegDays || 0) +(flowerDays || 0)
  const date = new Date(start)
  date.setDate(date.getDate() + total)
  return date.toISOString()
}
