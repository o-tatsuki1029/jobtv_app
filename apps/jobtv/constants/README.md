# Constants ディレクトリ

このディレクトリには、アプリケーション全体で使用される共通の定数定義が含まれています。

## ファイル構成

### `site.ts`

サイト全体の基本情報、SEO、メタデータに関連する定数

```typescript
import {
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_URL,
  OGP_IMAGE,
  SEO_KEYWORDS,
  TWITTER_HANDLE,
  TWITTER_SITE,
  THEME_COLOR,
  PWA_CONFIG,
  ROBOTS_CONFIG,
  ALLOWED_IMAGE_HOSTS
} from "@/constants/site";
```

**定義されている定数:**

- `SITE_NAME` - サイト名
- `SITE_TITLE` - サイトタイトル（ページタイトル用）
- `SITE_DESCRIPTION` - サイト説明文
- `SITE_URL` - サイトのベースURL
- `OGP_IMAGE` - OGP画像のURL
- `LOGO_URL` - ロゴ画像のURL
- `SEO_KEYWORDS` - SEOキーワード配列
- `TWITTER_HANDLE` - Twitterアカウント
- `TWITTER_SITE` - TwitterサイトID
- `THEME_COLOR` - テーマカラー（light, dark, primary）
- `PWA_CONFIG` - PWA設定オブジェクト
- `ROBOTS_CONFIG` - robots.txt設定
- `ALLOWED_IMAGE_HOSTS` - 許可する画像ホスト配列

### `navigation.ts`

ナビゲーションメニューとスタイルに関連する定数

```typescript
import {
  navLinkClass,
  primaryButtonClass,
  secondaryButtonClass,
  navItems,
  mobileNavItems
} from "@/constants/navigation";
```

**定義されている定数:**

- `navLinkClass` - ナビゲーションリンクの共通スタイル
- `primaryButtonClass` - プライマリボタンの共通スタイル
- `secondaryButtonClass` - セカンダリボタンの共通スタイル
- `navItems` - デスクトップ用ナビゲーション項目
- `mobileNavItems` - モバイル用ナビゲーション項目

## 使用例

### layout.tsx でのメタデータ設定

```typescript
import { SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, SITE_URL, OGP_IMAGE, SEO_KEYWORDS } from "@/constants/site";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: SEO_KEYWORDS
  // ...
};
```

### next.config.ts での画像ホスト設定

```typescript
import { ALLOWED_IMAGE_HOSTS } from "./constants/site";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: ALLOWED_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https",
      hostname
    }))
  }
};
```

### ナビゲーションコンポーネントでの使用

```typescript
import { navItems, navLinkClass } from "@/constants/navigation";

export function Navigation() {
  return (
    <nav>
      {navItems.map((item) => (
        <a key={item.href} href={item.href} className={navLinkClass}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
```

## 変更時の注意事項

1. **環境変数との関係**: `SITE_URL`は環境変数`NEXT_PUBLIC_SITE_URL`を優先します
2. **ビルド時の影響**: 定数変更後は必ず`npm run build`でビルドエラーがないか確認してください
3. **型の整合性**: TypeScriptの型エラーに注意し、必要に応じて型定義を調整してください

## 定数を追加する際のガイドライン

1. **適切なファイルに配置**: サイト情報は`site.ts`、ナビゲーションは`navigation.ts`
2. **命名規則**: 大文字のスネークケース（例: `SITE_NAME`）
3. **説明コメント**: 必要に応じて各定数に説明コメントを追加
4. **エクスポート**: 必ず`export`して他のファイルから使用できるようにする
