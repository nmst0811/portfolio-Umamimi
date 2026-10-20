<script setup lang="ts">
const route = useRoute()
const work = await useWorkDetail(String(route.params.id))

usePageMeta({
  title: work.value.title,
  description: work.value.summary ?? `${work.value.kind}(${work.value.category})`,
})
</script>

<template>
  <article class="mx-auto max-w-4xl px-5 py-12">
    <NuxtLink
      to="/works"
      class="inline-flex min-h-11 items-center underline decoration-line underline-offset-4 hover:decoration-accent"
    >
      作品の一覧に戻る
    </NuxtLink>

    <div class="mt-2">
      <PageHeader :title="work.title" terminal="circle" />
    </div>

    <p class="mt-6 flex flex-wrap gap-x-5 text-sm text-muted">
      <span>{{ work.kind }}</span>
      <span>{{ work.category }}</span>
      <time :datetime="work.date">{{ formatDate(work.date) }}</time>
      <span v-if="work.platform">{{ work.platform }}</span>
    </p>

    <!-- 埋め込みプレーヤー(動画のうち YouTube とニコニコ動画だけ) -->
    <div v-if="work.embedUrl" class="relative mt-6">
      <CropMarks />
      <div class="aspect-video bg-surface">
        <iframe
          :src="work.embedUrl"
          :title="`${work.title}(${work.platform}の動画)`"
          class="size-full"
          loading="lazy"
          allow="encrypted-media; picture-in-picture; fullscreen"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
    <p v-if="work.url" class="mt-3">
      <a
        :href="work.url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex min-h-11 items-center underline decoration-line underline-offset-4 hover:decoration-accent"
      >
        {{ work.platform }}で見る<span class="sr-only">(新しいタブで開く)</span>
      </a>
    </p>

    <!-- 画像(サムネイルと画像(複数)の全部) -->
    <ImageGallery :images="work.images" :name="work.title" :eager="!work.embedUrl" />

    <p v-if="work.summary" class="mt-6 text-lg">{{ work.summary }}</p>

    <!-- プロダクトの配布先やソースなど。本文が長くなっても見つけられるよう、本文より先に出す -->
    <section v-if="work.links.length" aria-labelledby="links" class="mt-8 border-t border-line pt-6">
      <h2 id="links" class="font-bold">関連リンク</h2>
      <ul class="mt-2">
        <li v-for="link in work.links" :key="link.href">
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

    <!-- 本文は、自分で管理している microCMS の内容 -->
    <div v-if="work.body" class="rich mt-8" v-html="work.body" />
  </article>
</template>
