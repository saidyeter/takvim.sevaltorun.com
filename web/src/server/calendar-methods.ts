import { z } from "zod"
import dater from "./dater"
import { pickColor } from "./color"
import { getMonthlyEvents as M } from "~/utils/source-api";
import type { Event } from "~/utils/source-api";

export default {
    getMonthlyEvents,
    getMonthlyEvents2
}

const allowedDate = z.object({
    year: z.number().min(2019).max(2030),
    monthIndex: z.number().min(0).max(12)
})

type CellProps = {
    //old
    dayNumber: number;
    color?: string;

    //new 
    dayColor?: string
    day?: Date
    info?: string[]
};

async function getMonthlyEvents2(input: z.infer<typeof allowedDate>) {

    const { startWeekDay, monthLength } = dater.getMonthBoundaries(input.year, input.monthIndex)

    const monthEnds = new Date(input.year, input.monthIndex + 1, 0)
    const starts = new Date(input.year, input.monthIndex, 1)
    const ends = new Date(input.year, input.monthIndex + 1, 1)

    const oneWeek = 7
    const sixWeeks = 6 * oneWeek
    const daysForOtherMonths = sixWeeks - monthEnds.getDate()
    const daysForPreviousMonth = startWeekDay - 1
    const daysForNextMonth = daysForOtherMonths - daysForPreviousMonth

    if (startWeekDay == 1 && monthLength == 28) {
        starts.setDate(starts.getDate() - oneWeek)
        ends.setDate(ends.getDate() + oneWeek)
    }
    else if (startWeekDay > 6 && monthLength == 30) {
        starts.setDate(starts.getDate() - daysForPreviousMonth)
        ends.setDate(ends.getDate() + daysForNextMonth)
    }
    else if (startWeekDay > 5 && monthLength == 31) {
        starts.setDate(starts.getDate() - daysForPreviousMonth)
        ends.setDate(ends.getDate() + daysForNextMonth)
    }
    else {
        starts.setDate(starts.getDate() - daysForPreviousMonth)
        ends.setDate(ends.getDate() + daysForNextMonth)
    }

    const events = await getEvents(starts, ends)

    const weeks: CellProps[][] = [];
    let week: CellProps[] = [];

    for (
        let day = new Date(starts.getTime());
        day < ends;
        day.setDate(day.getDate() + 1)
    ) {

        const currentDayStarting = new Date(day.getTime());
        currentDayStarting.setHours(0, 0, 0)
        const currentDayEnding = new Date(day.getTime());
        currentDayEnding.setHours(23, 59, 59)

        const cell: CellProps = {
            dayNumber: -1,
            day: currentDayStarting,
            dayColor: "white",
            info: []
        }

        events
            .filter(
                (e:Event) => e.starts <= currentDayEnding && e.ends >= currentDayStarting
            )
            .forEach(
                (e:Event) => {
                    cell.info?.push(pickColor(e.id))
                }
            )

        if (day.getMonth() !== input.monthIndex) {
            cell.dayColor = "grey"
        }

        week.push(cell)
        if (day.getDay() == 0) {
            weeks.push(week)
            week = []
        }
    }
    if (week.length > 0) {
        while (week.length % 7 != 0) {
            week.push({
                dayNumber: -1,
            });
        }
        weeks.push(week);
    }
    return {
        weeks,
        events
    }
}

async function getMonthlyEvents(input: z.infer<typeof allowedDate>) {

    const boundaries = dater.getMonthBoundaries(input.year, input.monthIndex)

    const monthStarts = new Date(input.year, input.monthIndex, 1)
    const monthEnds = new Date(input.year, input.monthIndex + 1, 1)
    const events = await getEvents(monthStarts, monthEnds)

    return {
        ...boundaries,
        events
    }
}


async function getEvents(starts: Date, ends: Date) {
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    try {
        return await M(starts, ends)
    } catch (error) {
        console.log('getEvents error: ', error);

    }
    return []
}


