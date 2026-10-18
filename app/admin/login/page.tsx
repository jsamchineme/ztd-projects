import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in · Admin", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-neutral-900">Debb&apos;s Kitchen</h1>
          <p className="mt-1 text-sm text-neutral-500">Sign in to manage the site</p>
        </div>
        <LoginForm callbackUrl={callbackUrl?.startsWith("/admin") ? callbackUrl : "/admin"} />
      </div>
    </div>
  );
}
