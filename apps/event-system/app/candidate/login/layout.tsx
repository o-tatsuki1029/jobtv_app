// ログインページはレイアウトを使用しない（ループ防止）
export default function CandidateLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

