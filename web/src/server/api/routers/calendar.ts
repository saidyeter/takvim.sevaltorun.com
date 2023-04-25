import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import dater from "~/server/dater";
const allowedDate=z.object({
  year: z.number().min(2019).max(2030),
  monthIndex: z.number().min(0).max(12)
})
export const calendarRouter = createTRPCRouter({
  getMonthlyEvents: publicProcedure
    .input(allowedDate)
    .query(async ({ ctx, input }) => {
      const boundaries = dater.getMonthBoundaries(input.year, input.monthIndex)
      const events= await ctx.prisma.event.findMany({})
      return {
        ...boundaries,
        events
      }
    }),

  getRelatedMonths: publicProcedure
    .input(allowedDate)
    .query(({ ctx, input }) => {
      const months = dater.getMonths(input.year,input.monthIndex)

      return {
        ...months
      }
    }),
});
