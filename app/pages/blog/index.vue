<script setup lang="ts">
import { postCategoryOrder } from '#shared/types/content'

const posts = await usePosts()

usePageMeta({ title: 'ブログ', description: 'Umamimi のブログ。技術・照明・映像・イベント運営などの記事。' })

const all = 'すべて'

// 絞り込みの選択肢は、記事に付いているカテゴリだけ(記事がないカテゴリのボタンは出さない)。
// 並びは postCategoryOrder の順で、あとから microCMS に足したカテゴリはそのあとに並べる
const categories = computed(() => {
  const found = new Set(posts.value.flatMap((post) => post.category))
  const known: string[] = postCategoryOrder.filter((category) => found.has(category))
  return [...known, ...[...found].filter((category) => !known.includes(category))]
})
const category = ref(all)

// カテゴリは複数選べるので、選んだカテゴリを1つでも持つ記事を出す
const shown = computed(() =>
  category.value === all ? posts.value : posts.value.filter((post) => post.category.includes(category.value)),
)
</script>

<template>
  <div class="mx-auto max-w-4xl px-5 py-12">
    <PageHeader title="ブログ" terminal="parallelogram" />

    <FilterGroup v-if="categories.length > 1" v-model="category" class="mt-8" label="カテゴリで絞り込む" :options="[all, ...categories]" />

    <h2 class="sr-only">記事の一覧</h2>
    <ul v-if="shown.length" class="mt-8 divide-y divide-line border-y border-line">
      <PostRow v-for="post in shown" :key="post.id" :post="post" />
    </ul>
    <p v-else class="mt-8 text-muted">記事はまだありません。</p>
  </div>
</template>
