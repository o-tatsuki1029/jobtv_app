import { encode } from "iconv-lite";

export function convertToShiftJIS(text: string): Uint8Array {
  // UTF-8文字列をSHIFT-JISに変換
  // iconv-liteのencodeは既にBufferを返す
  const shiftJISBuffer = encode(text, "shift_jis");

  // BufferをUint8Arrayに変換して返す
  return Uint8Array.from(shiftJISBuffer);
}

