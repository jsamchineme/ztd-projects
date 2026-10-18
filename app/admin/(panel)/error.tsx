"use client";

import { btnSecondary } from "@/components/admin/ui";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-white p-6 text-center shadow-sm">
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-neutral-600">
        That didn&apos;t save. Check the required fields (and that the URL slug isn&apos;t already used), then try again.
      </p>
      <button onClick={reset} className={`${btnSecondary} mt-4`}>
        Try again
      </button>
    </div>
  );
}
