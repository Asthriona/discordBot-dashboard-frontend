<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
</script>

<template>
  <nav class="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" class="text-lg font-bold text-white hover:text-indigo-400 transition-colors">
        Bot Dashboard
      </router-link>
      <div class="flex items-center gap-4">
        <template v-if="auth.user">
          <router-link to="/dashboard" class="text-sm text-zinc-400 hover:text-white transition-colors">
            Dashboard
          </router-link>
          <div class="flex items-center gap-2">
            <img
              v-if="auth.user.avatar"
              :src="`https://cdn.discordapp.com/avatars/${auth.user.id}/${auth.user.avatar}.png`"
              class="w-8 h-8 rounded-full"
            />
            <span class="text-sm text-zinc-300">{{ auth.user.username }}</span>
            <button
              @click="auth.logout(); router.push('/')"
              class="text-sm text-zinc-500 hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        </template>
        <template v-else>
          <button
            @click="auth.login()"
            class="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Login with Discord
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>
