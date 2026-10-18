import { prisma } from "@/lib/db";
import { EDITORS, requireUser } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";
import { Card, Field, PageHeader, inputCls } from "@/components/admin/ui";
import { Select } from "@/components/admin/Select";
import { SubmitButton } from "@/components/admin/buttons";
import { createOrder } from "../actions";

export const metadata = { title: "New Order" };

export default async function NewOrderPage() {
  await requireUser(EDITORS);
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, priceCents: true },
  });

  return (
    <>
      <PageHeader back={{ href: "/admin/orders", label: "Orders" }} title="New Order" description="Create an order manually — totals are calculated from catalog prices." />
      <form action={createOrder} className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-6 lg:col-span-2">
          <Card title="Items">
            <div className="divide-y divide-neutral-100">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-4 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-neutral-500">{formatPrice(p.priceCents)}</div>
                  </div>
                  <input
                    type="number"
                    name={`qty_${p.id}`}
                    min={0}
                    defaultValue={0}
                    className={`${inputCls} w-20 text-right`}
                    aria-label={`Quantity for ${p.name}`}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card title="Charges">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Shipping" hint="Dollars, e.g. 8.95">
                <input name="shipping" defaultValue="0" className={inputCls} />
              </Field>
              <Field label="Tax" hint="Dollars">
                <input name="tax" defaultValue="0" className={inputCls} />
              </Field>
            </div>
          </Card>
        </div>

        {/* Customer + payment */}
        <div className="space-y-6">
          <Card title="Customer">
            <div className="space-y-3">
              <Field label="Name"><input name="name" className={inputCls} /></Field>
              <Field label="Email"><input name="email" type="email" required className={inputCls} /></Field>
              <Field label="Phone"><input name="phone" className={inputCls} /></Field>
              <Field label="Address"><input name="address" className={inputCls} /></Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="City"><input name="city" className={inputCls} /></Field>
                <Field label="State / region"><input name="region" className={inputCls} /></Field>
                <Field label="Postal code"><input name="postalCode" className={inputCls} /></Field>
                <Field label="Country"><input name="country" defaultValue="United States" className={inputCls} /></Field>
              </div>
            </div>
          </Card>

          <Card title="Payment & delivery">
            <div className="space-y-3">
              <Field label="Payment status">
                <Select
                  name="paymentStatus"
                  defaultValue="UNPAID"
                  options={[
                    { value: "UNPAID", label: "Unpaid" },
                    { value: "PAID", label: "Paid" },
                  ]}
                />
              </Field>
              <Field label="Delivery method">
                <input name="deliveryMethod" placeholder="USPS" className={inputCls} />
              </Field>
            </div>
            <div className="mt-4">
              <SubmitButton>Create order</SubmitButton>
            </div>
          </Card>
        </div>
      </form>
    </>
  );
}
