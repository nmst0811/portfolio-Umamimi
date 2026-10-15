<script setup lang="ts">
import type { Post } from '#shared/types/content'

// 自サイトの記事は詳細ページへ、外部の記事は外部のURLへリンクする。
// 行全体がクリックできる(タイトルのリンクを、行の大きさまで広げている)。
defineProps<{ post: Post }>()
</script>

<template>
  <li class="group relative grid grid-cols-[6.5rem_1fr] gap-x-4 py-4 sm:grid-cols-[7rem_1fr_auto]">
    <time :datetime="post.date" class="text-muted">{{ formatDate(post.date) }}</time>
    <h3 class="font-bold">
      <a
        v-if="post.kind === 'external' && post.url"
        :href="post.url"
        target="_blank"
        rel="noopener noreferrer"
        class="decoration-accent underline-offset-4 group-hover:underline after:absolute after:inset-0"
      >
        {{ post.title }}<span class="sr-only">(新しいタブで開く)</span>
      </a>
      <NuxtLink
        v-else
        :to="`/blog/${post.id}`"
        class="decoration-accent underline-offset-4 group-hover:underline after:absolute after:inset-0"
      >
        {{ post.title }}
      </NuxtLink>
    </h3>
    <p class="col-start-2 text-sm text-muted sm:col-start-3 sm:self-center">
      <span>{{ post.category.join('、') }}</span>
      <span v-if="post.kind === 'external'" class="ml-3">{{ post.source }}の記事</span>
    </p>
  </li>
</template>
