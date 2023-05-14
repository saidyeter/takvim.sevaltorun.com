import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import dater from "~/server/dater";
import { prisma } from "~/server/db";

import { env } from "~/env.mjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('event newRequest');

  if (req.method !== 'POST') {
    return res.status(400).json({ err: 'POST request expected' })
  }
  const { authorization } = req.headers

  if (!authorization ||
    typeof authorization !== 'string' ||
    authorization !== env.API_KEY) {
    console.log(authorization, 'Authorization are expected', env.API_KEY);
    return res.status(400).json({ err: 'Authorization are expected' })
  }


  const bodySchema = z.object({
    desc: z.string(),
    starts: z.string().datetime(),
    ends: z.string().datetime(),
    location: z.string().optional(),
  })
  const validation = bodySchema.safeParse(req.body)
  console.log(validation);

  if (!validation.success) {
    return res.status(400).json(validation.error)
  }
  const { desc, starts, ends, location } = validation.data

  const events = await prisma.event.create({
    data: {
      desc,
      starts: new Date(starts),
      ends: new Date(ends),
      location
    }
  })


  return res.status(201).json(events)
}