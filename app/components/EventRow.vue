<script setup lang="ts">
import type { EventItem } from '#shared/types/content'

// 行全体がクリックできる(名称のリンクを、行の大きさまで広げている)。
const props = defineProps<{
  event: EventItem
  /** 開催予定か(予定/終了は、呼び出し側が開催日から決める) */
  upcoming: boolean
  /** 概要を出さずに、1行を短くする(トップページ用) */
  compact?: boolean
}>()

const md = computed(() => monthDay(props.event.date))
</script>

<template>
  <li class="group relative grid grid-cols-[4.5rem_1fr_auto] items-center gap-x-4 py-4">
    <time :datetime="event.date" class="leading-tight">
      <span class="block text-sm text-muted">{{ md.month }}月</span>
      <span class="block font-display text-4xl" :class="upcoming ? 'text-accent' : 'text-fg'">{{ md.day }}</span>
    </time>
    <div>
      <h3 class="font-bold">
        <NuxtLink
          :to="`/events/${event.id}`"
          class="decoration-accent underline-offset-4 group-hover:underline after:absolute after:inset-0"
        >
          {{ event.name }}
        </NuxtLink>
      </h3>
      <p class="text-sm text-muted">
        <span v-if="event.dateText" class="mr-3">{{ event.dateText }}</span>
        <span>{{ event.place }}</span>
      </p>
      <p v-if="event.summary && !compact" class="mt-1 line-clamp-2 text-sm text-muted">{{ event.summary }}</p>
    </div>
    <p class="text-sm" :class="upcoming ? 'font-bold text-accent' : 'text-muted'">{{ upcoming ? '予定' : '終了' }}</p>
  </li>
</template>
