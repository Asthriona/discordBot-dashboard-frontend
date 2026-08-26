<script setup lang="ts">
defineProps<{ size?: 'sm' | 'md' | 'lg' }>()
</script>

<template>
  <div class="flex items-center justify-center" :class="size === 'lg' ? 'py-12' : 'py-6'">
    <div
      class="animate-spin rounded-full border-2 border-zinc-700 border-t-indigo-500"
      :class="size === 'lg' ? 'w-10 h-10' : size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'"
    />
  </div>
</template>
