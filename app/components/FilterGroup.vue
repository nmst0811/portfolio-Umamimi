<script setup lang="ts">
// 絞り込みのボタン列(1つだけ選べる)。v-model に、選んでいる項目を持つ
defineProps<{
  label: string
  options: readonly string[]
}>()

const active = defineModel<string>({ required: true })
</script>

<template>
  <div role="group" :aria-label="label" class="flex flex-wrap gap-2">
    <button
      v-for="option in options"
      :key="option"
      type="button"
      :aria-pressed="active === option"
      class="min-h-11 border border-line px-4 text-sm text-muted transition-colors not-aria-pressed:hover:text-fg aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:font-bold aria-pressed:text-bg"
      @click="active = option"
    >
      {{ option }}
    </button>
  </div>
</template>
