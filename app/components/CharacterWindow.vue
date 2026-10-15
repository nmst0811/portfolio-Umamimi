<script setup lang="ts">
// 十角形の窓。上半分は枠からはみ出し、下半分は十角形の辺で切り取る。
// 光の筋は、ぼかさない半透明の面を1本だけ(図形と重なって色が濁らないように)。
// 大きさは呼び出し側で指定する(正方形)。
defineProps<{
  /** 光の筋を表示する */
  beams?: boolean
  /** 照明プラン図のような幾何学図形(StageDrawing)を重ねる */
  drawing?: boolean
  /** 画像の代替テキスト。装飾のときは省略する */
  alt?: string
  /** ページの最初に見える画像のときに指定する */
  priority?: boolean
}>()
</script>

<template>
  <div class="relative aspect-square">
    <div
      v-if="beams"
      class="beam -top-32 left-[4%] h-[135%] w-[42%] [clip-path:polygon(38%_0,62%_0,100%_100%,0_100%)]"
      aria-hidden="true"
    />
    <StageDrawing v-if="drawing" />
    <Decagon outline class="absolute top-[6%] left-[6%] size-[88%] text-accent" />
    <img
      src="/character/umamimi.webp"
      width="1024"
      height="1024"
      :alt="alt ?? ''"
      :fetchpriority="priority ? 'high' : undefined"
      class="absolute inset-0 size-full object-contain [clip-path:polygon(0%_0%,100%_0%,100%_50%,94%_50%,85.6%_75.86%,63.6%_91.84%,36.4%_91.84%,14.4%_75.86%,6%_50%,0%_50%)]"
    />
    <Decagon lower-half class="absolute top-[6%] left-[6%] size-[88%] text-accent" />
  </div>
</template>
