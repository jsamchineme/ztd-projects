import { prisma } from "@/lib/db";
import { EDITORS, requireUser } from "@/lib/admin";
import { dateTime } from "@/lib/admin-format";
import { Badge, Empty, PageHeader } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/buttons";
import { deleteMessage, markMessage } from "./actions";

export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  await requireUser(EDITORS);
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageHeader title="Messages" description="Sent from the contact form." />
      {messages.length ? (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              id={m.id}
              className={`rounded-lg border bg-white p-5 shadow-sm ${m.read ? "border-neutral-200" : "border-green/40 ring-1 ring-green/20"}`}
            >
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    {m.name} {!m.read && <Badge tone="green">New</Badge>}
                  </div>
                  <div className="text-sm text-neutral-500">
                    <a href={`mailto:${m.email}`} className="text-green hover:underline">
                      {m.email}
                    </a>
                    {m.phone && ` · ${m.phone}`}
                  </div>
                </div>
                <div className="text-xs text-neutral-400">{dateTime(m.createdAt)}</div>
              </div>
              <p className="whitespace-pre-line text-sm text-neutral-800">{m.message}</p>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to Debb's Kitchen")}`} className="text-green hover:underline">
                  Reply by email
                </a>
                <form action={markMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="read" value={String(!m.read)} />
                  <button className="text-neutral-600 hover:text-neutral-900">{m.read ? "Mark unread" : "Mark read"}</button>
                </form>
                <DeleteButton action={deleteMessage} id={m.id} className="text-red-600 hover:underline" confirmText="Delete this message?" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty>No messages yet.</Empty>
      )}
    </>
  );
}
