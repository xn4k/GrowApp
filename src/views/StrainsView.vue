<template>
  <div style="max-width:560px;margin:2rem auto;display:grid;gap:1rem">
    <h1>Sorten</h1>

    <form @submit.prevent="create">
      <input v-model="name" placeholder="Name (z.B. Royal Runtz)" required />
      <input v-model="breeder" placeholder="Breeder (optional)" />
      <input v-model="genetics" placeholder="Genetik (optional)" />
      <input v-model.number="thc" type="number" min="0" max="50" step="0.1" placeholder="THC %" />
      <input v-model.number="cbd" type="number" min="0" max="50" step="0.1" placeholder="CBD %" />
      <textarea v-model="notes" placeholder="Notizen"></textarea>
      <button type="submit">Hinzufügen</button>
    </form>

    <div v-if="store.loading">Lade…</div>
    <div v-else-if="store.isEmpty" style="opacity:.7">Noch keine Sorten gespeichert.</div>

    <ul style="display:grid;gap:.5rem;padding:0;list-style:none">
      <li v-for="s in store.items" :key="s.id" style="border:1px solid #ddd;padding:.5rem;border-radius:.5rem">
        <div style="display:flex;justify-content:space-between;gap:1rem;align-items:center">
          <div>
            <strong>{{ s.name }}</strong>
            <div style="font-size:.9rem;opacity:.8">
              {{ s.breeder || '—' }} · {{ s.genetics || '—' }}
              <span v-if="s.thc"> · THC {{ s.thc }}%</span>
              <span v-if="s.cbd"> · CBD {{ s.cbd }}%</span>
            </div>
            <div v-if="s.notes" style="font-size:.9rem;margin-top:.25rem">{{ s.notes }}</div>
          </div>
          <button @click="del(s.id)">Löschen</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStrainsStore } from '@/stores/strains'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const store = useStrainsStore()
const auth = useAuthStore()
const router = useRouter()

const name = ref('')
const breeder = ref('')
const genetics = ref('')
const thc = ref<number | undefined>(undefined)
const cbd = ref<number | undefined>(undefined)
const notes = ref('')

onMounted(async () => {
  if (!auth.user) {
    router.push({ name: 'login', query: { next: '/strains' } })
    return
  }
  await store.load()
})

async function create() {
  await store.add({
    name: name.value.trim(),
    breeder: breeder.value.trim() || undefined,
    genetics: genetics.value.trim() || undefined,
    thc: thc.value,
    cbd: cbd.value,
    notes: notes.value.trim() || undefined,
  })
  name.value = breeder.value = genetics.value = notes.value = ''
  thc.value = cbd.value = undefined
}

async function del(id: string) {
  await store.remove(id)
}
</script>
