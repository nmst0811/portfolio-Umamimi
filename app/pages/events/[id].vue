<script setup lang="ts">
import { eventStatus } from '#shared/utils/date'

const route = useRoute()
const event = await useEventDetail(String(route.params.id))
const today = useToday()
const upcoming = computed(() => eventStatus(event.value.date, today.value) === '予定')

usePageMeta({
  title: event.value.name,
  description: event.value.summary ?? `${event.value.dateText || formatDate(event.value.date)} ${event.value.place}`,
})
</script>

<template>
  <article class="mx-auto max-w-4xl px-5 py-12">
    <NuxtLink
      to="/events"
      class="inline-flex min-h-11 items-center underline decoration-line underline-offset-4 hover:decoration-accent"
    >
      イベントの一覧に戻る
    </NuxtLink>

    <div class="mt-2">
      <PageHeader :title="event.name" terminal="dots" />
    </div>

    <p class="mt-6 flex flex-wrap items-baseline gap-x-5 text-sm text-muted">
      <span class="font-bold" :class="upcoming ? 'text-accent' : ''">{{ upcoming ? '予定' : '終了' }}</span>
      <time :datetime="event.date">{{ event.dateText || formatDate(event.date) }}</time>
      <span>{{ event.place }}</span>
    </p>

    <!-- 画像(複数)。一覧には出さず、詳細ページにだけ並べる -->
    <ImageGallery :images="event.images" :name="event.name" eager />

    <p v-if="event.summary" class="mt-6 text-lg">{{ event.summary }}</p>
    <!-- 本文は、自分で管理している microCMS の内容 -->
    <div v-if="event.body" class="rich mt-8" v-html="event.body" />

    <section v-if="event.links.length" aria-labelledby="links" class="mt-10 border-t border-line pt-6">
      <h2 id="links" class="font-bold">関連リンク</h2>
      <ul class="mt-2">
        <li v-for="link in event.links" :key="link.href">
          <a
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex min-h-11 items-center underline decoration-line underline-offset-4 hover:decoration-accent"
          >
            {{ link.label }}<span class="sr-only">(新しいタブで開く)</span>
          </a>
        </li>
      </ul>
    </section>
  </article>
</template>
