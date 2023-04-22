import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import dater from "~/server/dater";

export const calendarRouter = createTRPCRouter({
  getMonthlyEvents: publicProcedure
    .input(z.object({
      year: z.number().min(2022).max(2025),
      month: z.number().min(1).max(12)
    }))
    .query(({ ctx,input }) => {
      const boundaries= dater.getMonthBoundaries(input.year, input.month)
      
      return {
        ...boundaries
      }
    }),

  getMonths: publicProcedure
  .query(({ ctx,input }) => {
    const months= dater.getMonths()
    
    return {
      ...months
    }
  }),
});
