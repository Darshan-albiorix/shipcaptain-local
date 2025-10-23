-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "roleId" TEXT;

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
