# イベント運営システム

企業と学生のマッチングイベントを管理・運営するための Web アプリケーションです。

## 技術スタック

- **フレームワーク**: Next.js 15.5.6 (App Router)
- **言語**: TypeScript 5
- **UI**: React 19.1.0, Tailwind CSS 4.1.16
- **認証・データベース**: Supabase (PostgreSQL)
- **デプロイ**: Vercel (推奨)

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Basic 認証を有効にする場合**（オプション）：

```env
BASIC_AUTH_USERNAME=your_username
BASIC_AUTH_PASSWORD=your_password
```

Basic 認証の環境変数が設定されている場合、すべてのリクエストに対して Basic 認証が要求されます。設定されていない場合は、Basic 認証はスキップされます。

**開発環境で Zero Trust ネットワークセキュリティの証明書エラーを回避する場合**：

```env
SKIP_ZEROTRUST_CHECK=true
```

この設定を有効にすると、開発環境で Supabase への認証チェックをスキップし、自己証明書エラーを回避できます。証明書エラーが発生した場合でも、エラーをログに出力しつつリクエストは続行されます。認証チェックは各ページのサーバーコンポーネントで行われるため、アプリケーションは正常に動作します。

### 3. データベースマイグレーション

詳細な手順は [`supabase/migrations/README.md`](./supabase/migrations/README.md) を参照してください。

**クイックスタート**:

```bash
# プロジェクトをリンク（初回のみ）
npx supabase link --project-ref voisychklptvavokrxox

# マイグレーションを実行
npm run migration:push
```

または、Supabase Dashboard の SQL Editor で `supabase/migrations/20250101000000_initial_schema.sql` を実行してください。

### 4. 型定義の生成

```bash
npm run types:generate
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 主要機能

- **認証・認可**: ロールベースアクセス制御（管理者、企業担当者、学生）
  - 管理者・企業担当者: Supabase Auth（メール/パスワード）
  - 学生: イベント、席番号、電話番号のみでログイン（クッキーベース）
- **イベント管理**: イベントの作成、編集、削除
- **学生管理**: 学生情報の登録、編集、CSV インポート/エクスポート
- **企業管理**: 企業情報の登録、編集、CSV インポート
- **評価システム**:
  - 企業から学生への評価（S/A/B/C 4 段階評価）
    - 企業ベースの評価（1 企業 1 評価）
    - 評価者名は自動反映（最後に更新した担当者）
    - S 評価は 1 イベント 1 企業あたり 5 名まで
    - S・A 評価にはコメント必須
  - 学生から企業への評価（5 段階星評価、コメント 60 字以内）
- **コメントテンプレート管理**: 企業単位の評価コメントテンプレート
- **予約・出席管理**: イベントへの予約登録、出席登録、座席管理
- **マッチングシステム**:
  - 企業と学生の相互評価に基づくマッチング
  - 特別面談の設定
  - 座談会のセッション管理
  - マッチング結果の CSV エクスポート
  - **スコアシート出力**: 学生ごとの評価スコアシートを PDF で出力（印刷用）
- **学生からの評価閲覧**: 企業担当者が学生からの評価を閲覧・分析（グラフ表示）

## プロジェクト構造

```
src/
├── app/                    # Next.js App Router ページ
│   ├── admin/             # 管理者専用ページ
│   ├── recruiter/         # 企業担当者専用ページ
│   ├── candidate/         # 学生専用ページ
│   ├── login/             # ログイン・パスワードリセット
│   └── signup/            # 新規登録
├── components/            # Reactコンポーネント
│   ├── layouts/          # レイアウトコンポーネント
│   └── ui/               # UIコンポーネント
├── hooks/                # カスタムフック
├── types/                # TypeScript型定義
├── utils/                # ユーティリティ関数
└── constants/            # 定数定義
```

## スクリプト

- `npm run dev`: 開発サーバーを起動
- `npm run build`: 本番用ビルド
- `npm run start`: 本番サーバーを起動
- `npm run lint`: ESLint を実行
- `npm run types:generate`: Supabase から型定義を生成
- `npm run migration:push`: マイグレーションをプッシュ（要プロジェクトリンク）

## 環境設定

### 開発環境

`.env.local`ファイルに環境変数を設定してください。

### ステージング・本番環境

Vercel でデプロイする場合、各環境（Preview/Production）で環境変数を設定してください。

詳細は[SPECIFICATION.md](./SPECIFICATION.md)の「9. デプロイメント」セクションを参照してください。

## 詳細仕様

詳細な仕様については、[SPECIFICATION.md](./SPECIFICATION.md)を参照してください。

## ライセンス

このプロジェクトはプライベートプロジェクトです。
