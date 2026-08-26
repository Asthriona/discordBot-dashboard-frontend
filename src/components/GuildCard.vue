<script setup lang="ts">
defineProps<{
  guild: {
    id: string
    name: string
    icon: string | null
    owner: boolean
    permissions: number
  }
}>()
</script>

<template>
  <router-link
    :to="`/guild/${guild.id}`"
    class="block bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-indigo-500/50 hover:bg-zinc-900/80 transition-all"
  >
    <div class="flex items-center gap-3">
      <img
        v-if="guild.icon"
        :src="`https://cdn.discordapp.com/guilds/${guild.id}/icons/${guild.icon}.png`"
        class="w-12 h-12 rounded-full"
      />
      <div v-else class="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-bold">
        {{ guild.name.charAt(0) }}
      </div>
      <div class="min-w-0">
        <h3 class="font-medium text-white truncate">{{ guild.name }}</h3>
        <p class="text-xs text-zinc-500">ID: {{ guild.id }}</p>
      </div>
    </div>
  </router-link>
</template>
