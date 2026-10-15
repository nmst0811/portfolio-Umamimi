<script setup lang="ts">
const works = await useWorks()
const posts = await usePosts()
const { upcoming, past } = await useEvents()

// 開催予定を先に、そのあとに最近終わったものを並べる
const events = computed(() => [
  ...upcoming.value.map((event) => ({ event, upcoming: true })),
  ...past.value.map((event) => ({ event, upcoming: false })),
].slice(0, 3))

usePageMeta({ title: 'Umamimi' })
</script>

<template>
  <div>
    <section class="relative overflow-hidden border-b border-line">
      <div class="relative mx-auto grid max-w-6xl items-center gap-6 px-5 py-12 md:grid-cols-[1.1fr_1fr] md:py-16">
        <div>
          <h1 class="font-display text-6xl leading-none sm:text-7xl lg:text-8xl"><Wordmark /></h1>
          <p class="mt-6 text-lg">
            <span class="block">2018年からMMD動画を作っています。</span>
            <span class="block">舞台照明もやっています。</span>
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <AppButton to="/works">作品を見る</AppButton>
            <NuxtLink
              to="/profile"
              class="underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
            >
              プロフィール
            </NuxtLink>
          </div>
        </div>

        <CharacterWindow
          beams
          drawing
          priority
          alt="Umamimi のオリジナルキャラクター。十角形のメガネをかけた、青緑の髪にうさぎ耳の少女"
          class="mx-auto w-full max-w-md md:max-w-none"
        />
      </div>
    </section>

    <section aria-labelledby="works" class="mx-auto max-w-6xl px-5 pt-16">
      <SectionHeading id="works" title="作品" to="/works" link-label="すべての作品" />
      <div v-if="works.length" class="mt-6 grid gap-x-6 gap-y-8 lg:grid-cols-[2fr_1fr]">
        <WorkCard :work="works[0]!" featured />
        <div class="grid content-start gap-8 sm:grid-cols-2 lg:grid-cols-1">
          <WorkCard v-for="work in works.slice(1, 3)" :key="work.id" :work="work" />
        </div>
      </div>
      <p v-else class="mt-6 text-muted">作品はまだありません。</p>
    </section>

    <div class="mx-auto grid max-w-6xl gap-14 px-5 py-16 lg:grid-cols-2 lg:gap-12">
      <section aria-labelledby="blog">
        <SectionHeading id="blog" title="ブログ" to="/blog" link-label="すべての記事" />
        <ul v-if="posts.length" class="mt-4 divide-y divide-line border-y border-line">
          <PostRow v-for="post in posts.slice(0, 3)" :key="post.id" :post="post" />
        </ul>
        <p v-else class="mt-4 text-muted">記事はまだありません。</p>
      </section>
      <section aria-labelledby="events">
        <SectionHeading id="events" title="イベント" to="/events" link-label="すべてのイベント" />
        <ul v-if="events.length" class="mt-4 divide-y divide-line border-y border-line">
          <EventRow v-for="item in events" :key="item.event.id" :event="item.event" :upcoming="item.upcoming" compact />
        </ul>
        <p v-else class="mt-4 text-muted">イベントはまだありません。</p>
      </section>
    </div>
  </div>
</template>
