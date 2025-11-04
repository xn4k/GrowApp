<template>
  <h1>Grow-Planner</h1>

  <div>
    <p class="text-sm text-neutral-400 mb-1">Meine Freunde</p>
    <p class="text-sm text-neutral-400 mb-1">Alles, was hier passiert, ist noch ein Test.</p>
    <p class="text-sm text-neutral-400 mb-1">Ich überlege, einen kleinen Chat oder News-Feed hinzuzufügen.</p>
    <p class="text-sm text-neutral-400 mb-1">Vielleicht kommt auch eine Social-Wall oder ein Aktivitätslog dazu.</p>
    <p> ⚠️ Dieses Feature ist nur ein Prototyp. Feedback willkommen – Änderungen jederzeit möglich.</p>
    <p>Abgesehen davon dass ich das ganze Layout noch zu ende machen werde damit es nicht wie
    ein Schwanz aussieht. :=) </p>
  </div>


  <div>
    <!-- Small GIF to emphasize "work in progress" -->
    <img
      src="https://miro.medium.com/0*asGn9Td3i3o0zQKV"
      alt="Work in progress"
      class="rounded-lg w-1/3 mx-auto mb-4 opacity-90"
      style="width:290px; height:auto; display:block; opacity:0.9"

    />
  <p>Test Rechte Seite</p>
    <p>rechte seite1</p>
    <p>rechte seite2</p>
    <p>rechte seite3</p>
    <p>rechte seite4</p>
  </div>
  <form
    @submit.prevent="addGrow"
    class="grid gap-3 max-w-md bg-neutral-900/40 border border-neutral-700 rounded-xl p-5"
  >
    <!-- Name -->
    <div class="flex flex-col">
      <label for="name" class="text-sm font-medium mb-1 text-neutral-300">Name des Grows</label>
      <input
        id="name"
        v-model="name"
        placeholder="z. B. Polar Gelato"
        required
        class="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2"
      />
    </div>

    <!-- Startdatum -->
    <div class="flex flex-col">
      <label for="start" class="text-sm font-medium mb-1 text-neutral-300">Startdatum</label>
      <input
        id="start"
        v-model="start"
        type="date"
        required
        class="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2"
      />
    </div>

    <!-- Vegetative Phase -->
    <div class="flex flex-col">
      <label for="veg" class="text-sm font-medium mb-1 text-neutral-300">Dauer Vegetative Phase (Tage)</label>
      <input
        id="veg"
        v-model.number="veg"
        type="number"
        min="0"
        placeholder="z. B. 21"
        class="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2"
      />
    </div>

    <!-- Blütephase -->
    <div class="flex flex-col">
      <label for="flower" class="text-sm font-medium mb-1 text-neutral-300">Dauer Blütephase (Tage)</label>
      <input
        id="flower"
        v-model.number="flower"
        type="number"
        min="0"
        placeholder="z. B. 56"
        class="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2"
      />
    </div>

    <!-- Status -->
    <div class="flex flex-col">
      <label for="status" class="text-sm font-medium mb-1 text-neutral-300">Status</label>
      <select
        id="status"
        v-model="status"
        class="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2"
      >
        <option value="planned">Geplant</option>
        <option value="running">Läuft</option>
        <option value="harvested">Geerntet</option>
        <option value="aborted">Abgebrochen</option>
      </select>
    </div>


    <!-- Erntedatum -->
    <p class="text-sm text-neutral-400">
      Voraussichtliches Erntedatum: <strong class="text-neutral-200">{{ harvest }}</strong>
    </p>

    <!-- Button -->
    <button
      type="submit"
      class="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-md"
    >
      Speichern
    </button>

    <!-- Statistik -->
    <div class="bg-neutral-800 p-4 rounded-xl border border-neutral-700">
      <h2 class="text-lg font-semibold mb-2 text-neutral-100">Statistik</h2>
      <p class="text-sm text-neutral-400">Gesamt: {{ store.grows.length }}</p>
      <p class="text-sm text-neutral-400">Aktiv: {{ store.grows.filter(g => g.status === 'running').length }}</p>
      <p class="text-sm text-neutral-400">Abgeschlossen: {{ store.grows.filter(g => g.status === 'harvested').length }}</p>
    </div>


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
