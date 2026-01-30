/**
 * シンプルなインメモリレート制限（本番環境ではRedisなどの外部ストレージを推奨）
 */

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * レート制限をチェック
 * @param key レート制限のキー（例: IPアドレス、ユーザーID）
 * @param maxRequests 最大リクエスト数
 * @param windowMs 時間窓（ミリ秒）
 * @returns リクエストが許可される場合はtrue、制限されている場合はfalse
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // デフォルト: 1分間
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // 新しい時間窓を開始
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false; // レート制限に達している
  }

  // カウントを増やす
  entry.count++;
  return true;
}

/**
 * レート制限のエントリをクリーンアップ（古いエントリを削除）
 */
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// 定期的にクリーンアップを実行（5分ごと）
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimit, 5 * 60 * 1000);
}

