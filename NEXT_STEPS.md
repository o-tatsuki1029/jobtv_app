# 次のステップ

Monorepo 化が完了しました。以下の手順で進めてください。

## 1. Git リポジトリの初期化

```bash
cd jobtv-app
git init
git add .
git commit -m "Initial commit: Monorepo setup"
```

既存のリモートリポジトリがある場合：

```bash
git remote add origin <your-repository-url>
git branch -M main
git push -u origin main
```

## 2. ビルドエラーの修正

### jobtv のビルドエラー対応

jobtv のビルドで環境変数の問題が発生しています。以下を確認してください：

1. **環境変数の確認**:

   ```bash
   # ルートの.env.localに必要な環境変数が設定されているか確認
   cat .env.local
   ```

2. **jobtv 固有の環境変数**:

   - `apps/jobtv/.env.local`に必要な環境変数を追加
   - 特に`NEXT_PUBLIC_SITE_URL`など、アプリ固有の設定

3. **ビルドテスト**:
   ```bash
   # 個別にビルドしてエラーを確認
   pnpm --filter jobtv build
   ```

## 3. 開発サーバーの起動確認

```bash
# 全アプリを並列起動
pnpm dev

# または個別に起動
pnpm --filter agent-manager dev
pnpm --filter event-system dev
pnpm --filter jobtv dev
```

各アプリが正常に起動することを確認：

- agent-manager: http://localhost:3000
- event-system: http://localhost:3001
- jobtv: http://localhost:3002

## 4. 不要なファイルのクリーンアップ

以下のファイルは削除または無視してください：

```bash
# package-lock.json（pnpmを使用するため不要）
find apps -name "package-lock.json" -delete

# node_modules（ルートで管理）
# 各アプリのnode_modulesは自動的にルートに統合されます
```

## 5. 型定義の更新

共通の型定義を更新する場合：

```bash
# 全アプリの型定義を更新
pnpm types

# または個別に更新
pnpm --filter agent-manager types
pnpm --filter event-system types
pnpm --filter jobtv types
```

## 6. デプロイ準備

### Vercel でのデプロイ

各アプリを個別の Vercel プロジェクトとして設定：

1. **agent-manager**:

   - Root Directory: `jobtv-app`
   - Framework Preset: Next.js
   - Build Command: `cd jobtv-app && pnpm install && pnpm --filter agent-manager build`
   - Output Directory: `apps/agent-manager/.next`

2. **event-system**:

   - Root Directory: `jobtv-app`
   - Framework Preset: Next.js
   - Build Command: `cd jobtv-app && pnpm install && pnpm --filter event-system build`
   - Output Directory: `apps/event-system/.next`

3. **jobtv**:
   - Root Directory: `jobtv-app`
   - Framework Preset: Next.js
   - Build Command: `cd jobtv-app && pnpm install && pnpm --filter jobtv build`
   - Output Directory: `apps/jobtv/.next`

### 環境変数の設定

Vercel の各プロジェクトで環境変数を設定：

- 共通変数: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- event-system 固有: `SUPABASE_SERVICE_ROLE_KEY`
- 各アプリ固有の変数

## 7. 既存プロジェクトとの比較・検証

Monorepo 化後、既存のプロジェクトと動作が一致するか確認：

1. **機能テスト**: 各アプリの主要機能をテスト
2. **パフォーマンス**: ビルド時間、起動時間を比較
3. **依存関係**: 依存関係のバージョンが適切か確認

## 8. 今後の改善点

- [ ] 型定義の共通化（`packages/shared/types`に統合）
- [ ] 共通 UI コンポーネントの抽出
- [ ] 共通ユーティリティ関数の抽出
- [ ] CI/CD パイプラインの設定
- [ ] テストの統合

## トラブルシューティング

### pnpm が見つからない

```bash
# npx経由で実行
npx pnpm@latest install
npx pnpm@latest dev
```

### ビルドエラーが発生する

1. 環境変数が正しく設定されているか確認
2. 依存関係を再インストール: `pnpm install`
3. キャッシュをクリア: `rm -rf .turbo node_modules apps/*/node_modules`

### インポートエラーが発生する

1. TypeScript のパスエイリアス（`@/`）が正しく設定されているか確認
2. `tsconfig.json`の`paths`設定を確認
