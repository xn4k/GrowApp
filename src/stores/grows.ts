// src/stores/grows.ts
import { defineStore } from 'pinia'
import { db } from '@/lib/firebase'
import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { useAuthStore } from './auth'

export type GrowStatus = 'planned' | 'running' | 'harvested' | 'aborted'

export interface Grow {
  id: string
  name: string
  startDate: string           // ISO yyyy-mm-dd
  vegDays: number
  flowerDays: number
  status: GrowStatus
  createdAt?: Date            // sauber typisieren
  notes?: string
}

type GrowDoc  = Omit<Grow, 'id' | 'createdAt'> & { createdAt?: any } // Firestore-Rohform
type GrowPatch = Partial<Omit<Grow, 'id'>>

export const useGrowsStore = defineStore('grows', {
  state: () => ({
    grows: [] as Grow[],
    loading: false,
  }),
  actions: {
    colRef() {
      const uid = useAuthStore().user?.uid
      if (!uid) throw new Error('not-authenticated')
      return collection(db, 'users', uid, 'grows')
    },

    async load() {
      this.loading = true
      try {
        const q = query(this.colRef(), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        this.grows = snap.docs.map(d => {
          const data = d.data() as GrowDoc
          const createdAt = (data as any)?.createdAt?.toDate?.() ?? undefined
          return { id: d.id, ...data, createdAt } satisfies Grow
        })
      } finally {
        this.loading = false
      }
    },

    async add(g: Omit<Grow, 'id' | 'createdAt'>) {
      const payload: GrowDoc = { ...g, createdAt: serverTimestamp() as any }
      const ref = await addDoc(this.colRef(), payload)
      // Optimistic UI: createdAt kommt nach Reload korrekt
      this.grows.unshift({ id: ref.id, ...g, createdAt: undefined })
    },

    async updatePatch(id: string, patch: GrowPatch) {
      const ref = doc(this.colRef(), id)
      await updateDoc(ref, patch as any)

      const i = this.grows.findIndex(x => x.id === id)
      if (i >= 0) {
        Object.assign(this.grows[i], patch)  // kein Reassign → TS bleibt ruhig
      }
    },

    async updateStatus(id: string, status: GrowStatus) {
      await this.updatePatch(id, { status })
    },

    async updateNotes(id: string, notes: string) {
      await this.updatePatch(id, { notes })
    },

    async remove(id: string) {
      const ref = doc(this.colRef(), id)
      await deleteDoc(ref)
      this.grows = this.grows.filter(x => x.id !== id)
    },
  },
})
