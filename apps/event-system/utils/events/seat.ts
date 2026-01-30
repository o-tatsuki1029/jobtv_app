/**
 * 席番号関連のユーティリティ関数
 */

/**
 * 利用可能なアルファベット（A-Z）を取得
 */
export function getAllLetters(): string[] {
  return Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
}

/**
 * 利用可能な数字（1-100）を取得
 */
export function getAllNumbers(): string[] {
  return Array.from({ length: 100 }, (_, i) => String(i + 1));
}

/**
 * 既存の席番号から、指定された数字と組み合わせて使用されているアルファベットを除外
 */
export function getAvailableLetters(
  existingSeats: Set<string>,
  selectedNumber: string
): string[] {
  if (!selectedNumber) {
    return getAllLetters();
  }

  return getAllLetters().filter((letter) => {
    const seat = `${letter}${selectedNumber}`;
    return !existingSeats.has(seat);
  });
}

/**
 * 既存の席番号から、指定されたアルファベットと組み合わせて使用されている数字を除外
 */
export function getAvailableNumbers(
  existingSeats: Set<string>,
  selectedLetter: string
): string[] {
  if (!selectedLetter) {
    return getAllNumbers();
  }

  return getAllNumbers().filter((num) => {
    const seat = `${selectedLetter}${num}`;
    return !existingSeats.has(seat);
  });
}

