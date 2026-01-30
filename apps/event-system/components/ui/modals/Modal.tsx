"use client";

import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  hideFooter?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
  footerContent?: React.ReactNode;
  className?: string;
};

const Modal = ({
  isOpen,
  onClose,
  children,
  hideFooter = false,
  maxWidth = "2xl",
  footerContent,
  className = "",
}: ModalProps) => {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/25 p-3 sm:p-4 md:p-6">
      <div
        className={`bg-white rounded-lg w-full ${maxWidthClasses[maxWidth]} flex flex-col max-h-[90vh] ${className}`}
      >
        <div
          className={`flex-1 overflow-y-auto p-4 sm:p-4 md:p-6 ${
            hideFooter ? "" : "pb-0"
          }`}
        >
          {children}
        </div>
        {!hideFooter && (
          <div className="flex justify-between items-center px-6 py-4 shadow-t">
            <div>{footerContent}</div>
            <button
              className="px-4 py-2 bg-gray-100 text-black rounded hover:bg-gray-200 text-sm"
              onClick={onClose}
            >
              閉じる
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
