-- DropForeignKey
ALTER TABLE "Configuration" DROP CONSTRAINT "Configuration_userId_fkey";

-- AlterTable
ALTER TABLE "Configuration" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Configuration" ADD CONSTRAINT "Configuration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
