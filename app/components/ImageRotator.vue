<script setup lang="ts">
// 複数の画像を、一定時間ごとに切り替えて出す(一覧のカードのプレビュー用)。
// 切り替えるのは、画面に見えていて、止められていなくて、動きを減らす設定でないときだけ。
// 画像は、次の1枚だけ先に読み込む(カードが並ぶ一覧で、全部の画像を最初に読み込まないため)。
const props = withDefaults(
  defineProps<{
    images: string[]
    /** 切り替える間隔(ミリ秒) */
    interval?: number
    /** true のあいだは切り替えを止める(カードにカーソルやフォーカスがあるとき) */
    paused?: boolean
  }>(),
  { interval: 4500, paused: false },
)

const root = ref<HTMLElement>()
const current = ref(0)
// 描画した枚数。サーバーで書き出す HTML には、最初の1枚だけ入る
const mounted = ref(1)
const visible = ref(false)
const reducedMotion = ref(false)

const active = computed(() => props.images.length > 1 && visible.value && !props.paused && !reducedMotion.value)

watch(
  active,
  (on, _before, onCleanup) => {
    if (!on) return
    const preload = () => (mounted.value = Math.max(mounted.value, Math.min(current.value + 2, props.images.length)))
    preload()
    const timer = setInterval(() => {
      current.value = (current.value + 1) % props.images.length
      preload()
    }, props.interval)
    onCleanup(() => clearInterval(timer))
  },
  { immediate: true },
)

let stopWatching = () => {}

onMounted(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  const syncMotion = () => (reducedMotion.value = motion.matches)
  syncMotion()
  motion.addEventListener('change', syncMotion)

  const observer = new IntersectionObserver(([entry]) => (visible.value = entry!.isIntersecting))
  observer.observe(root.value!)

  stopWatching = () => {
    motion.removeEventListener('change', syncMotion)
    observer.disconnect()
  }
})

onBeforeUnmount(() => stopWatching())
</script>

<template>
  <div ref="root" class="relative size-full">
    <img
      v-for="(src, i) in images.slice(0, mounted)"
      :key="src"
      :src="src"
      alt=""
      width="960"
      height="540"
      loading="lazy"
      decoding="async"
      class="absolute inset-0 size-full object-cover transition-opacity duration-700"
      :class="i === current ? 'opacity-100' : 'opacity-0'"
    />
    <!-- 何枚目かの目印。操作はできない -->
    <span v-if="images.length > 1" aria-hidden="true" class="absolute right-4 bottom-2 flex gap-1">
      <span
        v-for="(src, i) in images"
        :key="src"
        class="h-0.5 w-3 transition-colors duration-700"
        :class="i === current ? 'bg-accent' : 'bg-fg/40'"
      />
    </span>
  </div>
</template>
