<script setup lang="ts">
// 図版の四隅のトンボ。親要素を `relative` にして、画像の外側に描く。
</script>

<template>
  <span aria-hidden="true" class="pointer-events-none">
    <span class="absolute -top-1.5 -left-1.5 size-3 border-t border-l border-muted/50" />
    <span class="absolute -top-1.5 -right-1.5 size-3 border-t border-r border-muted/50" />
    <span class="absolute -bottom-1.5 -left-1.5 size-3 border-b border-l border-muted/50" />
    <span class="absolute -right-1.5 -bottom-1.5 size-3 border-r border-b border-muted/50" />
  </span>
</template>
