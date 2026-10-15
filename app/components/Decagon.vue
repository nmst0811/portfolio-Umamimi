<script setup lang="ts">
// 十角形メガネのモチーフ。上下が平らな正十角形(viewBox 0..100)
const props = defineProps<{
  /** 線だけで描く */
  outline?: boolean
  /** 下半分の線だけを描く(キャラの前に重ねる用) */
  lowerHalf?: boolean
}>()

const all = '100,50 90.45,79.39 65.45,97.55 34.55,97.55 9.55,79.39 0,50 9.55,20.61 34.55,2.45 65.45,2.45 90.45,20.61'
const lower = '100,50 90.45,79.39 65.45,97.55 34.55,97.55 9.55,79.39 0,50'
</script>

<template>
  <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" class="overflow-visible">
    <polyline
      v-if="props.lowerHalf"
      :points="lower"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    />
    <polygon
      v-else
      :points="all"
      :fill="props.outline ? 'none' : 'currentColor'"
      :stroke="props.outline ? 'currentColor' : 'none'"
      stroke-width="2"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>
