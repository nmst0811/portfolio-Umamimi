<script setup lang="ts">
const route = useRoute()
const post = await usePostDetail(String(route.params.id))

usePageMeta({ title: post.value.title, description: `Umamimi のブログ(${post.value.category.join('、')})`, type: 'article' })
</script>

<template>
  <article class="mx-auto max-w-4xl px-5 py-12">
    <NuxtLink
      to="/blog"
      class="inline-flex min-h-11 items-center underline decoration-line underline-offset-4 hover:decoration-accent"
    >
      記事の一覧に戻る
    </NuxtLink>

    <div class="mt-2">
      <PageHeader :title="post.title" terminal="parallelogram" />
    </div>

    <p class="mt-6 flex flex-wrap gap-x-5 text-sm text-muted">
      <span>{{ post.category.join('、') }}</span>
      <time :datetime="post.date">{{ formatDate(post.date) }}</time>
    </p>

    <!-- 本文は、自分で管理している microCMS の内容 -->
    <div v-if="post.body" class="rich mt-8 max-w-2xl" v-html="post.body" />
  </article>
</template>
