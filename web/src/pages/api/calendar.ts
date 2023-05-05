import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import dater from "~/server/dater";
import { prisma } from "~/server/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('handler',req.query);
    
        if (req.method !== 'GET') {
            return res.status(400).json({ err: 'GET request expected' })
        }
        const {year :queryYear,monthIndex:queryMonthIndex} = req.query

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
        
        if(!validation.success){
            return res.status(400).json(validation.error)
        }
        const {year,monthIndex} =validation.data
   
        const boundaries = dater.getMonthBoundaries(year, monthIndex)
        const monthStarts = new Date(year, monthIndex, 1)
        const monthEnds = new Date(year, monthIndex + 1, 1)
        const events = await prisma.event.findMany({
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
    
        return res.status(200).json({
          ...boundaries,
          events
           
        })
    }