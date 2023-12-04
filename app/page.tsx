import Link from "next/link"

import { siteConfig } from "@/config/site"
import { dayInfo, getEvents } from "@/lib/source-api"
import { buttonVariants } from "@/components/ui/button"

export default async function IndexPage() {
  const d = await getEvents(2023, 2)
  if (!d) {
    return <>loading...</>
  }
  console.log("data", d)

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <>
        <div className="flex w-full items-end justify-between">
          <Link
            href={`${d.months.previousDate.year}-${d.months.previousDate.month}`}
          >
            <div className="flex flex-col items-center justify-center text-xl text-slate-400 hover:text-slate-200">
              <span>{d.months.previousDate.name}</span>
              <span>{d.months.previousDate.year}</span>
            </div>
          </Link>
          <div className="flex flex-col items-center justify-center text-2xl font-bold text-white">
            <span>{d.months.selectedDate.name}</span>
            <span>{d.months.selectedDate.year}</span>
          </div>
          <Link href={`${d.months.nextDate.year}-${d.months.nextDate.month}`}>
            <div className="flex flex-col items-center justify-center text-xl text-slate-400 hover:text-slate-200">
              <span>{d.months.nextDate.name}</span>
              <span>{d.months.nextDate.year}</span>
            </div>
          </Link>
        </div>
        <>
          <div className="mt-4 flex w-full flex-col rounded-xl bg-white/10 p-4  text-white">
            {d.weeks.map((week, index) => {
              return <WeekRow key={index} week={week} />
            })}
          </div>

          <div className="mt-2 flex w-full flex-col gap-1">
            {d.events.map((value, index) => {
              return (
                <div
                  key={index}
                  className={`flex w-full flex-col gap-1 border-l-8 bg-white/10 p-2 pl-4 text-white`}
                  style={{ borderColor: value.dayColor }}
                >
                  <p className="font-light text-slate-300">
                    {getEventDates(
                      new Date(value.starts),
                      new Date(value.ends)
                    )}
                  </p>
                  <p className="font-semibold">{value.desc}</p>
                </div>
              )
            })}
          </div>
        </>
      </>
    </section>
  )
}

function getEventDates(starts: Date, ends: Date) {
  try {
    starts.setHours(0, 0, 0, 0)
    ends.setHours(0, 0, 0, 0)
    if (starts.getTime() === ends.getTime()) {
      return getLocaleDate(starts)
    }
    return getLocaleDate(starts) + "-" + getLocaleDate(ends)
  } catch (error) {
    console.log("error on getEventDates", error, starts, ends)
  }
}

// '2 Aralık'
function getLocaleDate(ms: Date) {
  return ms.toLocaleDateString("tr-TR", {
    // year: "numeric",
    month: "long",
    day: "numeric",
    // dateStyle:'long'
  })
}

function WeekRow(props: { week: dayInfo[] }) {
  return (
    <div className="flex w-full justify-around">
      {props.week.map((day, index) => (
        <WeekCell
          key={index}
          {...day}
          //day={day.dayNumber} color={day.color}
        />
      ))}
    </div>
  )
}

function WeekCell(props: dayInfo) {
  return (
    <>
      <div className="flex h-16 w-full flex-col items-center justify-center rounded-md  hover:bg-white/10">
        <div className="flex h-12 w-full flex-col items-center justify-center text-2xl">
          <span style={{ color: props.dayColor }}>
            {new Date(props.day ?? "")?.getDate()}
          </span>
        </div>
        <div className="flex h-4 w-full flex-row items-center justify-evenly">
          {props.info?.map((e, i) => {
            return (
              <div
                key={i}
                style={{ backgroundColor: e }}
                className="h-2 w-2 rounded-full"
              />
            )
          })}
        </div>
      </div>
    </>
  )
}
