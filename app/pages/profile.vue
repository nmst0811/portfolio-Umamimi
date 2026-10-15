<script setup lang="ts">
const profile = await useProfile()

usePageMeta({ title: 'プロフィール', description: 'Umamimi の自己紹介、参加してきた場所、リンク、ご依頼・ご連絡先。' })

// 年が1件でもあるときだけ、年の列を設ける
const hasPeriod = computed(() => profile.value.history.some((item) => item.period))
</script>

<template>
  <div class="mx-auto max-w-4xl px-5 py-12">
    <PageHeader title="プロフィール" terminal="decagon" />

    <div class="mt-10 divide-y divide-line border-y border-line">
      <section aria-labelledby="about" class="grid gap-x-8 gap-y-2 py-8 md:grid-cols-[10rem_1fr]">
        <h2 id="about" class="font-bold">自己紹介</h2>
        <p>
          <span v-for="line in profile.intro" :key="line" class="block">{{ line }}</span>
        </p>
      </section>

      <section v-if="profile.history.length" aria-labelledby="history" class="grid gap-x-8 gap-y-2 py-8 md:grid-cols-[10rem_1fr]">
        <h2 id="history" class="font-bold">参加してきた場所</h2>
        <ul class="space-y-3">
          <li
            v-for="item in profile.history"
            :key="item.name"
            :class="hasPeriod ? 'sm:grid sm:grid-cols-[9rem_1fr] sm:items-baseline sm:gap-x-4' : ''"
          >
            <p v-if="hasPeriod" class="text-sm tabular-nums text-muted">{{ item.period }}</p>
            <div>
              <p>
                <span class="font-bold">{{ item.name }}</span>
                <span v-if="item.note" class="ml-2 text-sm text-muted">{{ item.note }}</span>
              </p>
              <p v-if="item.role" class="text-sm text-muted">{{ item.role }}</p>
            </div>
          </li>
        </ul>
      </section>

      <section v-if="profile.links.length" aria-labelledby="links" class="grid gap-x-8 gap-y-2 py-8 md:grid-cols-[10rem_1fr]">
        <h2 id="links" class="font-bold">リンク</h2>
        <ul>
          <li v-for="link in profile.links" :key="link.href">
            <a
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
            >
              {{ link.label }}<span class="sr-only">(新しいタブで開く)</span>
            </a>
          </li>
        </ul>
      </section>

      <section v-if="profile.email" aria-labelledby="contact" class="grid gap-x-8 gap-y-2 py-8 md:grid-cols-[10rem_1fr]">
        <h2 id="contact" class="font-bold">ご依頼・ご連絡</h2>
        <div>
          <p>ご依頼やご連絡は、次のメールアドレスにお送りください。</p>
          <p class="mt-2 select-all font-bold">{{ profile.email }}</p>
          <p class="mt-1 text-sm text-muted">迷惑メール対策のため、「[at]」を「@」に置き換えてお送りください。</p>
        </div>
      </section>
    </div>
  </div>
</template>
