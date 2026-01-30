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

1. **共通環境変数の設定**:

   ```bash
   # ルートに.env.localを作成（.env.exampleを参考に）
   cp .env.example .env.local
   # 実際の値を設定
   ```

2. **各アプリ固有の環境変数**:
   - 各アプリのディレクトリ（`apps/{app-name}/.env.local`）に設定
   - ルートの`.env.local`と各アプリの`.env.local`の両方が読み込まれます
   - 同じ変数名がある場合、各アプリの`.env.local`が優先されます

**共通化できる環境変数**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`（event-system で使用）

## 開発

### 全アプリを並列起動

```bash
pnpm dev
```

各アプリは以下のポートで起動します：

- agent-manager: http://localhost:3000
- event-system: http://localhost:3001
- jobtv: http://localhost:3002

### 個別のアプリを起動

```bash
# agent-managerのみ
pnpm --filter agent-manager dev

# event-systemのみ
pnpm --filter event-system dev

# jobtvのみ
pnpm --filter jobtv dev
```

## ビルド

### 全アプリをビルド

```bash
pnpm build
```

### 個別のアプリをビルド

```bash
pnpm --filter agent-manager build
pnpm --filter event-system build
pnpm --filter jobtv build
```

## 型定義の生成

### 全アプリの型定義を生成

```bash
pnpm types
```

### 個別のアプリの型定義を生成

```bash
pnpm --filter agent-manager types
pnpm --filter event-system types
pnpm --filter jobtv types
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
