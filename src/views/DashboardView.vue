<script setup lang="ts">
import { onMounted } from 'vue'
import { useGuildStore } from '../stores/guilds'
import GuildCard from '../components/GuildCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const guilds = useGuildStore()

onMounted(() => {
  guilds.fetchGuilds()
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-white mb-6">Your Servers</h1>
    <LoadingSpinner v-if="guilds.loading" />
    <div v-else-if="guilds.guilds.length === 0" class="text-zinc-500 text-center py-12">
      No servers found. Make sure the bot is in your server.
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <GuildCard v-for="guild in guilds.guilds" :key="guild.id" :guild="guild" />
    </div>
  </div>
</template>
