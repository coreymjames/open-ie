-- DropForeignKey
ALTER TABLE "metric" DROP CONSTRAINT "metric_project_id_fkey";

-- AddForeignKey
ALTER TABLE "metric" ADD CONSTRAINT "metric_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
