<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/client'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const guildId = route.params.id as string
const warnings = ref<any[]>([])
const punishments = ref<any[]>([])
const loading = ref(true)
const activeTab = ref('warnings')

onMounted(async () => {
  try {
    const { data } = await api.get(`/api/guilds/${guildId}/modlog`)
    warnings.value = data.warnings
    punishments.value = data.punishments
  } finally {
    loading.value = false
  }
})

function formatDate(d: string) {
  return new Date(d).toLocaleString()
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-white mb-6">Moderation Logs</h1>
    <LoadingSpinner v-if="loading" />
    <template v-else>
      <div class="flex gap-1 mb-6 border-b border-zinc-800">
        <button
          @click="activeTab = 'warnings'"
          class="px-4 py-2 text-sm font-medium transition-colors"
          :class="activeTab === 'warnings' ? 'text-white border-b-2 border-indigo-500' : 'text-zinc-500 hover:text-zinc-300'"
        >
          Warnings ({{ warnings.length }})
        </button>
        <button
          @click="activeTab = 'punishments'"
          class="px-4 py-2 text-sm font-medium transition-colors"
          :class="activeTab === 'punishments' ? 'text-white border-b-2 border-indigo-500' : 'text-zinc-500 hover:text-zinc-300'"
        >
          Timed Punishments ({{ punishments.length }})
        </button>
      </div>

      <div v-if="activeTab === 'warnings'" class="space-y-2">
        <div v-if="warnings.length === 0" class="text-zinc-500 text-center py-8">No warnings found.</div>
        <div v-for="w in warnings" :key="w._id" class="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-xs font-mono px-2 py-1 rounded" :class="{
                'bg-yellow-500/20 text-yellow-400': w.action === 'warning',
                'bg-orange-500/20 text-orange-400': w.action === 'mute',
                'bg-red-500/20 text-red-400': w.action === 'kick',
                'bg-red-600/20 text-red-300': w.action === 'ban',
              }">{{ w.action }}</span>
              <span class="text-sm text-zinc-300">User: <span class="font-mono">{{ w.userId }}</span></span>
              <span class="text-sm text-zinc-500">by <span class="font-mono">{{ w.moderatorId }}</span></span>
            </div>
            <span class="text-xs text-zinc-600">{{ formatDate(w.createdAt) }}</span>
          </div>
          <p v-if="w.reason" class="mt-2 text-sm text-zinc-400">{{ w.reason }}</p>
        </div>
      </div>

      <div v-if="activeTab === 'punishments'" class="space-y-2">
        <div v-if="punishments.length === 0" class="text-zinc-500 text-center py-8">No timed punishments found.</div>
        <div v-for="p in punishments" :key="p._id" class="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-xs font-mono px-2 py-1 rounded" :class="{
                'bg-orange-500/20 text-orange-400': p.type === 'unmute',
                'bg-red-500/20 text-red-400': p.type === 'unban',
              }">{{ p.type }}</span>
              <span class="text-sm text-zinc-300">Target: <span class="font-mono">{{ p.targetId }}</span></span>
              <span v-if="p.executed" class="text-xs text-green-500">Executed</span>
              <span v-else class="text-xs text-yellow-500">Pending</span>
            </div>
            <span class="text-xs text-zinc-600">Executes: {{ formatDate(p.executeAt) }}</span>
          </div>
          <p v-if="p.reason" class="mt-2 text-sm text-zinc-400">{{ p.reason }}</p>
        </div>
      </div>
    </template>
  </div>
</template>
