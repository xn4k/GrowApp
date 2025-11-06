import { defineStore } from 'pinia'
import { auth, googleProvider } from '@/lib/firebase'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, type User } from 'firebase/auth'

type PublicUser = { uid: string; email: string | null }
const toPublic = (u: User | null): PublicUser | null => u ? ({ uid: u.uid, email: u.email }) : null

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as PublicUser | null,
    ready: false,
    _readyPromise: null as Promise<void> | null,
  }),
  actions: {
    initOnce() {
      if (this._readyPromise) return this._readyPromise
      this._readyPromise = new Promise<void>(resolve => {
        onAuthStateChanged(auth, u => {
          this.user = toPublic(u)
          this.ready = true
          resolve()
        })
      })
      return this._readyPromise
    },
    async signUp(email: string, password: string) { await createUserWithEmailAndPassword(auth, email, password) },
    async signIn(email: string, password: string) { await signInWithEmailAndPassword(auth, email, password) },
    async signInWithGoogle() { await signInWithPopup(auth, googleProvider) },
    async signOut() { await signOut(auth) },
  },
})
