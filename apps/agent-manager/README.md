# Agent Manager

エージェント管理システム - 候補者、企業、求人、応募の管理を行う Next.js アプリケーション

## ポート番号

- 開発環境: `http://localhost:3000`

## 機能

- 候補者管理（登録、編集、検索）
- 企業管理（登録、編集、求人紐付け）
- 求人管理（作成、編集、応募状況管理）
- 応募管理（ステータス管理、進捗追跡）
- 面接ノート管理
- 管理者アカウント管理

## 開発

### 開発サーバーの起動

```bash
# monorepoルートから
pnpm --filter agent-manager dev

# または、agent-managerディレクトリで
pnpm dev
```

### ビルド

```bash
# monorepoルートから
pnpm --filter agent-manager build

# または、agent-managerディレクトリで
pnpm build
```

## 環境変数

`apps/agent-manager/.env.local`に以下を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=https://tdewumilkltljbqryjpg.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
BASIC_AUTH_USER=admin
BASIC_AUTH_PASSWORD=your-password
```

## データベース

データベースのマイグレーションは monorepo ルート（`jobtv-app/supabase/`）で一元管理されています。

詳細は[monorepo ルートの README](../../README.md)を参照してください。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UI コンポーネント**: shadcn/ui
- **データベース**: Supabase
- **認証**: Supabase Auth

## ディレクトリ構成

```
apps/agent-manager/
├── app/                    # Next.js App Router
│   ├── admin/             # 管理画面
│   └── auth/              # 認証関連ページ
├── components/            # コンポーネント
│   └── ui/               # 共有UIコンポーネント
├── lib/                   # ライブラリとユーティリティ
│   ├── actions/          # Server Actions
│   └── supabase/         # Supabaseクライアント
└── package.json
```

## 関連ドキュメント

- [Monorepo README](../../README.md)
- [Supabase マイグレーション管理](../../supabase/README.md)
- [プロジェクトルール](../../.cursor/rules/)
