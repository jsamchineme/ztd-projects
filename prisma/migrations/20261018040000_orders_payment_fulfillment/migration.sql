-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'REFUNDED');

-- CreateEnum
CREATE TYPE "FulfillmentStatus" AS ENUM ('UNFULFILLED', 'FULFILLED', 'CANCELLED');

-- AlterTable: Order — new fields
ALTER TABLE "Order"
  ADD COLUMN "region" TEXT,
  ADD COLUMN "country" TEXT,
  ADD COLUMN "taxCents" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
  ADD COLUMN "fulfillmentStatus" "FulfillmentStatus" NOT NULL DEFAULT 'UNFULFILLED',
  ADD COLUMN "paymentMethod" TEXT,
  ADD COLUMN "deliveryMethod" TEXT,
  ADD COLUMN "trackingNumber" TEXT,
  ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "archived" BOOLEAN NOT NULL DEFAULT false;

-- Backfill the two new status dimensions from the old single status.
UPDATE "Order" SET "paymentStatus" = 'PAID' WHERE "status" IN ('PAID', 'FULFILLED');
UPDATE "Order" SET "fulfillmentStatus" = 'FULFILLED' WHERE "status" = 'FULFILLED';
UPDATE "Order" SET "fulfillmentStatus" = 'CANCELLED' WHERE "status" = 'CANCELLED';

-- Drop the old single status column and enum.
ALTER TABLE "Order" DROP COLUMN "status";
DROP TYPE "OrderStatus";

-- AlterTable: OrderItem — per-line fulfillment flag
ALTER TABLE "OrderItem" ADD COLUMN "fulfilled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable: OrderActivity
CREATE TABLE "OrderActivity" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'system',
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderActivity_orderId_idx" ON "OrderActivity"("orderId");

-- AddForeignKey
ALTER TABLE "OrderActivity" ADD CONSTRAINT "OrderActivity_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
