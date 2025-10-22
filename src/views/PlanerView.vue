<template>
  <h1>Grow-Planer</h1>

  <form @submit.prevent="addGrow" style="display:grid;gap:.5rem;max-width:420px">
    <input v-model="name" placeholder="Name" required />
    <input v-model="start" type="date" required />
    <input v-model.number="veg" type="number" min="0" placeholder="Veg-Tage" />
    <input v-model.number="flower" type="number" min="0" placeholder="Blüte-Tage" />
    <div>Erntedatum: <strong>{{ harvest }}</strong></div>
    <button type="submit">Speichern</button>
  </form>

  <hr />

  <ul>
    <li v-for="g in store.grows" :key="g.id">
      <div>
        <strong>{{ g.name }}</strong> — {{ g.status }}
      </div>
      <div>
        Start: {{ g.startDate.slice(0,10) }} |
        Veg: {{ g.vegDays }} Tage |
        Blüte: {{ g.flowerDays }} Tage
      </div>
      <div>
        Ernte:
        <strong>
          {{
            harvestDateISO(g.startDate, g.vegDays, g.flowerDays).slice(0,10)
          }}
        </strong>
      </div>
      <button @click="store.remove(g.id)">Löschen</button>
      <hr />
    </li>
  </ul>
</template>

<style>
@media (min-width: 1024px) {
  .planer {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGrowsStore } from '@/stores/grows'
import { harvestDateISO } from '@/utils/grow'

const store = useGrowsStore()
onMounted(() => store.load())

const name = ref('')
const start = ref(new Date().toISOString().slice(0,10))
const veg = ref(22)
const flower = ref(63)

const harvest = computed(() =>
  harvestDateISO(new Date(start.value).toISOString(), veg.value, flower.value).slice(0,10)
)
function addGrow() {
  store.add({
    name: name.value.trim(),
    startDate: new Date(start.value).toISOString(),
    vegDays: Number(veg.value)||0,
    flowerDays: Number(flower.value)||0,
  })
  name.value = ''
}
</script>
