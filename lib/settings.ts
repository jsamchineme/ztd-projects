import { prisma } from "./db";

/** Read a Setting value by key, JSON-parsed. Returns fallback if missing/invalid. */
export async function getSetting<T = string>(
  key: string,
  fallback: T,
): Promise<T> {
  const row = await prisma.setting.findUnique({ where: { key } });
  if (!row) return fallback;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return (row.value as unknown as T) ?? fallback;
  }
}
