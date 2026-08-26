<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/client'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const guildId = route.params.id as string
const commands = ref<any[]>([])
const loading = ref(true)
const showCreate = ref(false)
const editing = ref<any>(null)
const form = ref({ name: '', aliases: '', content: '' })

onMounted(async () => {
  await loadCommands()
})

async function loadCommands() {
  loading.value = true
  try {
    const { data } = await api.get(`/api/guilds/${guildId}/commands`)
    commands.value = data.commands
  } finally {
    loading.value = false
  }
}

function startCreate() {
  editing.value = null
  form.value = { name: '', aliases: '', content: '' }
  showCreate.value = true
}

function startEdit(cmd: any) {
  editing.value = cmd
  form.value = { name: cmd.name, aliases: cmd.aliases?.join(', ') || '', content: cmd.content }
  showCreate.value = true
}

async function submit() {
  const payload = {
    name: form.value.name,
    aliases: form.value.aliases.split(',').map((a: string) => a.trim()).filter(Boolean),
    content: form.value.content,
  }
  if (editing.value) {
    await api.patch(`/api/guilds/${guildId}/commands/${editing.value._id}`, payload)
  } else {
    await api.post(`/api/guilds/${guildId}/commands`, payload)
  }
  showCreate.value = false
  await loadCommands()
}

async function remove(id: string) {
  if (!confirm('Delete this command?')) return
  await api.delete(`/api/guilds/${guildId}/commands/${id}`)
  await loadCommands()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-white">Custom Commands</h1>
      <button @click="startCreate" class="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
        + New Command
      </button>
    </div>
    <LoadingSpinner v-if="loading" />
    <template v-else>
      <!-- Create/Edit form -->
      <div v-if="showCreate" class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6 space-y-4">
        <h3 class="font-medium text-white">{{ editing ? 'Edit Command' : 'Create Command' }}</h3>
        <div>
          <label class="block text-sm text-zinc-400 mb-1">Name</label>
          <input v-model="form.name" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="mycommand" />
        </div>
        <div>
          <label class="block text-sm text-zinc-400 mb-1">Aliases (comma separated)</label>
          <input v-model="form.aliases" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="alias1, alias2" />
        </div>
        <div>
          <label class="block text-sm text-zinc-400 mb-1">Content</label>
          <textarea v-model="form.content" rows="4" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-mono" placeholder="Response text..." />
        </div>
        <div class="flex gap-2">
          <button @click="submit" class="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            {{ editing ? 'Update' : 'Create' }}
          </button>
          <button @click="showCreate = false" class="text-zinc-500 hover:text-zinc-300 text-sm px-4 py-2">Cancel</button>
        </div>
      </div>

      <div v-if="commands.length === 0 && !showCreate" class="text-zinc-500 text-center py-8">No custom commands yet.</div>
      <div v-for="cmd in commands" :key="cmd._id" class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-2">
        <div class="flex items-center justify-between">
          <div>
            <span class="font-mono text-indigo-400">!{{ cmd.name }}</span>
            <span v-if="cmd.aliases?.length" class="text-zinc-600 text-xs ml-2">
              ({{ cmd.aliases.map((a: string) => '!' + a).join(', ') }})
            </span>
            <span class="text-zinc-600 text-xs ml-2">Used {{ cmd.uses }}x</span>
          </div>
          <div class="flex gap-2">
            <button @click="startEdit(cmd)" class="text-zinc-500 hover:text-indigo-400 text-sm">Edit</button>
            <button @click="remove(cmd._id)" class="text-zinc-500 hover:text-red-400 text-sm">Delete</button>
          </div>
        </div>
        <p class="mt-2 text-sm text-zinc-400 font-mono truncate">{{ cmd.content }}</p>
      </div>
    </template>
  </div>
</template>
