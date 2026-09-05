<script setup lang="ts">
defineProps<{
  guild: {
    id: string
    name: string
    icon: string | null
    owner: boolean
    permissions: number
    hasBot: boolean
    inviteUrl: string
  }
}>()
</script>

<template>
  <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-indigo-500/50 hover:bg-zinc-900/80 transition-all">
    <h3 class="font-medium text-white truncate mb-4">{{ guild.name }}</h3>
    <router-link
      v-if="guild.hasBot"
      :to="`/guild/${guild.id}`"
      class="block text-center text-sm text-indigo-400 hover:text-white border border-indigo-500/50 hover:bg-indigo-600 font-medium rounded-lg px-4 py-2 transition-colors"
    >
      Dashboard
    </router-link>
    <a
      v-else
      :href="guild.inviteUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="block text-center text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg px-4 py-2 transition-colors"
    >
      Add Bot
    </a>
  </div>
</template>