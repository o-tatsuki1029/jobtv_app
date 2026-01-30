/**
 * 未認証時のリダイレクト先を取得
 *
 * @param pathname 現在のパス名
 * @param baseUrl ベースURL（request.urlなど）
 * @returns リダイレクト先のURL（redirectパラメータ付き）
 */
export function getUnauthenticatedRedirectUrl(
  pathname: string,
  baseUrl: string | URL
): URL {
  const loginUrl = new URL("/auth/login", baseUrl);
  loginUrl.searchParams.set("redirect", pathname);
  return loginUrl;
}

