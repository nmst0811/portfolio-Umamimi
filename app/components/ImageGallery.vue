<script setup lang="ts">
import type { GalleryImage } from '#shared/types/content'

// 詳細ページに、画像を全部並べる(作品・イベント共通)。
// 1枚なら切らずに大きく、2枚以上なら2列(スマホは1列)に並べる。押すと、大きい画像を新しいタブで開く。
defineProps<{
  images: GalleryImage[]
  /** 画像の説明文のもとになる名前(作品のタイトルなど) */
  name: string
  /** ページの先頭に近いとき true。1枚目をすぐ読み込む */
  eager?: boolean
}>()
</script>

<template>
  <section v-if="images.length" class="mt-6">
    <h2 class="sr-only">画像</h2>
    <ul class="grid gap-6" :class="{ 'sm:grid-cols-2': images.length > 1 }">
      <li v-for="(image, i) in images" :key="image.src" class="relative">
        <CropMarks />
        <a
          :href="image.src"
          target="_blank"
          rel="noopener noreferrer"
          class="block bg-surface"
          :class="{ 'aspect-video': images.length > 1 }"
        >
          <img
            :src="image.src"
            :width="image.width"
            :height="image.height"
            :alt="images.length > 1 ? `${name}の画像(${i + 1}/${images.length})` : `${name}の画像`"
            :loading="i === 0 && eager ? 'eager' : 'lazy'"
            decoding="async"
            class="w-full object-contain"
            :class="images.length > 1 ? 'size-full' : 'mx-auto h-auto max-h-[32rem]'"
          />
          <span class="sr-only">(大きい画像を新しいタブで開く)</span>
        </a>
      </li>
    </ul>
  </section>
</template>
