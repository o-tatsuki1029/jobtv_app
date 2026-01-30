/**
 * メールアドレスのバリデーション
 */
export function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return "メールアドレスを入力してください";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "有効なメールアドレスを入力してください";
  }
  return null;
}

/**
 * パスワードのバリデーション
 */
export function validatePassword(password: string): string | null {
  if (!password) {
    return "パスワードを入力してください";
  }
  if (password.length < 6) {
    return "パスワードは6文字以上で入力してください";
  }
  return null;
}

/**
 * パスワード確認のバリデーション
 */
export function validatePasswordConfirm(
  password: string,
  confirmPassword: string
): string | null {
  if (!confirmPassword) {
    return "パスワード（確認）を入力してください";
  }
  if (password !== confirmPassword) {
    return "パスワードが一致しません";
  }
  return null;
}

