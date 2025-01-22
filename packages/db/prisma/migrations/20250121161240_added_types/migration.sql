-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'Credential',
ALTER COLUMN "password" DROP NOT NULL;
