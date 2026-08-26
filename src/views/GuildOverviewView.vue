<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/client'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const guildId = route.params.id as string
const guild = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await api.get(`/api/guilds/${guildId}`)
    guild.value = data.guild
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <template v-else-if="guild">
      <div class="flex items-center gap-4 mb-8">
        <img
          v-if="guild.icon"
          :src="`https://cdn.discordapp.com/guilds/${guildId}/icons/${guild.icon}.png`"
          class="w-16 h-16 rounded-full"
        />
        <div v-else class="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold">
          {{ guild.name.charAt(0) }}
        </div>
        <div>
          <h1 class="text-2xl font-bold text-white">{{ guild.name }}</h1>
          <p class="text-zinc-500 text-sm">{{ guild.memberCount?.toLocaleString() }} members</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <router-link
          :to="`/guild/${guildId}/settings`"
          class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all"
        >
          <h3 class="font-medium text-white mb-1">Settings</h3>
          <p class="text-sm text-zinc-500">Automod, welcome, leveling, logging, roles, tickets</p>
        </router-link>
        <router-link
          :to="`/guild/${guildId}/modlog`"
          class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all"
        >
          <h3 class="font-medium text-white mb-1">Moderation Logs</h3>
          <p class="text-sm text-zinc-500">Warnings, mutes, kicks, bans</p>
        </router-link>
        <router-link
          :to="`/guild/${guildId}/commands`"
          class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all"
        >
          <h3 class="font-medium text-white mb-1">Custom Commands</h3>
          <p class="text-sm text-zinc-500">Create and manage tags</p>
        </router-link>
        <router-link
          :to="`/leaderboard/${guildId}`"
          class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all"
        >
          <h3 class="font-medium text-white mb-1">Leaderboard</h3>
          <p class="text-sm text-zinc-500">XP rankings (public)</p>
        </router-link>
        <router-link
          :to="`/guild/${guildId}/polls-tickets`"
          class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all"
        >
          <h3 class="font-medium text-white mb-1">Polls & Tickets</h3>
          <p class="text-sm text-zinc-500">Active polls and ticket history</p>
        </router-link>
      </div>
    </template>
  </div>
</template>
