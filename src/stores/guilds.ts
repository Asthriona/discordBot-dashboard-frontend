import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/client'

interface Guild {
  id: string
  name: string
  icon: string | null
  owner: boolean
  permissions: number
  hasBot: boolean
  inviteUrl: string
}

export const useGuildStore = defineStore('guilds', () => {
  const guilds = ref<Guild[]>([])
  const loading = ref(false)

  async function fetchGuilds() {
    try {
      loading.value = true
      const { data } = await api.get('/api/guilds')
      guilds.value = data.guilds
    } finally {
      loading.value = false
    }
  }

  return { guilds, loading, fetchGuilds }
})
