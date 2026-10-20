<script setup lang="ts">
const profile = await useProfile()

usePageMeta({ title: 'プライバシーポリシー', description: 'Umamimi のサイトでの情報の取り扱いについて。アクセス解析と外部サービスの利用について説明しています。' })
</script>

<template>
  <div class="mx-auto max-w-4xl px-5 py-12">
    <PageHeader title="プライバシーポリシー" terminal="decagon" />

    <!-- 見出し・段落・箇条書きの見た目は、本文用の .rich をそのまま使う -->
    <div class="rich mt-8">
      <p>
        Umamimi(以下「当サイト」)は、訪問してくださる方の情報を、次のとおり取り扱います。
      </p>

      <h2>アクセス解析について</h2>
      <p>
        当サイトでは、利用状況を把握し、内容を改善するために、Google LLC が提供するアクセス解析サービス「Google アナリティクス」を利用しています。
      </p>
      <ul>
        <li>Google アナリティクスは、Cookie(クッキー)を使って、閲覧したページ、閲覧した日時、端末やブラウザの種類、おおよその地域、どこからアクセスしたか、などの情報を収集します。</li>
        <li>収集された情報は匿名で、これだけで個人を特定するものではありません。</li>
        <li>収集された情報は、Google のプライバシーポリシーに基づいて、Google に管理されます。</li>
      </ul>
      <p>
        Cookie の利用を望まない場合は、ブラウザの設定で Cookie を無効にするか、Google が提供する
        <a href="https://tools.google.com/dlpage/gaoptout?hl=ja" target="_blank" rel="noopener noreferrer">Google アナリティクス オプトアウト アドオン<span class="sr-only">(新しいタブで開く)</span></a>
        を使うことで、情報の収集を拒否できます。拒否しても、当サイトを閲覧するうえでの支障はありません。
      </p>
      <p>
        Google による情報の取り扱いについては、
        <a href="https://policies.google.com/technologies/partner-sites?hl=ja" target="_blank" rel="noopener noreferrer">Google のサービスを使用するサイトやアプリから収集した情報の Google による使用<span class="sr-only">(新しいタブで開く)</span></a>
        と、
        <a href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank" rel="noopener noreferrer">Google アナリティクス利用規約<span class="sr-only">(新しいタブで開く)</span></a>
        をご覧ください。
      </p>

      <h2>外部サービスの埋め込みとリンク</h2>
      <p>
        作品のページでは、YouTube とニコニコ動画の動画を埋め込んで表示することがあります。動画を再生すると、各サービスが Cookie などを通じて情報を取得する場合があります。その取り扱いは、各サービスのプライバシーポリシーに従います。
      </p>
      <p>
        当サイトには、ほかのサイトへのリンクがあります。リンク先での情報の取り扱いについて、当サイトは責任を負いません。
      </p>

      <h2>ご連絡いただいた内容の取り扱い</h2>
      <p>
        メールでご連絡いただいたときは、メールアドレスや内容を、返信とご依頼への対応のためだけに使います。法令に基づく場合を除き、ご本人の同意なく第三者に提供することはありません。
      </p>
      <p v-if="profile.email">
        ご連絡先:<span class="select-all font-bold">{{ profile.email }}</span>
        <br />
        <span class="text-sm text-muted">迷惑メール対策のため、「[at]」を「@」に置き換えてお送りください。</span>
      </p>

      <h2>このポリシーの変更</h2>
      <p>
        必要に応じて、このポリシーを見直し、変更することがあります。変更した内容は、このページに掲載します。
      </p>
      <p class="text-sm text-muted">制定日: 2026年10月15日</p>
    </div>
  </div>
</template>
