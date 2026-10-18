import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { UserRole } from "@prisma/client";
import { auth } from "./auth";

/**
 * Guard for admin pages and server actions. Redirects to the login page when
 * signed out, and back to the dashboard when the role isn't allowed.
 */
export async function requireUser(roles?: UserRole[]) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (roles && !roles.includes(session.user.role)) redirect("/admin");
  return session.user;
}

/** Content managers: everyone but authors (who only write blog posts). */
export const EDITORS: UserRole[] = ["ADMIN", "EDITOR"];

// ─── FormData readers ────────────────────────────────────────────────────────

export function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

/** Trimmed string, or null when empty. */
export function opt(fd: FormData, key: string): string | null {
  return str(fd, key) || null;
}

export function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on" || fd.get(key) === "true";
}

export function int(fd: FormData, key: string, fallback = 0): number {
  const n = parseInt(str(fd, key), 10);
  return Number.isFinite(n) ? n : fallback;
}

/** "12.50" -> 1250; empty -> null. */
export function cents(fd: FormData, key: string): number | null {
  const v = str(fd, key).replace(/[$,\s]/g, "");
  if (!v) return null;
  const n = Math.round(parseFloat(v) * 100);
  return Number.isFinite(n) ? n : null;
}

/** Storefront pages render on demand, but clear any cached RSC payloads too. */
export function revalidateSite() {
  revalidatePath("/", "layout");
}
