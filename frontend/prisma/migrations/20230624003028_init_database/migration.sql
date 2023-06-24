-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('NUM_DEPENDANTS', 'NUM_GITHUB_STARS', 'NUM_GITHUB_CONTRIBUTORS', 'NUM_NPM_DOWNLOADS');

-- CreateTable
CREATE TABLE "project" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "githubLink" TEXT NOT NULL,
    "npmLink" TEXT NOT NULL,
    "is_test" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metric" (
    "id" SERIAL NOT NULL,
    "project_id" UUID NOT NULL,

    CONSTRAINT "metric_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "metric" ADD CONSTRAINT "metric_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
