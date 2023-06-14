# WEBサービステンプレート

小規模プロジェクト用WEBサービスのテンプレートです。

## セットアップ

### ローカル環境

clone後、以下を実行

```bash
make setup
```

ログイン出来ればOK

1. [http://localhost:3000](http://localhost:3000) からSign In
2. テキトーなメールアドレスを入力してSign In
3. mailhog server [http://localhost:8025](http://localhost:8025) にアクセスすると、ログイン用のメールが来ているので、リンクをクリックしてログイン
4. ログインされたっぽいメッセージが出ていればOK

## 主な利用ライブラリ

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
