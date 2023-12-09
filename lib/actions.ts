'use server'

import { revalidatePath } from 'next/cache'
import { TCreateEventRequestSchema, createEvent as createEventOnApi } from './source-api';
import { redirect } from 'next/navigation';


export async function createEvent(data: TCreateEventRequestSchema) {
    console.log("data", data);

    if (await createEventOnApi(data)) {

        revalidatePath('/')
        redirect('/')
    }
    return {
        success: false,
    }
}
