<script setup lang="ts">
import type { Work } from '#shared/types/content'

// カード全体がクリックできる(タイトルのリンクを、カードの大きさまで広げている)。
// フォーカス枠はタイトルだけに付くので、面取り(clip-path)で切れない。
defineProps<{
  work: Work
  featured?: boolean
}>()
</script>

<template>
  <article class="group relative">
    <div class="relative">
      <CropMarks />
      <div class="chamfer aspect-video bg-surface" :class="featured ? '[--c:22px]' : '[--c:14px]'">
        <img
          v-if="work.thumbnail"
          :src="work.thumbnail"
          alt=""
          width="960"
          height="540"
          loading="lazy"
          decoding="async"
          class="size-full object-cover"
        />
        <!-- サムネイルがないときの面 -->
        <div v-else class="flex size-full items-center justify-center">
          <Decagon outline class="size-12 text-line" />
        </div>
      </div>
    </div>
    <div class="mt-3 flex items-baseline justify-between gap-4 text-sm text-muted">
      <p>{{ work.kind }}・{{ work.category }}</p>
      <time :datetime="work.date">{{ formatDate(work.date) }}</time>
    </div>
    <h3 class="mt-1 font-bold" :class="featured ? 'text-2xl' : 'text-lg'">
      <NuxtLink
        :to="`/works/${work.id}`"
        class="decoration-accent underline-offset-4 group-hover:underline after:absolute after:inset-0"
      >
        {{ work.title }}
      </NuxtLink>
    </h3>
    <p v-if="work.summary" class="mt-1 line-clamp-2 text-sm text-muted" :class="featured ? 'md:line-clamp-3' : ''">
      {{ work.summary }}
    </p>
  </article>
</template>
