<script setup lang="ts">
// 舞台の照明プラン図のような幾何学図形。CharacterWindow の座標系(0..100 = 窓の幅)で描く。
// 参考: 一本の直角の線が図形を結ぶ「製図」の考え方。ここでは結線(調光卓 → 器具 → 窓)に置き換えた。
// ぼかし・グラデーションは使わない。色はティールの濃淡だけ。
// 最初に開いたときだけ、結線が引かれ、図形が現れる(main.css の route-draw / route-appear)。
const dotX = [2, 6.5, 11]
const dotY = [90, 94.5, 99]
</script>

<template>
  <svg
    viewBox="0 0 100 100"
    aria-hidden="true"
    focusable="false"
    class="pointer-events-none absolute inset-0 size-full overflow-visible"
  >
    <!-- 光源の丸(ゴボ) -->
    <circle cx="95" cy="9" r="12" class="route-appear fill-accent/12" style="--appear-delay: 0.9s" />

    <!-- 器具の記号(平行四辺形)。足元で切れる -->
    <polygon
      points="74,98 106,98 100,126 68,126"
      class="route-appear fill-accent/10"
      style="--appear-delay: 1.1s"
    />

    <!-- 結線。画面が狭いときは窓の外に出てしまうため、広い画面だけで描く -->
    <g class="max-md:hidden">
      <path
        d="M -22 140 V 88 H -8 V 50 H 6"
        pathLength="1"
        fill="none"
        class="route-draw stroke-accent/70"
        stroke-width="0.3"
        stroke-linejoin="miter"
        style="--draw-delay: 0.3s; --draw-duration: 1.4s"
      />
      <circle cx="-8" cy="88" r="1.2" class="route-appear fill-accent/70" style="--appear-delay: 0.9s" />
      <circle cx="6" cy="50" r="1.6" class="route-appear fill-accent" style="--appear-delay: 1.7s" />
    </g>

    <!-- LED のドット -->
    <g class="route-appear fill-muted/60" style="--appear-delay: 1.9s">
      <template v-for="y in dotY" :key="y">
        <circle v-for="x in dotX" :key="x" :cx="x" :cy="y" r="0.6" />
      </template>
    </g>
  </svg>
</template>
