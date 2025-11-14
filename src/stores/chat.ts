// src/stores/chat.ts
import { defineStore } from 'pinia'
import { db } from '@/lib/firebase'
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'

import type { Unsubscribe } from 'firebase/firestore'
import { useAuthStore } from './auth'

export interface ChatMessage {
  id: string
  text: string
  userId: string
  userName: string | null
  createdAt: Date | null
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as ChatMessage[],
    isLoaded: false,
    unsub: null as null | Unsubscribe,
  }),

  actions: {
    initListener() {
      // Nur einmal subscriben
      if (this.unsub) return

      const colRef = collection(db, 'globalMessages')
      const q = query(colRef, orderBy('createdAt', 'desc'), limit(50))

      this.unsub = onSnapshot(q, snapshot => {
        this.messages = snapshot.docs
          .map(docSnap => {
            const data = docSnap.data() as any
            return {
              id: docSnap.id,
              text: data.text ?? '',
              userId: data.userId ?? '',
              userName: data.userName ?? null,
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
            } as ChatMessage
          })
          .reverse() // neuste unten anzeigen
        this.isLoaded = true
      })
    },

    async send(text: string) {
      const auth = useAuthStore()
      const trimmed = text.trim()
      if (!trimmed) return
      if (!auth.user) {
        throw new Error('Nicht eingeloggt, keine Nachricht möglich.')
      }

      const colRef = collection(db, 'globalMessages')
      await addDoc(colRef, {
        text: trimmed,
        userId: auth.user.uid,
        userName: auth.user.displayName ?? auth.user.email ?? 'Anon',
        createdAt: serverTimestamp(),
      })
    },

    dispose() {
      if (this.unsub) {
        this.unsub()
        this.unsub()
        this.unsub = null
      }
      this.messages = []
      this.isLoaded = false
    },
  },
})
