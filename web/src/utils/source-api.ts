import { env } from "~/env.mjs"
const baseUrl = env.DB_API_URL
const apiKey = env.DB_API_KEY

export {
    createEvent,
    singleEvent,
    getMonthlyEvents,
    updateEvent,
    removeEvent
}
export interface Event extends CreateEvent {
    id: string
    creationDate: Date
}
export interface CreateEvent {
    desc: string
    starts: Date
    ends: Date
    location: string | undefined
}


export interface EventWithString {
    id: string
    creationDate: string
    desc: string
    starts: string
    ends: string
    location: string | undefined
}

async function getMonthlyEvents(starts: Date, ends: Date) {

    const url = encodeURI(baseUrl + "/takvim/event/monthly?starts=" + starts.toJSON() + "&ends=" + ends.toJSON())
    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Authorization': apiKey
        }
    })
    if (response.ok) {
        const data = await response.json() as EventWithString[]
        return data.map((d: EventWithString) => {
            const result: Event = {
                id: d.id,
                creationDate: new Date(d.creationDate),
                desc: d.desc,
                starts: new Date(d.starts),
                ends: new Date(d.ends),
                location: d.location
            }
            return result
        })
    }
    console.log("getMonthlyEvents", response.status, await response.text(), url)
    return []
}


async function singleEvent(id: number) {

    try {
        const response = await fetch(baseUrl + "/takvim/Event/" + id, {
            method: "GET",
            headers: {
                'Authorization': apiKey
            },
        })
        if (response.ok) {
            const data = await response.json()
            return data as Event
        }
        else {
            console.log('not OK singleEvent', response.text());
        }
    } catch (error) {
        console.log("singleEvent", error)
    }
    return {} as Event
}

async function createEvent(data: CreateEvent) {
    const response = await fetch(baseUrl + "/takvim/Event", {
        method: "POST",
        headers: {
            'content-type': 'application/json',
            'Authorization': apiKey
        },
        body: JSON.stringify(data)
    })
    return response.ok
}


async function removeEvent(id: number) {

    try {
        const response = await fetch(baseUrl + "/takvim/Event/" + id, {
            method: "DELETE",
            headers: {
                'Authorization': apiKey
            },
        })

        return response.ok
    } catch (error) {
        console.log("removeEvent", error)
    }
    return false
}


async function updateEvent(id: number, data: CreateEvent) {

    console.log(1);

    try {
        const response = await fetch(baseUrl + "/takvim/Event/" + id, {
            method: "PATCH",
            headers: {
                'content-type': 'application/json',
                'Authorization': apiKey
            },
            body: JSON.stringify(data)
        })
        console.log(response.statusText);

        return response.ok
    } catch (error) {
        console.log("updateEvent", error)
    }
    return false
}