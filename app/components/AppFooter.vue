<script setup lang="ts">
const { gaMeasurementId } = useRuntimeConfig().public
</script>

<template>
  <footer class="border-t border-line bg-bg">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-8 text-sm text-muted">
      <p class="flex items-center gap-3">
        <Decagon class="size-4 text-line" />
        <small>&copy; {{ new Date().getFullYear() }} Umamimi</small>
      </p>

      <!-- 図面の縮尺バー -->
      <svg class="hidden text-line sm:block" width="161" height="10" aria-hidden="true" focusable="false">
        <path d="M 0 9.5 H 161" fill="none" stroke="currentColor" />
        <path
          v-for="i in 21"
          :key="i"
          :d="`M ${(i - 1) * 8 + 0.5} 9 V ${(i - 1) % 5 === 0 ? 1 : 5}`"
          fill="none"
          stroke="currentColor"
        />
      </svg>

      <nav aria-label="フッター">
        <ul class="flex flex-wrap gap-x-5">
          <li>
            <NuxtLink to="/profile" class="underline decoration-line underline-offset-4 hover:text-fg hover:decoration-accent">
              プロフィール
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/privacy" class="underline decoration-line underline-offset-4 hover:text-fg hover:decoration-accent">
              プライバシーポリシー
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- 計測 ID があるとき(= 実際に計測しているとき)だけ出す -->
      <p v-if="gaMeasurementId" class="basis-full">このサイトでは Google アナリティクスを使っています。</p>
    </div>
  </footer>
</template>
