"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "HOME", href: "/admin" },
  { name: "イベント管理", href: "/admin/event" },
  { name: "学生管理", href: "/admin/candidates" },
  { name: "企業管理", href: "/admin/companies" },
];
const uneiNavItems = [{ name: "マッチングシステム", href: "/admin/matching" }];

const recruiterNavItems = [
  { name: "HOME", href: "/recruiter" },
  { name: "学生評価", href: "/recruiter/rating" },
  { name: "学生からの評価", href: "/recruiter/feedback" },
  { name: "テンプレート管理", href: "/recruiter/templates" },
];
const adminNavItems = [
  { name: "管理者アカウント", href: "/admin/users" },
  { name: "マスタ管理", href: "/admin/masters" },
];

const candidateNavItems = [{ name: "企業評価", href: "/candidate/rating" }];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  userRole?: "admin" | "recruiter" | "candidate" | null;
  isRoleLoading?: boolean;
};

// ナビゲーション
const Sidebar = ({
  isOpen,
  onClose,
  userRole,
  isRoleLoading,
}: SidebarProps) => {
  const pathname = usePathname();

  const handleLinkClick = () => {
    // モバイルでリンククリック時にサイドバーを閉じる
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  // パスがアクティブかどうかを判定する関数
  // HOME（/admin, /recruiter）の場合は完全一致、それ以外はstartsWithで判定
  const isActive = (href: string) => {
    if (href === "/admin" || href === "/recruiter") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // 企業担当者の場合は企業メニューのみ表示
  const isRecruiter = userRole === "recruiter";
  // 学生の場合は学生メニューのみ表示
  const isCandidate = userRole === "candidate";

  return (
    <>
      {/* オーバーレイ（モバイル・タブレット） */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* サイドバー */}
      <aside
        className={`fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] overflow-y-auto w-64 bg-gray-800 text-white flex flex-col p-4 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <nav>
          <ul className="space-y-2">
            {isRoleLoading || !userRole ? null : isRecruiter ? ( // ロール取得中またはロールが取得できていない場合は空のサイドバーを表示
              // 企業担当者の場合は企業メニューのみ表示
              <>
                <li className="block mt-5 p-2 border-b">企業メニュー</li>
                {recruiterNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`block p-2 rounded hover:bg-gray-600 ${
                        isActive(item.href) ? "bg-gray-600" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </>
            ) : isCandidate ? (
              // 学生の場合は学生メニューのみ表示
              <>
                <li className="block mt-5 p-2 border-b">学生メニュー</li>
                {candidateNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`block p-2 rounded hover:bg-gray-600 ${
                        isActive(item.href) ? "bg-gray-600" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </>
            ) : (
              // 管理者の場合はすべてのメニューを表示
              <>
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`block p-2 rounded hover:bg-gray-600 ${
                        isActive(item.href) ? "bg-gray-600" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}

                <li className="block mt-5 p-2 border-b">運営メニュー</li>
                {uneiNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`block p-2 rounded hover:bg-gray-600 ${
                        isActive(item.href) ? "bg-gray-600" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}

                <li className="block mt-5 p-2 border-b">企業メニュー</li>
                {recruiterNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`block p-2 rounded hover:bg-gray-600 ${
                        isActive(item.href) ? "bg-gray-600" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li className="block mt-5 p-2 border-b">学生メニュー</li>
                {candidateNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`block p-2 rounded hover:bg-gray-600 ${
                        isActive(item.href) ? "bg-gray-600" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li className="block mt-5 p-2 border-b">管理者メニュー</li>
                {adminNavItems.map((item, index) => (
                  <li key={`admin-nav-${item.name}-${index}`}>
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`block p-2 rounded hover:bg-gray-600 ${
                        isActive(item.href) ? "bg-gray-600" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
