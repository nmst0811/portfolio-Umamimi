<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error.statusCode === 404)

// エラーのページは、検索結果に出さない
useSeoMeta({ title: is404.value ? 'ページが見つかりません' : 'エラー', robots: 'noindex' })
</script>

<template>
  <div class="flex min-h-dvh flex-col items-center justify-center gap-4 px-5 text-center">
    <CharacterWindow class="size-56" />
    <p class="font-display text-7xl leading-none text-accent">{{ error.statusCode }}</p>
    <h1 class="text-2xl font-bold">
      {{ is404 ? 'ページが見つかりません' : 'エラーが発生しました' }}
    </h1>
    <p class="max-w-[34ch] text-muted">
      {{
        is404
          ? 'URLが間違っているか、ページが移動した可能性があります。トップから探してください。'
          : '時間をおいて、もう一度開いてください。'
      }}
    </p>
    <AppButton class="mt-2" @click="clearError({ redirect: '/' })">トップへ戻る</AppButton>
  </div>
</template>
