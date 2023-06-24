/*
  Warnings:

  - You are about to drop the column `githubLink` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `npmLink` on the `project` table. All the data in the column will be lost.
  - Added the required column `github_link` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `npm_link` to the `project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "project" DROP COLUMN "githubLink",
DROP COLUMN "npmLink",
ADD COLUMN     "github_link" TEXT NOT NULL,
ADD COLUMN     "npm_link" TEXT NOT NULL;
