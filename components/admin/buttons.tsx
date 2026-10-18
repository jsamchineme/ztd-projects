"use client";

import { useFormStatus } from "react-dom";
import { btnDanger, btnPrimary } from "./ui";

export function SubmitButton({ children = "Save", className = btnPrimary }: { children?: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Saving…" : children}
    </button>
  );
}

/** A form posting to a delete action, behind a confirm() prompt. */
export function DeleteButton({
  action,
  id,
  label = "Delete",
  confirmText = "Delete this item? This can't be undone.",
  className = btnDanger,
}: {
  action: (fd: FormData) => Promise<void>;
  id: string;
  label?: string;
  confirmText?: string;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}
