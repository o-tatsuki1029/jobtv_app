import { navLinkClass, primaryButtonClass, secondaryButtonClass } from "@/constants/navigation";
import Link from "next/link";

interface GuestActionsProps {
  className?: string;
}

export default function GuestActions({ className = "" }: GuestActionsProps) {
  return (
    <div className={"flex items-center gap-4"}>
      <a href="#" className={`${className} ${navLinkClass} mr-4`}>
        採用ご検討中の法人様
      </a>
      <Link href="/auth/signup" target="_blank" className={`${primaryButtonClass}`}>
        無料登録
      </Link>
      <Link href="/auth/login" target="_blank" className={`${className} ${secondaryButtonClass}`}>
        ログイン
      </Link>
    </div>
  );
}
