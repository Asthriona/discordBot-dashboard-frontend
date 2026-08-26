<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/client'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const guildId = route.params.id as string
const leaderboard = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await api.get(`/api/leaderboard/${guildId}`)
    leaderboard.value = data.leaderboard
  } finally {
    loading.value = false
  }
})

function medal(i: number) {
  if (i === 0) return '🥇'
  if (i === 1) return '🥈'
  if (i === 2) return '🥉'
  return `#${i + 1}`
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-white mb-6">Leaderboard</h1>
    <LoadingSpinner v-if="loading" />
    <div v-else-if="leaderboard.length === 0" class="text-zinc-500 text-center py-12">
      No members on the leaderboard yet.
    </div>
    <div v-else class="space-y-2">
      <div
        v-for="(entry, i) in leaderboard"
        :key="entry.userId"
        class="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center gap-4"
      >
        <span class="w-10 text-center text-lg" :class="{ 'text-yellow-400': i < 3 }">{{ medal(i) }}</span>
        <div class="flex-1 min-w-0">
          <span class="font-mono text-sm text-zinc-300">{{ entry.userId }}</span>
        </div>
        <div class="text-right">
          <span class="text-sm font-medium text-white">Level {{ entry.level }}</span>
          <span class="text-xs text-zinc-500 block">{{ entry.xp.toLocaleString() }} XP</span>
        </div>
      </div>
    </div>
  </div>
</template>
