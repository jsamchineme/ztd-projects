/** 1250 -> "12.50", for price inputs. */
export function centsInput(c: number | null | undefined): string {
  return c == null ? "" : (c / 100).toFixed(2);
}

/** Order reference for display: "#10030" for numeric refs, else as-is (e.g. "DK-AB12CD"). */
export function orderNumber(reference: string): string {
  return /^\d+$/.test(reference) ? `#${reference}` : reference;
}

/** "Apr 27, 2023" — date only, for grouping the activity timeline. */
export function dateOnly(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
}

/** "1:04 PM" — time only, for the activity timeline. */
export function timeOnly(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(d);
}

export function dateTime(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

/** Value for <input type="date">. */
export function dateInput(d: Date | null | undefined): string {
  return d ? d.toISOString().slice(0, 10) : "";
}
