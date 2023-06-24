/*
  Warnings:

  - You are about to drop the column `github_link` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `npm_link` on the `project` table. All the data in the column will be lost.
  - Added the required column `name` to the `project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "project" DROP COLUMN "github_link",
DROP COLUMN "npm_link",
ADD COLUMN     "name" TEXT NOT NULL;
