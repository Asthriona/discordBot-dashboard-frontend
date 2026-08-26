<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] text-center">
    <h1 class="text-4xl font-bold text-white mb-4">Discord Bot Dashboard</h1>
    <p class="text-zinc-400 text-lg mb-8 max-w-md">
      Manage your server's bot settings, moderation logs, custom commands, and more.
    </p>
    <button
      v-if="!auth.user"
      @click="auth.login()"
      class="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-lg transition-colors text-lg"
    >
      Login with Discord
    </button>
    <router-link
      v-else
      to="/dashboard"
      class="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-lg transition-colors text-lg"
    >
      Go to Dashboard
    </router-link>
  </div>
</template>
