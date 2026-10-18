"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { btnPrimary, inputCls } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [{ error, email }, action, pending] = useActionState(login, { error: null, email: "" });
  return (
    <form action={action} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700">Email</span>
        <input name="email" type="email" required defaultValue={email} key={email} autoComplete="email" className={inputCls} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={pending} className={cn(btnPrimary, "w-full")}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
