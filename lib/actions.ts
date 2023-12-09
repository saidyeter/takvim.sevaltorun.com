'use server'

import { revalidatePath } from 'next/cache'
import {
    TCreateEventRequestSchema,
    createEvent as createEventOnApi,
    getEvent as getEventFromApi,
    updateEvent as updateEventOnApi,
    deleteEvent as deleteEventOnApi,
} from './source-api';
import { redirect } from 'next/navigation';


export async function createEvent(data: TCreateEventRequestSchema) {

    if (await createEventOnApi(data)) {

        revalidatePath('/')
        redirect('/')
    }
    return false
}

export async function getEvent(id: number) {

    const data = await getEventFromApi(id)

    return data
}

export async function updateEvent(id: number, val: TCreateEventRequestSchema) {

    if (await updateEventOnApi(id, val)) {
        revalidatePath('/')
        redirect('/')
    }
    return false
}

export async function deleteEvent(id: number) {
    if (await deleteEventOnApi(id)) {
        revalidatePath('/')
        redirect('/')
    }
    return false
}