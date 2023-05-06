import { z } from "zod";

export default {
    getMonthlyEvents,
    getRelatedMonths
}


// const baseUrl = 'https://takvim.sevaltorun.com/api'
const baseUrl = 'http://localhost:3000/api'


const allowedDate = z.object({
    year: z.number().min(2019).max(2030),
    monthIndex: z.number().min(0).max(12)
})

const getMonthlyEventsApiResponseSchema = z.object({
    startWeekDay: z.number().min(0).max(31),
    monthLength: z.number().min(28).max(31),
    events: z.object({
        id: z.string(),
        createdAt: z.string().datetime(),
        desc: z.string(),
        starts: z.string().datetime(),
        ends: z.string().datetime(),
        location: z.string(),
    }).array()
})
const getMonthlyEventsResultSchema = z.object({
    startWeekDay: z.number().min(0).max(31),
    monthLength: z.number().min(28).max(31),
    events: z.object({
        id: z.string(),
        createdAt: z.date(),
        desc: z.string(),
        starts: z.date(),
        ends: z.date(),
        location: z.string(),
    }).array()
})

async function getMonthlyEvents(params: z.infer<typeof allowedDate>): Promise<z.infer<typeof getMonthlyEventsResultSchema> | undefined> {
    const query = Object.entries(params).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join('&');
    const url = baseUrl + '/calendar/events?' + query
    const res = await fetch(url)
    const resJson = await res.json()
    const validation = getMonthlyEventsApiResponseSchema.safeParse(resJson)
    if (validation.success) {
        const result = {
            startWeekDay: validation.data.startWeekDay,
            monthLength: validation.data.monthLength,
            events: validation.data.events.map(e => {
                return {
                    id: e.id,
                    createdAt: new Date(e.createdAt),
                    desc: e.desc,
                    starts: new Date(e.starts),
                    ends: new Date(e.ends),
                    location: e.location
                }
            })
        }
        return getMonthlyEventsResultSchema.parse(result)
    }
    console.log('calendar validation error', validation.error);
    return undefined
}
const monthDetailSchema=z.object({
    month:z.number().min(0).max(12),
    year: z.number().min(2019).max(2030),
    monthName: z.string()
})
const getRelatedMonthsResultSchema=z.object({
    selectedDate:monthDetailSchema,
    previousDate:monthDetailSchema,
    nextDate:monthDetailSchema
})

async function getRelatedMonths(params: z.infer<typeof allowedDate>): Promise<z.infer<typeof getRelatedMonthsResultSchema> | undefined> {
    const query = Object.entries(params).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join('&');
    const url = baseUrl + '/calendar/months?' + query
    const res = await fetch(url)
    const resJson = await res.json()
    const validation = getRelatedMonthsResultSchema.safeParse(resJson)
    if (validation.success) {
        return validation.data
    }
    console.log('calendar validation error', validation.error);
    return undefined
}
