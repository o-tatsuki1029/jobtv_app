"use client";

import React from "react";

type ModalHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

/**
 * モーダルのヘッダーコンポーネント
 * 統一されたスタイルでタイトルを表示
 */
export default function ModalHeader({ title, children }: ModalHeaderProps) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
}
