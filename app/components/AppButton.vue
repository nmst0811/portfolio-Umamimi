<script setup lang="ts">
// `to` があればリンク、なければボタンとして描画する。
// 面取り(clip-path)で外側のフォーカス枠が切れるため、枠は内側に描く。
const props = defineProps<{ to?: string }>()
const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <component
    :is="props.to ? NuxtLink : 'button'"
    :to="props.to"
    :type="props.to ? undefined : 'button'"
    class="chamfer inline-flex min-h-11 items-center bg-accent px-6 font-bold text-bg [--c:9px] hover:bg-fg focus-visible:outline-bg focus-visible:-outline-offset-4"
  >
    <slot />
  </component>
</template>
