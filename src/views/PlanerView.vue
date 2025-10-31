<template>
  <h1>Grow-Planer</h1>

  <form @submit.prevent="addGrow" style="display:grid;gap:.5rem;max-width:420px">
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
    <button type="submit">Speichern</button>
  </form>

  <hr />

  <ul style="display:grid;gap:.5rem;padding-left:0;list-style:none;">
    <li
      v-for="g in store.grows"
      :key="g.id"
      style="border:1px solid #ddd;padding:.5rem;border-radius:.5rem;"
    >
      <div style="display:flex;justify-content:space-between;gap:1rem;align-items:center;flex-wrap:wrap;">
        <div>
          <div><strong>{{ g.name }}</strong></div>
          <div style="font-size:.9rem;opacity:.8">
            Start: {{ g.startDate.slice(0,10) }} ·
            Veg: {{ g.vegDays }} · Flower: {{ g.flowerDays }} ·
            Harvest: {{ computeHarvest(g.startDate, g.vegDays, g.flowerDays).slice(0,10) }}
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:.5rem;">
          <span style="font-size:.8rem;padding:.15rem .5rem;border:1px solid #ccc;border-radius:999px;">
            {{ g.status }}
          </span>
          <select :value="g.status" @change="onChangeStatus(g.id, ($event.target as HTMLSelectElement).value)">
            <option value="planned">planned</option>
            <option value="running">running</option>
            <option value="harvested">harvested</option>
            <option value="aborted">aborted</option>
          </select>

          <button type="button" @click="store.remove(g.id)">Löschen</button>
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
