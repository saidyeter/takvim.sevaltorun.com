import { and, gt, lt, or } from "drizzle-orm"
import { z } from "zod"
import { getMonths, getStartDayAndEndDayForMonth } from "./dater"
import { db } from "./db"
import { events } from "./db-schema"

const { env } = process
const baseUrl = env.DB_API_URL
const apiKey = env.DB_API_KEY ?? ''

export {
  createEvent, deleteEvent, getEvent, getEvents, updateEvent
}

function beforeReq() {
  if (process.env.NODE_ENV == 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }
}


interface event {
  id: number
  desc: string
  starts: string
  ends: string
  dayColor?: string
}

export interface dayInfo {
  dayColor?: string
  day: number
  info: string[],
  isToday?: boolean
};

type EventWithDayColor = typeof events.$inferSelect & { dayColor?: string }
async function getEvents(year: number, month: number) {
  beforeReq()
  try {

    const { startDay, endDay } = getStartDayAndEndDayForMonth(year, month)
    console.log('yooo 2', startDay.toLocaleDateString(), endDay.toLocaleDateString());

    const allEvents = await db
      .select()
      .from(events)
      .where(or(
        and(
          gt(events.starts_at, startDay),
          lt(events.starts_at, endDay)
        ), and(
          gt(events.ends_at, startDay),
          lt(events.ends_at, endDay)
        )
      ))
    // console.log('yooo 3', allEvents);

    const weeks: dayInfo[][] = []
    let week: dayInfo[] = []
    const eventsWithDayColor: EventWithDayColor[] = []
    for (let day = startDay; day <= endDay; day.setDate(day.getDate() + 1)) {
      const currentDayStarting = new Date(day.getTime())
      currentDayStarting.setHours(0, 0, 0, 0)
      const currentDayEnding = new Date(day.getTime())
      currentDayEnding.setHours(23, 59, 59, 999)


      const currentDayInfo: dayInfo = {
        day: day.getDate(),
        dayColor: colorizeProper(currentDayStarting, month),
        isToday: isToday(currentDayStarting),
        info: []
      }


      console.log('yooo 4', currentDayInfo);


      allEvents.
        filter(e =>
          !!e.starts_at && e.starts_at?.getTime() <= day.getTime() &&
          !!e.ends_at && e.ends_at.getTime() >= day.getTime())
        .forEach(e => {
          const color = pickColor(e.id)
          currentDayInfo.info?.push(color)
          eventsWithDayColor.push({
            ...e,
            dayColor: color
          })

        })
      week.push(currentDayInfo)
      if (day.getDay() == 0) {
        weeks.push(week)
        week = []
      }

    }
    if (week.length > 0) {
      weeks.push(week)
    }

    const obj = {
      weeks,
      events: eventsWithDayColor,
      months: getMonths(year, month)
    }
    return obj

  } catch (error) {
    console.log("getEvents error", error);
  }

  return undefined
}

export const createEventRequestSchema = z.object({
  starts: z.string().transform(p => new Date(p)),
  ends: z.string().transform(p => new Date(p)),
  desc: z.string()
})
export type TCreateEventRequestSchema = z.infer<typeof createEventRequestSchema>;

async function createEvent(req: TCreateEventRequestSchema) {
  beforeReq()
  // const url = encodeURI(baseUrl + "/takvim/event")
  const values: typeof events.$inferInsert = {
    starts_at: req.starts,
    ends_at: req.ends,
    desc: req.desc,
    created_at: new Date(),
  }
  try {
    // const response = await fetch(url, {
    //     method: "POST",
    //     headers: {
    //         'content-type': 'application/json',
    //         'Authorization': apiKey
    //     },
    //     body: JSON.stringify(req),
    //     cache: 'no-cache'
    // })

    const [res] = await db.insert(events).values(values).returning()



    if (res) {
      return true
    }
    console.log("createNewQuestion", res)

  } catch (error) {
    console.log("createNewQuestion error", error);
  }

  return false
}

async function deleteEvent(id: number) {
  beforeReq()
  const url = encodeURI(baseUrl + "/takvim/event/" + id)
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        'Authorization': apiKey
      },
      cache: 'no-cache'
    })
    if (response.ok) {
      return true
    }
    console.log("deleteEvent", response.status, await response.text(), url)

  } catch (error) {
    console.log("deleteEvent error", error);
  }

  return false
}

async function getEvent(id: number) {
  beforeReq()
  const url = encodeURI(baseUrl + "/takvim/event/" + id)
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Authorization': apiKey
      },
      cache: 'no-cache'
    })
    // console.log("getEvent222", response.status, await response.text(), url)
    if (response.ok) {
      const data = await response.json()
      return data as event
    }
    console.log("getEvent", response.status, await response.text(), url)

  } catch (error) {
    console.log("getEvent error", error);
  }

  return undefined
}

async function updateEvent(id: number, req: TCreateEventRequestSchema) {
  beforeReq()
  const url = encodeURI(baseUrl + "/takvim/event/" + id)
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        'content-type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify(req),
      cache: 'no-cache'
    })
    if (response.ok) {
      return true
    }
    console.log("updateEvent", response.status, await response.text(), url)

  } catch (error) {
    console.log("updateEvent error", error);
  }

  return false
}



const colors = [
  "#A6D0DD",
  "#FF6969",
  "#FFD3B0",
  "#E8A0BF",
  "#BA90C6",
  "#C7E9B0",
  "#CCD5AE",
  "#FFB4B4",
  "#FFACAC",
  "#FFAACF",
  "#FFCEFE",
  "#F8CBA6",
  "#CDE990",
  "#8DCBE6",
  "#FD8A8A",
  "#BCEAD5",
  "#9ED5C5",
  "#BCCEF8",
  "#ABD9FF",
  "#FFABE1",
  "#B1D7B4",
  "#F7ECDE",
  "#B2C8DF",
  "#C4D7E0",
  "#C7D36F",
  "#E0DECA",
  "#CDC2AE",
  "#92B4EC",
]

function pickColor(id: number) {
  var colorIndex = id % colors.length;
  return colors[colorIndex];
}


function colorizeProper(day: Date, currentMonth: number) {

  if (isInTheMonth(day, currentMonth)) {
    return 'hsl(var(--primary))'
  }

  return 'hsl(var(--muted-foreground))'

}

function isToday(day: Date | undefined) {
  if (!day) {
    return false
  }
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  if (now.getTime() == day.getTime()) {
    return true
  }

  return false
}
function isInTheMonth(day: Date | undefined, month: number) {
  if (!day) {
    return false
  }
  if (month - 1 == day.getMonth()) {
    return true
  }

  return false
}