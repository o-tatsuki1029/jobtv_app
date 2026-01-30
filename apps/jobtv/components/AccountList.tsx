"use client";

import Image from "next/image";

interface Account {
  id: string;
  name: string;
  avatar: string;
}

interface AccountListProps {
  accounts: Account[];
}

export default function AccountList({ accounts }: AccountListProps) {
  return (
    <section className="mb-12 py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">運用アカウント一覧</h2>
        <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-2">
          {accounts.map((account) => (
            <div key={account.id} className="flex flex-col items-center cursor-pointer group flex-shrink-0">
              <div className="relative mb-2 w-16 h-16">
                <Image
                  src={account.avatar}
                  alt={account.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover group-hover:ring-2 group-hover:ring-red-500 transition-all"
                  loading="lazy"
                />
              </div>
              <span className="text-white text-xs font-medium text-center group-hover:text-red-500 transition-colors line-clamp-2 w-20">
                {account.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
