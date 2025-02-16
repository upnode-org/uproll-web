/*
  Warnings:

  - You are about to drop the column `globalLogLevel` on the `Configuration` table. All the data in the column will be lost.
  - You are about to drop the column `globalNodeSelectors` on the `Configuration` table. All the data in the column will be lost.
  - You are about to drop the column `globalTolerations` on the `Configuration` table. All the data in the column will be lost.
  - You are about to drop the column `persistent` on the `Configuration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Configuration" DROP COLUMN "globalLogLevel",
DROP COLUMN "globalNodeSelectors",
DROP COLUMN "globalTolerations",
DROP COLUMN "persistent";
