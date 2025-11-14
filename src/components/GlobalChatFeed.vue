<template>
  <section class="mt-8">
    <div class="bg-neutral-900 border border-neutral-700 rounded-xl flex flex-col h-72">
      <header class="px-3 py-2 border-b border-neutral-700 flex items-center justify-between">
        <h2 class="text-sm font-semibold text-neutral-100">
          Globaler Chat (Beta)
        </h2>
        <span class="text-[10px] text-neutral-500">
          Alle eingeloggten User sehen das
        </span>
      </header>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto px-3 py-2 space-y-1 text-sm">
        <p v-if="!chat.isLoaded" class="text-neutral-500 text-xs">
          Lade Nachrichten...
        </p>

        <p v-else-if="chat.messages.length === 0" class="text-neutral-500 text-xs">
          Noch keine Nachrichten. Sei der Erste.
        </p>

        <div
          v-for="m in chat.messages"
          :key="m.id"
          class="text-neutral-200"
        >
          <div class="text-xs text-neutral-400">
            <span class="font-semibold text-emerald-300">
              {{ m.userName || 'User' }}
            </span>
            <span v-if="m.createdAt" class="ml-1 text-neutral-500">
              · {{ formatTime(m.createdAt) }}
            </span>
          </div>
          <p class="text-sm break-words">
            {{ m.text }}
          </p>
        </div>
      </div>

      <!-- Input -->
      <form
        class="border-t border-neutral-700 p-2 flex gap-2"
        @submit.prevent="handleSubmit"
      >
        <input
          v-model="draft"
          type="text"
          class="flex-1 bg-neutral-800 text-sm px-2 py-1 rounded-md outline-none border border-neutral-700 focus:border-emerald-400"
          placeholder="Kurz was droppen..."
        />
        <button
          type="submit"
          class="px-3 py-1 text-xs rounded-md bg-emerald-500 text-black font-semibold disabled:opacity-40"
          :disabled="!canSend"
        >
          Senden
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useChatStore } from '@/stores/chat'

const chat = useChatStore()
const draft = ref('')

onMounted(() => {
  chat.initListener()
})

onBeforeUnmount(() => {
  chat.dispose()
})

const canSend = computed(() => draft.value.trim().length > 0)

async function handleSubmit() {
  if (!canSend.value) return
  try {
    await chat.send(draft.value)
    draft.value = ''
  } catch (e) {
    console.error(e)
    // Optional: Toast / Fehleranzeige
  }
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
