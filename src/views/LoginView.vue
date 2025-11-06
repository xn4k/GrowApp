<template>
  <div style="max-width:360px;margin:4rem auto;display:grid;gap:.75rem">
    <h1>Login</h1>

    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Passwort" required />
      <button type="submit" :disabled="loading">Einloggen</button>
    </form>

    <button type="button" @click="register" :disabled="loading">Neu registrieren</button>
    <button type="button" @click="google" :disabled="loading">Mit Google anmelden</button>

    <!-- Erfolgsmeldung -->
    <p v-if="success && auth.user" style="color:green">
      Erfolgreich angemeldet! {{ auth.user.email }}
    </p>

    <!-- Fehlermeldung nur, wenn kein Erfolg -->
    <p v-if="error && !success" style="color:red">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, type LocationQueryValue } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { safePush } from '@/utils/router'

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const success = ref(false)
const loading = ref(false)
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

function getNextPath(): string | null {
  const q: LocationQueryValue | LocationQueryValue[] | undefined = route.query.next
  if (Array.isArray(q)) return q[0] ?? null
  if (typeof q === 'string') return q
  return null
}


async function login() {
  resetUi()
  loading.value = true
  try {
    await auth.signIn(email.value.trim(), password.value)
    success.value = true
    const next = getNextPath()
    await router.push(next ?? { name: 'home' })
  } catch (e: unknown) {
    error.value = human(e)
    success.value = false
  } finally {
    loading.value = false
  }
}

async function register() {
  resetUi()
  loading.value = true
  try {
    await auth.signUp(email.value.trim(), password.value)
    success.value = true
    const next = getNextPath()
    await router.push(next ?? { name: 'home' })
  } catch (e: unknown) {
    error.value = human(e)
    success.value = false
  } finally {
    loading.value = false
  }
}

async function google() {
  resetUi()
  loading.value = true
  try {
    await auth.signInWithGoogle()
    success.value = true
    const next = getNextPath()
    await router.push(next ?? { name: 'home' })
  } catch (e: unknown) {
    error.value = human(e)
    success.value = false
  } finally {
    loading.value = false
  }
}

function resetUi() {
  error.value = null
  success.value = false
}

function human(e: unknown) {
  const msg = String((e as any)?.code || (e as any)?.message || e)
  if (msg.includes('auth/invalid-credential')) return 'Falsche Zugangsdaten.'
  if (msg.includes('auth/email-already-in-use')) return 'Email ist bereits registriert.'
  if (msg.includes('auth/weak-password')) return 'Passwort zu schwach.'
  if (msg.includes('auth/too-many-requests')) return 'Zu viele Versuche. Bitte kurz warten.'
  return 'Anmeldung fehlgeschlagen.'
}
</script>

<style scoped>
input, button { width: 100%; padding: .6rem; }
button { cursor: pointer; }
</style>
