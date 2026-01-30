# JobTV App Monorepo

このリポジトリは、agent-manager、event-system、jobtv の 3 つの Next.js アプリケーションを統合した Monorepo です。

## セットアップ

### 前提条件

- Node.js 18 以上
- pnpm 8 以上

### インストール

```bash
# pnpmがインストールされていない場合
npm install -g pnpm

# 依存関係のインストール
pnpm install
```

### 環境変数の設定

Monorepo では、共通の環境変数をルートの`.env.local`に設定できます。

1. **共通環境変数の設定（ルートの`.env.local`）**:

   ```bash
   # 開発環境用の設定（全アプリ共通）
   SKIP_ZEROTRUST_CHECK=true
   NODE_TLS_REJECT_UNAUTHORIZED=0

   # Supabase設定（各アプリで個別に設定が必要）
   # 注意: ルートに共通で設定するとjobtvが動かなくなる可能性があります
   # 各アプリの.env.localに個別に設定してください
   ```

2. **各アプリ固有の環境変数（`apps/{app-name}/.env.local`）**:

   **agent-manager** (`apps/agent-manager/.env.local`):

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://tdewumilkltljbqryjpg.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
   BASIC_AUTH_USER=admin
   BASIC_AUTH_PASSWORD=test
   ```

   **event-system** (`apps/event-system/.env.local`):

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://tdewumilkltljbqryjpg.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   BASIC_AUTH_USERNAME=admin
   BASIC_AUTH_PASSWORD=test
   ```

   **jobtv** (`apps/jobtv/.env.local`):

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://tdewumilkltljbqryjpg.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
   NEXT_PUBLIC_SITE_URL=localhost:3002
   # 注意: プロトコル（http://）は不要です
   ```

**注意事項**:

- `NEXT_PUBLIC_SUPABASE_URL`と`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`は各アプリで個別に設定してください（ルートに共通で設定すると jobtv が動かなくなる可能性があります）
- `NEXT_PUBLIC_SITE_URL`はプロトコル（`http://`や`https://`）を含めないでください
- 開発環境用の設定（`SKIP_ZEROTRUST_CHECK`、`NODE_TLS_REJECT_UNAUTHORIZED`）は共通パッケージで統一管理されています

## 開発

### 全アプリを並列起動

```bash
# pnpmがインストールされていない場合（推奨）
npx pnpm@latest dev

# または、pnpmがインストールされている場合
pnpm dev
```

各アプリは以下のポートで起動します：

- agent-manager: http://localhost:3000
- event-system: http://localhost:3001
- jobtv: http://localhost:3002

### 個別のアプリを起動

```bash
# agent-managerのみ
npx pnpm@latest --filter agent-manager dev

# event-systemのみ
npx pnpm@latest --filter event-system dev

# jobtvのみ
npx pnpm@latest --filter jobtv dev
```

**注意**: `pnpm`コマンドが見つからない場合は、すべてのコマンドで`npx pnpm@latest`を使用してください。

## ビルド

### 全アプリをビルド

```bash
npx pnpm@latest build
```

### 個別のアプリをビルド

```bash
npx pnpm@latest --filter agent-manager build
npx pnpm@latest --filter event-system build
npx pnpm@latest --filter jobtv build
```

## 型定義の生成

### 全アプリの型定義を生成

```bash
npx pnpm@latest types
```

### 個別のアプリの型定義を生成

```bash
npx pnpm@latest --filter agent-manager types
npx pnpm@latest --filter event-system types
npx pnpm@latest --filter jobtv types
```

## プロジェクト構造

```
jobtv-app/
├── apps/
│   ├── agent-manager/      # エージェント管理アプリ
│   ├── event-system/        # イベントシステムアプリ
│   └── jobtv/               # JobTVアプリ
├── packages/
│   └── shared/              # 共通パッケージ
│       ├── supabase/        # Supabaseクライアント
│       └── types/           # 型定義
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 共通パッケージ

`@jobtv-app/shared`パッケージには、以下の共通機能が含まれています：

- Supabase クライアント（サーバー/クライアント）
- 型定義（今後追加予定）

## デプロイ

各アプリは独立してデプロイ可能です。Vercel を使用する場合：

1. 各アプリを Vercel プロジェクトとして追加
2. Root Directory を`jobtv-app`に設定
3. Framework Preset を各アプリのディレクトリに設定（例: `apps/agent-manager`）
4. ビルドコマンドを`turbo run build --filter={app-name}`に設定

## 注意事項

- 既存のプロジェクト（`dev/agent-manager/`, `dev/event-system/`, `dev/jobtv/`）はそのまま残されています
- この Monorepo は新しい Git リポジトリとして管理してください

## 次のステップ

詳細な手順は [NEXT_STEPS.md](./NEXT_STEPS.md) を参照してください。

主な次のステップ：

1. Git リポジトリの初期化
2. ビルドエラーの修正（jobtv の環境変数設定）
3. 開発サーバーの起動確認
4. デプロイ準備
