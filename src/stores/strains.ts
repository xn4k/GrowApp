import { defineStore } from 'pinia'
import { db } from '@/lib/firebase'
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { useAuthStore } from './auth'

export interface Strain {
  id: string
  name: string
  breeder?: string
  genetics?: string
  thc?: number
  cbd?: number
  notes?: string
  createdAt?: any
}

export const useStrainsStore = defineStore('strains', {
  state: () => ({
    items: [] as Strain[],
    loading: false,
  }),
  getters: {
    isEmpty: (s) => s.items.length === 0,
  },
  actions: {
    colPath() {
      const uid = useAuthStore().user?.uid
      if (!uid) throw new Error('not-authenticated')
      return collection(db, 'users', uid, 'strains')
    },

    async load() {
      this.loading = true
      try {
        const q = query(this.colPath(), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        this.items = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Strain,'id'>) }))
      } finally {
        this.loading = false
      }
    },

    async add(data: Omit<Strain, 'id'|'createdAt'>) {
      const ref = await addDoc(this.colPath(), { ...data, createdAt: serverTimestamp() })
      this.items.unshift({ id: ref.id, ...data })
    },

    async update(id: string, patch: Partial<Strain>) {
      const ref = doc(this.colPath(), id)
      await updateDoc(ref, patch as any)
      const i = this.items.findIndex(x => x.id === id)
      if (i !== -1) this.items[i] = { ...this.items[i], ...patch }
    },

    async remove(id: string) {
      const ref = doc(this.colPath(), id)
      await deleteDoc(ref)
      this.items = this.items.filter(x => x.id !== id)
    },
  },
})
