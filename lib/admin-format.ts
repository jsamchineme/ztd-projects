/** 1250 -> "12.50", for price inputs. */
export function centsInput(c: number | null | undefined): string {
  return c == null ? "" : (c / 100).toFixed(2);
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
