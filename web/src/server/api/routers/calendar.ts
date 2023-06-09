import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import dater from "~/server/dater";
import calendarMethods from "~/server/calendar-methods";

const allowedDate = z.object({
  year: z.number().min(2019).max(2030),
  monthIndex: z.number().min(0).max(12)
})
export const calendarRouter = createTRPCRouter({
  getMonthlyEvents: publicProcedure
    .input(allowedDate)
    .query(({ input }) => calendarMethods.getMonthlyEvents(input)),

  getRelatedMonths: publicProcedure
    .input(allowedDate)
    .query(({ input }) => dater.getMonths(input.year, input.monthIndex)),




  tmpgetMonthlyEvents: publicProcedure
  .input(allowedDate)
  .query(({ input }) => calendarMethods.getMonthlyEvents2(input)),
});
