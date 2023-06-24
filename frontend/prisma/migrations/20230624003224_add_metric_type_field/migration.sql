/*
  Warnings:

  - Added the required column `metric_type` to the `metric` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "metric" ADD COLUMN     "metric_type" "MetricType" NOT NULL;
