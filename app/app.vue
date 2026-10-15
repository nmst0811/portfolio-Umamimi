<script setup lang="ts">
useHead({
  titleTemplate: (title) => (title && title !== 'Umamimi' ? `${title} | Umamimi` : 'Umamimi'),
})

// 最初に開いたときだけ動かす。少し経つか、最初のページ移動で止める(main.css の .intro を参照)
const router = useRouter()
onMounted(() => {
  const end = () => document.documentElement.classList.remove('intro')
  const timer = window.setTimeout(end, 3500)
  router.afterEach(() => {
    window.clearTimeout(timer)
    end()
  })
})
</script>

<template>
  <div class="relative isolate flex min-h-dvh flex-col">
    <!-- 図面の方眼。全ページの背景に敷く -->
    <svg class="absolute inset-0 -z-10 size-full" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="sheet-grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 H 0 V 80" fill="none" class="stroke-line/60" stroke-width="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sheet-grid)" />
    </svg>

    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10 focus:bg-accent focus:px-4 focus:py-2 focus:font-bold focus:text-bg"
    >
      本文へ移動
    </a>
    <AppHeader />
    <main id="main" class="flex-1">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>
