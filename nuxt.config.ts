import tailwindcss from '@tailwindcss/vite'

// Google アナリティクス(GA4)の計測 ID(G-XXXXXXXXXX)。秘密の値ではない(公開ページの HTML に出る)が、
// リポジトリには書かず、環境変数 GA_MEASUREMENT_ID で渡す。未設定なら、計測もフッターの表記も出さない。
// Cloudflare Pages では「Production」にだけ設定する(プレビューやローカルのアクセスを統計に混ぜないため)
const gaMeasurementId = process.env.GA_MEASUREMENT_ID?.trim() ?? ''
if (gaMeasurementId && !/^G-[A-Z0-9]+$/.test(gaMeasurementId)) {
  // 間違った ID のまま公開しないよう、ビルドを止める(GTM-… や UA-… は、この仕組みでは使えない)
  throw new Error(`GA_MEASUREMENT_ID は、GA4 の計測 ID(G- で始まる。例: G-XXXXXXXXXX)にしてください: ${gaMeasurementId}`)
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-10-13',
  devtools: { enabled: false },
  css: [
    // 日本語は unicode-range で細かく分割された版を使う。
    // (`japanese-*.css` は1ファイル 0.4〜1MB になり、毎回まとめて読み込んでしまう)
    // 表示用: ドット(LED)フォント。ワードマークと数字だけに使うため、英数字(latin)だけ読み込む。
    // 日本語の文字に使うときは `/400.css`(分割版)に変えること
    '@fontsource/dotgothic16/latin-400.css',
    // 本文用
    '@fontsource/zen-kaku-gothic-new/400.css',
    '@fontsource/zen-kaku-gothic-new/700.css',
    '~/assets/css/main.css',
  ],

  app: {
    head: {
      htmlAttrs: { lang: 'ja' },
      title: 'Umamimi',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#070c11' },
      ],
      link: [
        // RSS(server/routes/rss.xml.get.ts)。リーダーがサイトから見つけられるようにする
        { rel: 'alternate', type: 'application/rss+xml', title: 'Umamimi', href: '/rss.xml' },
      ],
      script: [
        // 最初に開いたときだけ動かす印(main.css の .intro)。描画前に付ける
        { innerHTML: "document.documentElement.classList.add('intro')", tagPosition: 'head' },
        // Google アナリティクス(GA4)の標準のスニペット。全ページの <head> に入る。
        // ページ移動(再読み込みなしの切り替え)は、GA4 の拡張計測(既定でオン)が履歴の変化から拾う
        ...(gaMeasurementId
          ? [
              { src: `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`, async: true },
              {
                innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaMeasurementId}')`,
              },
            ]
          : []),
      ],
    },
  },

  runtimeConfig: {
    // microCMS。サーバー専用の値(public の外)なので、ブラウザ側のコードには含まれない
    microcmsServiceDomain: process.env.MICROCMS_SERVICE_DOMAIN ?? '',
    microcmsApiKey: process.env.MICROCMS_API_KEY ?? '',
    public: {
      // サイトの URL。OGP、canonical、sitemap、RSS の絶対 URL に使う(末尾の / は不要)。
      // 本番以外(確認用のドメインなど)でビルドするときだけ、環境変数 SITE_URL で上書きする
      siteUrl: process.env.SITE_URL ?? 'https://umamimi.saphir-vis.com',
      // フッターの「Google アナリティクスを使っています」の表示判定に使う(上の gaMeasurementId)
      gaMeasurementId,
    },
  },

  nitro: {
    // 静的なファイルとして書き出す。Cloudflare のビルド環境では、指定しないと Nitro が cloudflare-module を
    // 自動で選び、存在しないサーバー用の出力(index.mjs)を探してデプロイに失敗する
    preset: 'static',
    prerender: {
      // ページの生成に失敗したら、そのまま公開せずビルドを止める
      failOnError: true,
      // リンクをたどっても見つからないファイル。server/routes/ の内容をビルド時に書き出す
      routes: ['/sitemap.xml', '/rss.xml', '/robots.txt'],
    },
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      // Cloudflare Tunnel 経由で開発サーバーを開くための許可ホスト
      allowedHosts: ['umamimi-dev.saphir-vis.com', '.trycloudflare.com'],
    },
  },
})
