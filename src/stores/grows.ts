import {defineStore} from "pinia";

export type GrowStatus = 'planned' | 'running' | 'harvested' | 'aborted'
export interface Planned {
  id: string
  name: string
  startDate: string | ISO
  vegDays: number
  flowerDays: number
  status: GrowStatus
}

const LS_KEY = 'growapp.grows.v1'

export const useGrowsStore = defineStore('grows', {
  state: () => ({grows: [] as Grow[] }),
  actions: {
    load() {
      const raw = localStorage.getItem(LS_KEY)
      this.grows = raw ? JSON.parse(raw) : []
    },
    persist() {
      localStorage.setItem(LS_KEY, JSON.stringify(this.grows))
    },
    add(g: Omit<Grow, 'id'|'status'> & { status?: GrowStatus }) {
      this.grows.unshift({
        id: crypto.randomUUID(),
        status: g.status ?? 'planned',
        ...g,
      })
      this.persist()
    },
    remove(id: string) {
      this.grows = this.grows.filter(x => x.id !== id)
      this.persist()
    },
  },
})
