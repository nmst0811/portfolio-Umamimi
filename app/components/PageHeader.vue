<script setup lang="ts">
// ページの見出し。下に、図形で終わる結線を引く(照明プラン図の結線の考え方)。
// 図形はページごとに変える。最初に開いたときだけ線が引かれる(main.css の route-draw)。
defineProps<{
  title: string
  terminal: 'circle' | 'parallelogram' | 'dots' | 'decagon'
}>()
</script>

<template>
  <header>
    <h1 class="text-4xl font-bold">{{ title }}</h1>
    <div class="mt-5 flex h-6 items-center gap-2" aria-hidden="true">
      <svg class="h-6 min-w-0 flex-1 overflow-visible" focusable="false">
        <circle cx="4" cy="20" r="3" class="route-appear fill-accent" style="--appear-delay: 0.1s" />
        <line
          x1="4" y1="20" x2="70%" y2="20"
          pathLength="1"
          class="route-draw stroke-accent/70"
          stroke-width="1.5"
          style="--draw-delay: 0.2s; --draw-duration: 0.5s"
        />
        <line
          x1="70%" y1="20" x2="70%" y2="12"
          pathLength="1"
          class="route-draw stroke-accent/70"
          stroke-width="1.5"
          style="--draw-delay: 0.7s; --draw-duration: 0.15s"
        />
        <line
          x1="70%" y1="12" x2="100%" y2="12"
          pathLength="1"
          class="route-draw stroke-accent/70"
          stroke-width="1.5"
          style="--draw-delay: 0.85s; --draw-duration: 0.4s"
        />
      </svg>

      <svg
        v-if="terminal === 'circle'"
        viewBox="0 0 24 24"
        class="route-appear size-6 shrink-0"
        focusable="false"
        style="--appear-delay: 1.2s"
      >
        <circle cx="12" cy="12" r="10" class="fill-accent/15 stroke-accent/70" stroke-width="1.5" />
      </svg>
      <svg
        v-else-if="terminal === 'parallelogram'"
        viewBox="0 0 24 24"
        class="route-appear size-6 shrink-0"
        focusable="false"
        style="--appear-delay: 1.2s"
      >
        <polygon points="7,3 23,3 17,21 1,21" class="fill-accent/15 stroke-accent/70" stroke-width="1.5" stroke-linejoin="round" />
      </svg>
      <svg
        v-else-if="terminal === 'dots'"
        viewBox="0 0 24 24"
        class="route-appear size-6 shrink-0"
        focusable="false"
        style="--appear-delay: 1.2s"
      >
        <g class="fill-accent">
          <circle v-for="x in [4, 12, 20]" :key="x" :cx="x" cy="12" r="2" />
        </g>
      </svg>
      <Decagon
        v-else
        outline
        class="route-appear size-6 shrink-0 text-accent"
        style="--appear-delay: 1.2s"
      />
    </div>
  </header>
</template>
