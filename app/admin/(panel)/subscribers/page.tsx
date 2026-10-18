import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { EDITORS, requireUser, str } from "@/lib/admin";
import { dateTime } from "@/lib/admin-format";
import { Empty, PageHeader, Table, btnSecondary, td } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/buttons";

export const metadata = { title: "Subscribers" };

async function deleteSubscriber(fd: FormData) {
  "use server";
  await requireUser(EDITORS);
  await prisma.newsletterSubscriber.delete({ where: { id: str(fd, "id") } });
  revalidatePath("/admin/subscribers");
}

export default async function SubscribersPage() {
  await requireUser(EDITORS);
  const subs = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <PageHeader title="Subscribers" description={`${subs.length} newsletter signup${subs.length === 1 ? "" : "s"}.`}>
        {subs.length > 0 && (
          // eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page
          <a href="/api/admin/subscribers" className={btnSecondary}>
            Download CSV
          </a>
        )}
      </PageHeader>
      {subs.length ? (
        <Table head={["Email", "Signed up", ""]}>
          {subs.map((s) => (
            <tr key={s.id}>
              <td className={td}>{s.email}</td>
              <td className={`${td} text-neutral-500`}>{dateTime(s.createdAt)}</td>
              <td className={`${td} text-right`}>
                <DeleteButton action={deleteSubscriber} id={s.id} label="Remove" className="text-sm text-red-600 hover:underline" confirmText={`Remove ${s.email}?`} />
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <Empty>No subscribers yet.</Empty>
      )}
    </>
  );
}
