/*
  Warnings:

  - You are about to drop the column `area` on the `Address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "area",
ADD COLUMN     "addressLine1" TEXT NOT NULL DEFAULT 'No Address Provided',
ADD COLUMN     "addressLine2" TEXT;
