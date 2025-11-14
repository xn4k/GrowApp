<template>
  <h1>Grow-Planner</h1>

  <div class="mb-6 space-y-1">
    <p class="text-sm text-neutral-400">Meine Freunde</p>
    <p class="text-sm text-neutral-400">Alles, was hier passiert, ist noch ein Test.</p>
    <p class="text-sm text-neutral-400">Ich überlege, einen kleinen Chat oder News-Feed hinzuzufügen.</p>
    <p class="text-sm text-neutral-400">Chat - Done ;) Muss nur einiges dran fixen</p>
    <p class="text-sm text-neutral-400">Vielleicht kommt auch eine Social-Wall oder ein Aktivitätslog dazu.</p>
    <p>⚠️ Prototyp. Feedback willkommen – Änderungen jederzeit möglich.</p>
  </div>
  <GlobalChatFeed class="max-w-xl mx-auto" />

  <div class="max-w-xl mx-auto mb-8">
    <img
      src="https://miro.medium.com/0*asGn9Td3i3o0zQKV"
      alt="Work in progress"
      class="block mx-auto w-1/2 max-w-xs rounded-lg opacity-90"
    />
    <div class="mt-2 text-sm text-neutral-400 text-center">Test rechte Seite</div>
  </div>

  <!-- Formular -->
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
      Voraussichtliches Erntedatum:
      <strong class="text-neutral-200">{{ harvest }}</strong>
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

  <!-- Liste -->
  <ul class="grid gap-2 pl-0 list-none mt-6">
    <li v-for="g in store.grows" :key="g.id" class="border rounded p-3">
      <div class="flex items-start gap-4">
        <div class="flex-1 min-w-0">
          <div class="font-semibold">{{ g.name }}</div>
          <div class="text-xs opacity-75 truncate">
            Start: {{ g.startDate.slice(0,10) }} · Veg: {{ g.vegDays }} · Flower: {{ g.flowerDays }} ·
            Harvest: {{ computeHarvest(g.startDate, g.vegDays, g.flowerDays) }}
          </div>

          <label class="block text-sm font-medium mt-2">Notizen</label>
          <textarea
            v-model="g.notes"
            rows="3"
            placeholder="Geruch, Stretch, EC/PH, Auffälligkeiten..."
            class="w-full rounded border p-2"
            @blur="onBlurNotes(g)"
          />
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs px-2 py-0.5 rounded-full border">{{ g.status }}</span>
          <select
            :value="g.status"
            @change="onChangeStatus(g.id, ($event.target as HTMLSelectElement).value)"
            class="text-xs max-w-[140px]"
          >
            <option value="planned">planned</option>
            <option value="running">running</option>
            <option value="harvested">harvested</option>
            <option value="aborted">aborted</option>
          </select>
          <button type="button" @click="store.remove(g.id)" class="text-red-500 text-xs hover:underline">
            Löschen
          </button>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useGrowsStore, type GrowStatus, type Grow } from '@/stores/grows'
import { harvestDateISO } from '@/utils/grow'
import GlobalChatFeed from '@/components/GlobalChatFeed.vue'


const auth = useAuthStore()
const store = useGrowsStore()

// Formular-States
const name   = ref('')
const start  = ref<string>(new Date().toISOString().slice(0,10)) // YYYY-MM-DD
const veg    = ref<number>(0)
const flower = ref<number>(0)
const status = ref<GrowStatus>('planned')

onMounted(async () => {
  if (!auth.user) return
  await store.load()
})

// Erntedatum aus Formular-Inputs (robust, kein toISOString-Shift)
const harvest = computed(() => {
  if (!start.value) return '—'
  const d = harvestDateISO(start.value, veg.value, flower.value)
  return d ?? '—'
})

async function addGrow() {
  if (!name.value.trim() || !start.value) return
  await store.add({
    name: name.value.trim(),
    startDate: start.value,                // direkt YYYY-MM-DD speichern
    vegDays: Number(veg.value) || 0,
    flowerDays: Number(flower.value) || 0,
    status: status.value,
    notes: '',
  })
  // Formular zurücksetzen
  name.value = ''
  veg.value = 0
  flower.value = 0
  status.value = 'planned'
}

async function onBlurNotes(g: Grow) {
  const notes = (g.notes ?? '').trim()
  await store.updateNotes(g.id, notes)     // <- richtige Action
}

async function onChangeStatus(id: string, value: string) {
  await store.updateStatus(id, value as GrowStatus)
}

function computeHarvest(startISO: string, vegDays: number, flowerDays: number) {
  return harvestDateISO(startISO, vegDays, flowerDays) ?? '—'
}
</script>
