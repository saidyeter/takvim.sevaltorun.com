import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import dater from "~/server/dater";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('handler', req.query);

  if (req.method !== 'GET') {
    return res.status(400).json({ err: 'GET request expected' })
  }
  const { year: queryYear, monthIndex: queryMonthIndex } = req.query

  if (!queryYear || !queryMonthIndex || typeof queryYear !== 'string' || typeof queryMonthIndex !== 'string') {
    return res.status(400).json({ err: 'Year and  month are expected' })
  }


  const bodySchema = z.object({
    year: z.number().min(2019).max(2030),
    monthIndex: z.number().min(0).max(12)
  })
  const validation = bodySchema.safeParse({
    year: parseInt(queryYear),
    monthIndex: parseInt(queryMonthIndex)

  })
  console.log(validation);

  if (!validation.success) {
    return res.status(400).json(validation.error)
  }
  const { year, monthIndex } = validation.data

  const result = dater.getMonths(year, monthIndex)
  return res.status(200).json(result)
}