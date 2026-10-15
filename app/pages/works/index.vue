<script setup lang="ts">
import { workCategories, workKinds } from '#shared/types/content'

const works = await useWorks()

usePageMeta({ title: '作品', description: 'Umamimi の作品の一覧。MMD 動画やプロダクトを載せています。' })

const all = 'すべて'

// 種類の絞り込みは、データに2種類以上あるときだけ出す(動画しかないうちは、ボタンが空振りしないように)
const kinds = computed(() => workKinds.filter((kind) => works.value.some((work) => work.kind === kind)))
const kind = ref(all)
const category = ref(all)

const shown = computed(() =>
  works.value.filter(
    (work) => (kind.value === all || work.kind === kind.value) && (category.value === all || work.category === category.value),
  ),
)

function reset() {
  kind.value = all
  category.value = all
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-5 py-12">
    <PageHeader title="作品" terminal="circle" />

    <p v-if="!works.length" class="mt-8 text-muted">作品はまだありません。</p>

    <div v-else class="mt-8 grid gap-3">
      <FilterGroup v-if="kinds.length > 1" v-model="kind" label="種類で絞り込む" :options="[all, ...kinds]" />
      <FilterGroup v-model="category" label="カテゴリで絞り込む" :options="[all, ...workCategories]" />
    </div>

    <div v-if="shown.length" class="mt-8">
      <h2 class="sr-only">作品の一覧</h2>
      <div class="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        <WorkCard v-for="work in shown" :key="work.id" :work="work" />
      </div>
    </div>
    <div v-else-if="works.length" class="mt-8">
      <p class="text-muted">この条件の作品はまだありません。</p>
      <AppButton class="mt-4" @click="reset">すべての作品を見る</AppButton>
    </div>
  </div>
</template>
