import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/client'

interface User {
  id: string
  username: string
  discriminator: string
  avatar: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  async function fetchUser() {
    try {
      loading.value = true
      const { data } = await api.get('/auth/me')
      user.value = data.user
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  function login() {
    window.location.href = `${import.meta.env.VITE_API_URL || ''}/auth/discord`
  }

  async function logout() {
    await api.get('/auth/logout')
    user.value = null
  }

  return { user, loading, fetchUser, login, logout }
})
