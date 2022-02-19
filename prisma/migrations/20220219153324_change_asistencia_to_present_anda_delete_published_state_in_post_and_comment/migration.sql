/*
  Warnings:

  - The values [ASISTENCIA] on the enum `Presence` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `published` on the `Coment` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Coment` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Post` table. All the data in the column will be lost.
  - Added the required column `content` to the `Coment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Presence_new" AS ENUM ('PRESENTE', 'TARDANZA', 'FALTA');
ALTER TABLE "Attendance" ALTER COLUMN "state" TYPE "Presence_new" USING ("state"::text::"Presence_new");
ALTER TABLE "AttendanceLog" ALTER COLUMN "state" TYPE "Presence_new" USING ("state"::text::"Presence_new");
ALTER TYPE "Presence" RENAME TO "Presence_old";
ALTER TYPE "Presence_new" RENAME TO "Presence";
DROP TYPE "Presence_old";
COMMIT;

-- AlterTable
ALTER TABLE "Coment" DROP COLUMN "published",
DROP COLUMN "title",
ADD COLUMN     "content" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "published";
