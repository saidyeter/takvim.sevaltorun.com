import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import dater from "~/server/dater";
const allowedDate = z.object({
  year: z.number().min(2019).max(2030),
  monthIndex: z.number().min(0).max(12)
})
export const calendarRouter = createTRPCRouter({
  getMonthlyEvents: publicProcedure
    .input(allowedDate)
    .query(async ({ ctx, input }) => {
      const boundaries = dater.getMonthBoundaries(input.year, input.monthIndex)
      const monthStarts = new Date(input.year, input.monthIndex, 1)
      const monthEnds = new Date(input.year, input.monthIndex + 1, 1)
      const events = await ctx.prisma.event.findMany({
        where: {
          OR: [
            {
              starts: {
                gte: monthStarts,
                lt: monthEnds,
              },
            },
            {
              ends: {
                gte: monthStarts,
                lt: monthEnds,
              },
            }
          ]
        },

      })
      return {
        ...boundaries,
        events
      }
    }),

  getRelatedMonths: publicProcedure
    .input(allowedDate)
    .query(({ input }) => {
      const months = dater.getMonths(input.year, input.monthIndex)

      return {
        ...months
      }
    }),
});
