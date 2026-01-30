"use client";

import { mobileNavItems, primaryButtonClass, secondaryButtonClass } from "@/constants/navigation";
import Link from "next/link";
import { useEffect } from "react";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  // メニューが開いている時に背面をスクロールさせない
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* 背景オーバーレイ */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* メニュー本体 */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] bg-gray-900 border-l border-gray-800 z-[70] shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 閉じるボタン */}
          <div className="p-6 flex justify-end">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="閉じる"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ナビゲーションリンク */}
          <nav className="flex-1 px-6 overflow-y-auto">
            <div className="flex flex-col space-y-1 mb-8">
              {mobileNavItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="py-4 text-white hover:text-red-500 text-lg font-bold border-b border-gray-800 transition-colors"
                  onClick={onClose}
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* アクションボタン */}
            <div className="space-y-4">
              <Link
                href="/auth/signup"
                target="_blank"
                className={`w-full ${primaryButtonClass} py-4 text-center block text-base font-bold`}
                onClick={onClose}
              >
                無料登録
              </Link>
              <Link
                href="/auth/login"
                target="_blank"
                className={`w-full ${secondaryButtonClass} py-4 text-center block text-base font-bold`}
                onClick={onClose}
              >
                ログイン
              </Link>
            </div>
          </nav>

          {/* フッター */}
          <div className="p-8 border-t border-gray-800 mt-auto">
            <p className="text-gray-500 text-xs text-center">© {new Date().getFullYear()} JOBTV</p>
          </div>
        </div>
      </div>
    </>
  );
}
