<script setup lang="ts">
// 電光表示のように、1文字ずつ同じ幅のマスに置く。
// ドットフォントは「i」の左右の余白が広く、そのまま並べると字間が不揃いに見えるため。
const props = withDefaults(defineProps<{ text?: string }>(), { text: 'Umamimi' })
const letters = computed(() => [...props.text])
</script>

<template>
  <span class="inline-flex">
    <span class="sr-only">{{ props.text }}</span>
    <span
      v-for="(letter, i) in letters"
      :key="i"
      aria-hidden="true"
      class="inline-block w-[0.66em] text-center"
    >
      {{ letter }}
    </span>
  </span>
</template>
