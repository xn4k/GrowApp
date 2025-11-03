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
  startDate: string // ISO
  vegDays: number
  flowerDays: number
  status: GrowStatus
  createdAt?: any
}

type GrowDoc = Omit<Grow,'id'>

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
        const q = query(this.colRef(), orderBy('createdAt','desc'))
        const snap = await getDocs(q)
        this.grows = snap.docs.map(d => ({ id: d.id, ...(d.data() as GrowDoc) }))
      } finally {
        this.loading = false
      }
    },

    async add(g: Omit<Grow, 'id'|'createdAt'>) {
      const payload: GrowDoc = { ...g, createdAt: serverTimestamp() as any }
      const ref = await addDoc(this.colRef(), payload)
      // clientseitig direkt anzeigen
      this.grows.unshift({ id: ref.id, ...g })
    },

    async updateStatus(id: string, status: GrowStatus) {
      const ref = doc(this.colRef(), id)
      await updateDoc(ref, { status })
      const i = this.grows.findIndex(x => x.id === id)
      const grow = this.grows[i]
      if (grow) {
        grow.status = status
      }
    },

    async remove(id: string) {
      const ref = doc(this.colRef(), id)
      await deleteDoc(ref)
      this.grows = this.grows.filter(x => x.id !== id)
    },

    // Optional: einmalige Migration von LocalStorage -> Firestore
    async migrateLocalToCloud() {
      const LS_KEY = 'growapp.grows.v1'
      const raw = localStorage.getItem(LS_KEY)
      if (!raw) return
      const arr = JSON.parse(raw) as Omit<Grow,'id'|'createdAt'>[]
      for (const g of arr) await this.add(g)
      localStorage.removeItem(LS_KEY)
    },
  },
})
