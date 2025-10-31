<template>
  <div style="max-width:360px;margin:4rem auto;display:grid;gap:.75rem">
    <h1>Login</h1>

    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Passwort" required />
      <button type="submit">Einloggen</button>
    </form>

    <button @click="register">Neu registrieren</button>
    <button @click="google">Mit Google anmelden</button>

    <p v-if="auth.user" style="color:green">Eingeloggt als {{ auth.user.email }}</p>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const auth = useAuthStore()
const router = useRouter()

async function login() {
  error.value = null
  try {
    await auth.signIn(email.value.trim(), password.value)
    router.push({ name: 'Home' }) // Zielroute anpassen
  } catch (e: any) {
    error.value = human(e)
  }
}

async function register() {
  error.value = null
  try {
    await auth.signUp(email.value.trim(), password.value)
    router.push({ name: 'Home' })
  } catch (e: any) {
    error.value = human(e)
  }
}

async function google() {
  error.value = null
  try {
    await auth.signInWithGoogle()
    router.push({ name: 'Home' })
  } catch (e: any) {
    error.value = human(e)
  }
}

// sehr simple Fehlerübersetzung
function human(e: any) {
  const msg = String(e?.code || e?.message || e)
  if (msg.includes('auth/invalid-credential')) return 'Falsche Zugangsdaten.'
  if (msg.includes('auth/email-already-in-use')) return 'Email ist bereits registriert.'
  if (msg.includes('auth/weak-password')) return 'Passwort zu schwach.'
  return 'Anmeldung fehlgeschlagen.'
}
</script>

<style scoped>
input, button { width: 100%; padding: .6rem; }
button { cursor: pointer; }
</style>
