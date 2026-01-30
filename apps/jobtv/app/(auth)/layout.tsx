import AuthHeader from "@/components/header/AuthHeader";

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthHeader />
      <main className="min-h-screen bg-white text-gray-900 light-theme">{children}</main>
    </>
  );
}
