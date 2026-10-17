import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="text-6xl mb-4">🌶️</div>
      <h1 className="text-[2.4rem] mb-2">Page not found</h1>
      <p className="text-muted mb-8">The page you&apos;re looking for has wandered off.</p>
      <Link href="/" className="py-[13px] px-[28px] rounded-full bg-burgundy text-white">
        Back home
      </Link>
    </div>
  );
}
