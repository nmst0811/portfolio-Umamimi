<script setup lang="ts">

// 予定/終了は開催日から判定する。静的サイトはビルド後に日付が進むため、ブラウザで開いたときにも判定し直す(useToday)
const { upcoming, past } = await useEvents()

usePageMeta({ title: 'イベント', description: 'Umamimi が参加・運営するイベントの予定と記録。' })
</script>

<template>
  <div class="mx-auto max-w-4xl px-5 py-12">
    <PageHeader title="イベント" terminal="dots" />

    <section aria-labelledby="upcoming" class="mt-10">
      <SectionHeading id="upcoming" title="開催予定" />
      <ul v-if="upcoming.length" class="mt-4 divide-y divide-line border-y border-line">
        <EventRow v-for="event in upcoming" :key="event.id" :event="event" upcoming />
      </ul>
      <div v-else class="mt-4">
        <p class="text-muted">開催予定のイベントはありません。</p>
        <a href="#past" class="mt-2 inline-block underline decoration-line underline-offset-4 hover:decoration-accent">
          終了したイベントを見る
        </a>
      </div>
    </section>

    <section aria-labelledby="past" class="mt-14">
      <SectionHeading id="past" title="終了したイベント" />
      <ul v-if="past.length" class="mt-4 divide-y divide-line border-y border-line">
        <EventRow v-for="event in past" :key="event.id" :event="event" :upcoming="false" />
      </ul>
      <p v-else class="mt-4 text-muted">終了したイベントはまだありません。</p>
    </section>
  </div>
</template>
