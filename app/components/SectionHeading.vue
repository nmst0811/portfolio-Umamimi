<script setup lang="ts">
// セクションの見出し。タイトルから、リンク(行き先)までを細い線で結ぶ。
defineProps<{
  id: string
  title: string
  to?: string
  linkLabel?: string
}>()
</script>

<template>
  <div class="flex items-center gap-4">
    <h2 :id="id" class="text-2xl font-bold">{{ title }}</h2>
    <span class="relative h-px min-w-6 flex-1 bg-line" aria-hidden="true">
      <span class="absolute top-1/2 right-0 size-1.5 -translate-y-1/2 rounded-full bg-accent" />
    </span>
    <NuxtLink
      v-if="to"
      :to="to"
      class="shrink-0 text-sm text-muted underline decoration-line underline-offset-4 transition-colors hover:text-fg hover:decoration-accent"
    >
      {{ linkLabel ?? 'すべて見る' }}
    </NuxtLink>
  </div>
</template>
