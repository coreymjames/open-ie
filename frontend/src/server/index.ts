import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { PrismaClient } from '@prisma/client'

export const appRouter = router({
  getData: publicProcedure.query(async () => {
    const prisma = new PrismaClient();

    const projects = await prisma.project.findMany({
      include: {
        metrics: true
      }
    });

    return {
      projects
    };
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
