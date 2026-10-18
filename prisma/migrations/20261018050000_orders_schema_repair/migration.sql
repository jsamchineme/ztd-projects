-- Idempotent repair for the Orders payment/fulfillment schema.
--
-- On the Neon server, migration 20261018040000 was recorded in _prisma_migrations
-- as applied, but its DDL did not take effect (the new Order columns were missing,
-- so the seed and app failed with P2022 ColumnNotFound). Because Prisma considers
-- it applied, it won't re-run it. This migration re-asserts the full target schema
-- using IF [NOT] EXISTS guards, so it is a safe no-op on databases where
-- 20261018040000 *did* apply and a repair where it didn't.

-- ── Enums ────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "FulfillmentStatus" AS ENUM ('UNFULFILLED', 'FULFILLED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ── Order columns ────────────────────────────────────────────────────────────
ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "region" TEXT,
  ADD COLUMN IF NOT EXISTS "country" TEXT,
  ADD COLUMN IF NOT EXISTS "taxCents" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
  ADD COLUMN IF NOT EXISTS "fulfillmentStatus" "FulfillmentStatus" NOT NULL DEFAULT 'UNFULFILLED',
  ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT,
  ADD COLUMN IF NOT EXISTS "deliveryMethod" TEXT,
  ADD COLUMN IF NOT EXISTS "trackingNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "archived" BOOLEAN NOT NULL DEFAULT false;

-- Backfill from the legacy single status column, then drop it — only if present.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Order' AND column_name = 'status') THEN
    UPDATE "Order" SET "paymentStatus" = 'PAID' WHERE "status"::text IN ('PAID', 'FULFILLED');
    UPDATE "Order" SET "fulfillmentStatus" = 'FULFILLED' WHERE "status"::text = 'FULFILLED';
    UPDATE "Order" SET "fulfillmentStatus" = 'CANCELLED' WHERE "status"::text = 'CANCELLED';
    ALTER TABLE "Order" DROP COLUMN "status";
  END IF;
END $$;

-- Drop the legacy enum once nothing references it.
DROP TYPE IF EXISTS "OrderStatus";

-- ── OrderItem ────────────────────────────────────────────────────────────────
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "fulfilled" BOOLEAN NOT NULL DEFAULT false;

-- ── OrderActivity ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "OrderActivity" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'system',
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderActivity_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "OrderActivity_orderId_idx" ON "OrderActivity"("orderId");

DO $$ BEGIN
  ALTER TABLE "OrderActivity" ADD CONSTRAINT "OrderActivity_orderId_fkey"
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;
