/*
  Warnings:

  - You are about to drop the column `billingAddress` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `licenseExpiryDate` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `licenseIssueDate` on the `Client` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "ClientStatus" ADD VALUE 'PENDING_ACTIVATION';

-- AlterTable
ALTER TABLE "Car" ALTER COLUMN "licensePlate" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "billingAddress",
DROP COLUMN "licenseExpiryDate",
DROP COLUMN "licenseIssueDate",
ALTER COLUMN "status" SET DEFAULT 'PENDING_ACTIVATION';
