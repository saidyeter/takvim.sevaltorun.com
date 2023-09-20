import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { env } from "~/env.mjs";
import { createEvent, removeEvent, singleEvent, updateEvent } from "~/utils/source-api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('event');

  if (req.method === 'POST') {
    return await Post(req, res)
  } else if (req.method === 'GET') {
    return await Get(req, res)
  } else if (req.method === 'PUT') {
    return await Update(req, res)
  } else if (req.method === 'DELETE') {
    return await Remove(req, res)
  }
  return res.status(400).json({ err: `Unexpected method: ${req.method ?? ''}` })
}

async function Get(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ err: 'Id is expected' })
  }


  const bodySchema = z.object({
    id: z.string().transform(n => parseInt(n))
  })
  const validation = bodySchema.safeParse({ id })
  console.log('validation error', id, validation);

  if (!validation.success) {
    return res.status(400).json(validation.error)
  }
  const { id: validId } = validation.data
  const event = await singleEvent(validId)

  if (event) {
    return res.status(201).json(event)
  }

  return res.status(404).json({
    err: 'event not found'
  })


}

async function Post(req: NextApiRequest, res: NextApiResponse) {
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

  const events = await createEvent({
    desc,
    starts: new Date(starts),
    ends: new Date(ends),
    location: location
  })

  return res.status(201).json(events)
}

async function Update(req: NextApiRequest, res: NextApiResponse) {

  const { authorization } = req.headers

  if (!authorization ||
    typeof authorization !== 'string' ||
    authorization !== env.API_KEY) {
    console.log(authorization, 'Authorization are expected', env.API_KEY);
    return res.status(400).json({ err: 'Authorization are expected' })
  }
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ err: 'Id is expected' })
  }


  const querySchema = z.object({
    id: z.string().transform(n => parseInt(n))
  })
  const queryValidation = querySchema.safeParse({ id })
  console.log(queryValidation);

  if (!queryValidation.success) {
    return res.status(400).json(queryValidation.error)
  }
  const { id: validId } = queryValidation.data


  const bodySchema = z.object({
    desc: z.string(),
    starts: z.string().datetime(),
    ends: z.string().datetime(),
    location: z.string().optional(),
  })
  const validation = bodySchema.safeParse(req.body)
  // console.log(validation);

  if (!validation.success) {
    return res.status(400).json(validation.error)
  }
  const { desc, starts, ends, location } = validation.data

  const event = await updateEvent(validId, {
    desc,
    starts: new Date(starts),
    ends: new Date(ends),
    location
  })
  return res.status(200).json(event)
}



async function Remove(req: NextApiRequest, res: NextApiResponse) {

  const { authorization } = req.headers

  if (!authorization ||
    typeof authorization !== 'string' ||
    authorization !== env.API_KEY) {
    console.log(authorization, 'Authorization are expected', env.API_KEY);
    return res.status(400).json({ err: 'Authorization are expected' })
  }
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ err: 'Id is expected' })
  }


  const querySchema = z.object({
    id: z.string().transform(n => parseInt(n))
  })
  const queryValidation = querySchema.safeParse({ id })
  console.log(queryValidation);

  if (!queryValidation.success) {
    return res.status(400).json(queryValidation.error)
  }
  const { id: validId } = queryValidation.data

  const event = await singleEvent(validId)

  if (!event) {
    return res.status(200).json({
      msg: 'OK'
    })
  }

  const removedEvent = await removeEvent(validId)

  return res.status(200).json(removedEvent)
}