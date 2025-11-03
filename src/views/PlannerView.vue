<template>
  <h1>Grow-Planner</h1>
  <div>
    <p>Meine Freunde</p>
    <p>Alles was hier passiert ist ein Test</p>
    <p>Ich überlege einen chat hier hizufügen</p>
    <p>Oder news Feed</p>
    <p>Linke seite2</p>
    <p>Linke seite3</p>
  </div>
  <div>
  <p>Test Rechte Seite</p>
    <p>rechte seite1</p>
    <p>rechte seite2</p>
    <p>rechte seite3</p>
    <p>rechte seite4</p>
  </div>
  <form @submit.prevent="addGrow" style="gap:.5rem;max-width:420px">
    <input v-model="name" placeholder="Name" required />
    <input v-model="start" type="date" required />
    <input v-model.number="veg" type="number" min="0" placeholder="Veg-Tage" />
    <input v-model.number="flower" type="number" min="0" placeholder="Blüte-Tage" />

    <label>
      Status
      <select v-model="status">
        <option value="planned">planned</option>
        <option value="running">running</option>
        <option value="harvested">harvested</option>
        <option value="aborted">aborted</option>
      </select>
    </label>

    <div>Erntedatum: <strong>{{ harvest }}</strong></div>
    <div class="bg-gray-100 p-6 rounded-xl shadow flex flex-col items-center justify-center">
      <h2 class="text-xl font-semibold mb-2">Statistik</h2>
      <p class="text-sm text-gray-600">Geplante Grows: {{ store.grows.length }}</p>
      <p class="text-sm text-gray-600">Aktiv: {{ store.grows.filter(g => g.status === 'running').length }}</p>
      <p class="text-sm text-gray-600">Abgeschlossen: {{ store.grows.filter(g => g.status === 'harvested').length }}</p>
    </div>
    <button type="submit">Speichern</button>
  </form>



  <ul style="display:grid;gap:.5rem;padding-left:0;list-style:none;">
    <li
      v-for="g in store.grows"
      :key="g.id"
      style="border:1px solid #ddd;padding:.5rem;border-radius:.5rem;"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1 min-w-0">
          <div class="font-semibold">{{ g.name }}</div>
          <div class="text-xs opacity-75 truncate">
            Start: {{ g.startDate.slice(0,10) }} · Veg: {{ g.vegDays }} · Flower: {{ g.flowerDays }} ·
            Harvest: {{ computeHarvest(g.startDate, g.vegDays, g.flowerDays).slice(0,10) }}
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs px-2 py-0.5 rounded-full border">{{ g.status }}</span>
          <select :value="g.status" @change="onChangeStatus(g.id, ($event.target as HTMLSelectElement).value)" class="text-xs max-w-[140px]">
            <option value="planned">planned</option>
            <option value="running">running</option>
            <option value="harvested">harvested</option>
            <option value="aborted">aborted</option>
          </select>
          <button type="button" @click="store.remove(g.id)" class="text-red-400 text-xs hover:underline">Löschen</button>
        </div>
      </div>
    </li>
  </ul>



</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

import { ref, computed, onMounted } from 'vue'
import { useGrowsStore, type GrowStatus } from '@/stores/grows'
import { harvestDateISO } from '@/utils/grow'


const auth = useAuthStore()

const store = useGrowsStore()

const name   = ref('')
const start  = ref<string>(new Date().toISOString().slice(0,10))
const veg    = ref<number>(0)
const flower = ref<number>(0)
const status = ref<GrowStatus>('planned')

onMounted(async () => {
  // eingeloggt? sonst zur Login-Page (falls Route nicht schon geschützt ist)
  if (!auth.user) return
  await store.load()
  // optional: Sobald du das einmal gemacht hast, kann’s raus.
  // await store.migrateLocalToCloud()
})

const harvest = computed(() =>
  harvestDateISO(new Date(start.value).toISOString(), veg.value, flower.value).slice(0,10)
)

function addGrow() {
  store.add({
    name: name.value.trim(),
    startDate: new Date(start.value).toISOString(),
    vegDays: Number(veg.value) || 0,
    flowerDays: Number(flower.value) || 0,
    status: status.value,
  })
  name.value = ''
  veg.value = 0
  flower.value = 0
  status.value = 'planned'
}

function onChangeStatus(id: string, value: string) {
  store.updateStatus(id, value as GrowStatus)
}

function computeHarvest(startISO: string, vegDays: number, flowerDays: number) {
  return harvestDateISO(startISO, vegDays, flowerDays)
}
</script>
