<script setup lang="ts">
const nav = [
  { to: '/works', label: '作品' },
  { to: '/blog', label: 'ブログ' },
  { to: '/events', label: 'イベント' },
  { to: '/profile', label: 'プロフィール' },
]
</script>

<template>
  <header class="border-b border-line bg-bg">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-1 px-5 py-3">
      <NuxtLink to="/" class="flex items-center gap-3 font-display text-2xl leading-none">
        <Decagon class="size-6 text-accent" />
        <Wordmark />
      </NuxtLink>
      <nav aria-label="メイン">
        <ul class="-mx-2 flex items-center sm:gap-2">
          <li v-for="item in nav" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="block px-2 py-2 text-sm text-muted transition-colors hover:text-fg"
              active-class="nav-current"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
