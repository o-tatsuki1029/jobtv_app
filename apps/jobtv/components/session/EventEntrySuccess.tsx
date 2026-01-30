"use client";

import Link from "next/link";
import { primaryButtonClass } from "@/constants/navigation";

export function EventEntrySuccess() {
  return (
    <div className="flex items-center justify-center px-4 py-12 sm:py-20 bg-white">
      <div className="max-w-md w-full bg-white sm:p-8 sm:rounded-2xl sm:border sm:border-gray-200 text-center sm:shadow-xl">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">予約が完了しました</h1>
        <p className="text-gray-600 mb-8">イベントへの予約が正常に完了しました。ご予約ありがとうございます。</p>
        <Link href="/" className={`inline-block ${primaryButtonClass} py-3 px-8`}>
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}
