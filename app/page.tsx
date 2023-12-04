import Link from "next/link"

import { dayInfo, getEvents } from "@/lib/source-api"

export default async function IndexPage({
  searchParams,
}: {
  searchParams: { y: string; m: string }
}) {
  const now = new Date()
  const year =
    searchParams &&
    searchParams.y &&
    !Number.isNaN(parseInt(searchParams.y)) &&
    parseInt(searchParams.y) > 2020 &&
    parseInt(searchParams.y) < 2030
      ? parseInt(searchParams.y)
      : now.getFullYear()

  const month =
    searchParams &&
    searchParams.m &&
    !Number.isNaN(parseInt(searchParams.m)) &&
    parseInt(searchParams.m) > 0 &&
    parseInt(searchParams.m) < 13
      ? parseInt(searchParams.m)
      : now.getMonth() + 1

  //   console.log(searchParams)

  const data = await getEvents(year, month)
  if (!data) {
    return <>bir hata olustu</>
  }
  // console.log("data", d)

  return (
    <section className="md:container p-2 flex flex-col justify-center items-center md:py-10 py-4">
      <div className="w-full text-2xl font-bold">
        {data.months.selectedDate.name} {data.months.selectedDate.year}
      </div>

      <div className="mt-4 flex w-full flex-col rounded-lg bg-muted md:p-4 p-1">
        <div className="flex w-full space-x-1">
          {["Pts", "Sal", "Crs", "Prs", "Cum", "Cts", "Pzr"].map((v, i) => (
            <HeaderCell txt={v} key={i} />
          ))}
        </div>
        {data.weeks.map((week, index) => {
          return <WeekRow key={index} week={week} />
        })}
      </div>
      <div className="flex w-full items-end justify-between my-4">
        <Link
          href={`?y=${data.months.previousDate.year}&m=${data.months.previousDate.month}`}
        >
          <div className="flex flex-col items-center justify-center text-lg text-muted-foreground hover:text-primary">
            <span>
              {data.months.previousDate.name} {data.months.previousDate.year}
            </span>
          </div>
        </Link>
        <Link
          href={`?y=${data.months.nextDate.year}&m=${data.months.nextDate.month}`}
        >
          <div className="flex flex-col items-center justify-center text-lg text-muted-foreground hover:text-primary">
            <span>
              {data.months.nextDate.name} {data.months.nextDate.year}
            </span>
          </div>
        </Link>
      </div>
      <div className="flex w-full flex-col gap-2">
        {data.events.map((value, index) => {
          return (
            <div
              key={index}
              className={`flex w-full flex-col rounded-lg gap-1 border-l-8 bg-muted p-2 pl-4`}
              style={{ borderColor: value.dayColor }}
            >
              <p className="text-muted-foreground">
                {getEventDates(new Date(value.starts), new Date(value.ends))}
              </p>
              <p className="font-semibold">{value.desc}</p>
            </div>
          )
        })}
      </div>
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
    <div className="flex md:h-16 h-10 w-full flex-col rounded-md">
      <div className="flex md:h-12 h-8 w-full flex-col items-center justify-center md:text-2xl text-md ">
        <span style={{ color: props.dayColor }}>
          {new Date(props.day ?? "")?.getDate()}
        </span>
      </div>
      <div className="flex md:h-4 h-2 w-full flex-row items-center justify-evenly">
        {props.info?.map((e, i) => {
          return (
            <div
              key={i}
              style={{ backgroundColor: e }}
              className="md:h-2 md:w-2 w-2 h-2 rounded-full"
            />
          )
        })}
      </div>
    </div>
  )
}

function HeaderCell(props: { txt: string }) {
  return (
    <div className="flex rounded-lg md:h-12 h-8 w-full flex-col items-center justify-center md:text-2xl text-muted-foreground font-bold ">
      {props.txt}
    </div>
  )
}
