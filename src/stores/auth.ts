import { defineStore } from 'pinia'
import { auth, googleProvider } from '@/lib/firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from 'firebase/auth'
import type { User } from 'firebase/auth'


type PublicUser = { uid: string; email: string | null }

function toPublic(u: User | null): PublicUser | null {
  return u ? { uid: u.uid, email: u.email } : null
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as PublicUser | null,
    ready: false, // ob Listener initialisiert ist
  }),
  actions: {
    init() {
      if (this.ready) return
      onAuthStateChanged(auth, (u) => {
        this.user = u ? { uid: u.uid, email: u.email } : null
        this.ready = true
      })
    },
    async signUp(email: string, password: string) {
      await createUserWithEmailAndPassword(auth, email, password)
    },
    async signIn(email: string, password: string) {
      await signInWithEmailAndPassword(auth, email, password)
    },
    async signInWithGoogle() {
      await signInWithPopup(auth, googleProvider)
    },
    async signOut() {
      await signOut(auth)
    },
  },
})
