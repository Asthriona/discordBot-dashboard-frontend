<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/client'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const guildId = route.params.id as string
const polls = ref<any[]>([])
const tickets = ref<any[]>([])
const loading = ref(true)
const activeTab = ref('polls')

onMounted(async () => {
  try {
    const { data } = await api.get(`/api/guilds/${guildId}/polls-tickets`)
    polls.value = data.polls
    tickets.value = data.tickets
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
    <h1 class="text-2xl font-bold text-white mb-6">Polls & Tickets</h1>
    <LoadingSpinner v-if="loading" />
    <template v-else>
      <div class="flex gap-1 mb-6 border-b border-zinc-800">
        <button
          @click="activeTab = 'polls'"
          class="px-4 py-2 text-sm font-medium transition-colors"
          :class="activeTab === 'polls' ? 'text-white border-b-2 border-indigo-500' : 'text-zinc-500 hover:text-zinc-300'"
        >
          Polls ({{ polls.length }})
        </button>
        <button
          @click="activeTab = 'tickets'"
          class="px-4 py-2 text-sm font-medium transition-colors"
          :class="activeTab === 'tickets' ? 'text-white border-b-2 border-indigo-500' : 'text-zinc-500 hover:text-zinc-300'"
        >
          Tickets ({{ tickets.length }})
        </button>
      </div>

      <div v-if="activeTab === 'polls'" class="space-y-2">
        <div v-if="polls.length === 0" class="text-zinc-500 text-center py-8">No polls found.</div>
        <div v-for="poll in polls" :key="poll._id" class="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium text-white">{{ poll.question }}</h3>
            <span class="text-xs px-2 py-1 rounded" :class="poll.open ? 'bg-green-500/20 text-green-400' : 'bg-zinc-700 text-zinc-400'">
              {{ poll.open ? 'Open' : 'Closed' }}
            </span>
          </div>
          <div class="space-y-1">
            <div v-for="opt in poll.options" :key="opt.label" class="flex items-center gap-2 text-sm">
              <span class="text-zinc-400">{{ opt.label }}</span>
              <span class="text-zinc-600">({{ opt.votes?.length || 0 }} votes)</span>
            </div>
          </div>
          <p class="text-xs text-zinc-600 mt-2">Created {{ formatDate(poll.createdAt) }}</p>
        </div>
      </div>

      <div v-if="activeTab === 'tickets'" class="space-y-2">
        <div v-if="tickets.length === 0" class="text-zinc-500 text-center py-8">No tickets found.</div>
        <div v-for="ticket in tickets" :key="ticket._id" class="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-sm text-zinc-300">{{ ticket.topic || 'No topic' }}</span>
              <span class="text-xs text-zinc-600 ml-2">by <span class="font-mono">{{ ticket.ownerId }}</span></span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs px-2 py-1 rounded" :class="ticket.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-700 text-zinc-400'">
                {{ ticket.status }}
              </span>
              <span class="text-xs text-zinc-600">{{ formatDate(ticket.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
