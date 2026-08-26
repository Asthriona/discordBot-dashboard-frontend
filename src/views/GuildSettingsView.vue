<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/client'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const guildId = route.params.id as string
const settings = ref<any>(null)
const loading = ref(true)
const saving = ref(false)
const saved = ref(false)
const activeTab = ref('automod')

const tabs = [
  { id: 'automod', label: 'Automod' },
  { id: 'welcome', label: 'Welcome' },
  { id: 'leveling', label: 'Leveling' },
  { id: 'logging', label: 'Logging' },
  { id: 'roles', label: 'Roles' },
  { id: 'tickets', label: 'Tickets' },
  { id: 'general', label: 'General' },
]

onMounted(async () => {
  try {
    const { data } = await api.get(`/api/guilds/${guildId}/settings`)
    settings.value = reactive(data.settings)
  } finally {
    loading.value = false
  }
})

async function save() {
  saving.value = true
  saved.value = false
  try {
    await api.patch(`/api/guilds/${guildId}/settings`, { settings: settings.value })
    saved.value = true
    setTimeout(() => (saved.value = false), 2000)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <template v-else-if="settings">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-white">Settings</h1>
        <button
          @click="save"
          :disabled="saving"
          class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
        >
          {{ saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes' }}
        </button>
      </div>

      <div class="flex gap-1 mb-6 border-b border-zinc-800 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
          :class="activeTab === tab.id ? 'text-white border-b-2 border-indigo-500' : 'text-zinc-500 hover:text-zinc-300'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Automod -->
      <div v-if="activeTab === 'automod'" class="space-y-4">
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="settings.automod.enabled" class="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-indigo-500" />
            <span class="text-sm text-zinc-300">Enable automod</span>
          </label>
          <div>
            <label class="block text-sm text-zinc-400 mb-1">Blocked keywords (comma separated)</label>
            <input v-model="settings.automod.keywords" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="word1, word2" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-zinc-400 mb-1">Max mentions</label>
              <input type="number" v-model.number="settings.automod.maxMentions" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label class="block text-sm text-zinc-400 mb-1">Spam threshold</label>
              <input type="number" v-model.number="settings.automod.spamThreshold" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
          </div>
          <div>
            <label class="block text-sm text-zinc-400 mb-1">Action</label>
            <select v-model="settings.automod.action" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white">
              <option value="delete">Delete</option>
              <option value="warn">Warn</option>
              <option value="mute">Mute</option>
              <option value="kick">Kick</option>
            </select>
          </div>
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="settings.automod.blockedInvites" class="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-indigo-500" />
            <span class="text-sm text-zinc-300">Block invite links</span>
          </label>
        </div>
      </div>

      <!-- Welcome -->
      <div v-if="activeTab === 'welcome'" class="space-y-4">
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="settings.welcome.enabled" class="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-indigo-500" />
            <span class="text-sm text-zinc-300">Enable welcome/leave messages</span>
          </label>
          <div>
            <label class="block text-sm text-zinc-400 mb-1">Channel ID</label>
            <input v-model="settings.welcome.channelId" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="1234567890" />
          </div>
          <div>
            <label class="block text-sm text-zinc-400 mb-1">Join message</label>
            <input v-model="settings.welcome.joinMessage" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label class="block text-sm text-zinc-400 mb-1">Leave message</label>
            <input v-model="settings.welcome.leaveMessage" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" />
          </div>
        </div>
      </div>

      <!-- Leveling -->
      <div v-if="activeTab === 'leveling'" class="space-y-4">
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="settings.leveling.enabled" class="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-indigo-500" />
            <span class="text-sm text-zinc-300">Enable leveling</span>
          </label>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-zinc-400 mb-1">XP per message</label>
              <input type="number" v-model.number="settings.leveling.xpPerMessage" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label class="block text-sm text-zinc-400 mb-1">XP cooldown (seconds)</label>
              <input type="number" v-model.number="settings.leveling.xpCooldownSeconds" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
          </div>
          <div>
            <label class="block text-sm text-zinc-400 mb-1">Level-up channel ID</label>
            <input v-model="settings.leveling.levelUpChannelId" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="Leave empty for current channel" />
          </div>
        </div>
      </div>

      <!-- Logging -->
      <div v-if="activeTab === 'logging'" class="space-y-4">
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="settings.logging.enabled" class="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-indigo-500" />
            <span class="text-sm text-zinc-300">Enable logging</span>
          </label>
          <div>
            <label class="block text-sm text-zinc-400 mb-1">Log channel ID</label>
            <input v-model="settings.logging.channelId" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" />
          </div>
          <div class="space-y-2">
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" v-model="settings.logging.memberEvents" class="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-indigo-500" />
              <span class="text-sm text-zinc-300">Member events</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" v-model="settings.logging.messageEvents" class="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-indigo-500" />
              <span class="text-sm text-zinc-300">Message events</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" v-model="settings.logging.voiceEvents" class="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-indigo-500" />
              <span class="text-sm text-zinc-300">Voice events</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Roles -->
      <div v-if="activeTab === 'roles'" class="space-y-4">
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div>
            <label class="block text-sm text-zinc-400 mb-1">Auto-role ID</label>
            <input v-model="settings.roles.autoRoleId" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="Role ID for new members" />
          </div>
          <div>
            <label class="block text-sm text-zinc-400 mb-2">Self-assign roles</label>
            <div v-if="settings.roles.selfAssignRoles?.length" class="space-y-2">
              <div v-for="(role, i) in settings.roles.selfAssignRoles" :key="i" class="flex gap-2 items-center">
                <input v-model="role.roleId" placeholder="Role ID" class="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" />
                <input v-model="role.label" placeholder="Label" class="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" />
                <button @click="settings.roles.selfAssignRoles.splice(i, 1)" class="text-red-400 hover:text-red-300 text-sm">Remove</button>
              </div>
            </div>
            <button @click="settings.roles.selfAssignRoles.push({ roleId: '', label: '', emoji: '' })" class="text-sm text-indigo-400 hover:text-indigo-300 mt-2">+ Add role</button>
          </div>
        </div>
      </div>

      <!-- Tickets -->
      <div v-if="activeTab === 'tickets'" class="space-y-4">
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" v-model="settings.tickets.enabled" class="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-indigo-500" />
            <span class="text-sm text-zinc-300">Enable tickets</span>
          </label>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-zinc-400 mb-1">Category ID</label>
              <input v-model="settings.tickets.categoryId" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label class="block text-sm text-zinc-400 mb-1">Support role ID</label>
              <input v-model="settings.tickets.supportRoleId" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label class="block text-sm text-zinc-400 mb-1">Transcript channel ID</label>
              <input v-model="settings.tickets.transcriptChannelId" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label class="block text-sm text-zinc-400 mb-1">Panel channel ID</label>
              <input v-model="settings.tickets.panelChannelId" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- General -->
      <div v-if="activeTab === 'general'" class="space-y-4">
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div>
            <label class="block text-sm text-zinc-400 mb-1">Moderation log channel ID</label>
            <input v-model="settings.modlogChannelId" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label class="block text-sm text-zinc-400 mb-1">Muted role ID</label>
            <input v-model="settings.mutedRoleId" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label class="block text-sm text-zinc-400 mb-1">Poll channel ID</label>
            <input v-model="settings.pollChannelId" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
