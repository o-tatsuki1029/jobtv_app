// カタカナチェック
export function isKatakana(str: string): boolean {
  return /^[ァ-ヶー\s]*$/.test(str);
}

// カタカナバリデーション（エラーメッセージ付き）
export function validateKatakana(value: string, fieldName: string): string | null {
  if (!value.trim()) {
    return `${fieldName}は必須です`;
  }
  if (!isKatakana(value)) {
    return "カタカナで入力してください";
  }
  return null;
}

