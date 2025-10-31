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
  state: () => ({
    grows: [] as Grow[],
  }),

  actions: {
    load() {
      try {
        const raw = localStorage.getItem(LS_KEY)
        this.grows = raw ? JSON.parse(raw) as Grow [] : []
      } catch {
        this.grows = []
      }
    },

    persist() {
      localStorage.setItem(LS_KEY, JSON.stringify(this.grows))
    },
    // Neues Grow anlegen status optional standard ist planned
    add(g: Omit<Grow, 'id'|'status'> & { status?: GrowStatus }) {
      const item: Grow = {
        id: crypto.randomUUID(),
        status: g.status ?? 'planned',
        ...g,
      }
      this.grows.unshift(item)
      this.persist()
    },
    // Status eines Grows aktualisieren
    updateStatus(id: string, status: GrowStatus) {
      const i = this.grows.findIndex(x => x.id === id)
      if (i !== -1) {
        this.grows[i].status = status
        this.persist()
      }
  },
    remove(id: string) {
    this.grows = this.grows.filter(x => x.id !== id)
    this.persist()
    },
  },
})
