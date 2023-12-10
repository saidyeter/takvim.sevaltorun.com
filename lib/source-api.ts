import { z } from "zod"

const { env } = process
const baseUrl = env.DB_API_URL
const apiKey = env.DB_API_KEY ?? ''

export {
    getEvents,
    createEvent,
    getEvent,
    updateEvent,
    deleteEvent
}

function beforeReq() {
    if (process.env.NODE_ENV == 'development') {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    }
}

interface months {
    selectedDate: {
        month: number;
        year: number;
        name: string;
    };
    previousDate: {
        month: number;
        year: number;
        name: string;
    };
    nextDate: {
        month: number;
        year: number;
        name: string;
    };
}

interface event {
    id: number
    desc: string
    starts: string
    ends: string
    dayColor?: string
    location?: string
}

export interface dayInfo {
    dayColor?: string
    day?: string
    info?: string[]
};

interface GetEventsResult {
    weeks: dayInfo[][],
    events: event[],
    months: months
}

async function getEvents(year: number, month: number) {
    beforeReq()
    const url = encodeURI(baseUrl + "/takvim/?year=" + year + "&month=" + month)
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': apiKey
            },
            cache: 'no-cache'
        })
        if (response.ok) {
            const data = await response.json()
            return data.result as GetEventsResult
        }
        console.log("getEvents", response.status, await response.text(), url)

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
    const url = encodeURI(baseUrl + "/takvim/event")

    try {
        const response = await fetch(url, {
            method: "POST",
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
        console.log("createNewQuestion", response.status, await response.text(), url)

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
