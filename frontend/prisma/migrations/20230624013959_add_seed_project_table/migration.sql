-- CreateTable
CREATE TABLE "seed_project" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "github_link" TEXT NOT NULL,
    "npm_link" TEXT NOT NULL,
    "is_test" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "seed_project_pkey" PRIMARY KEY ("id")
);
